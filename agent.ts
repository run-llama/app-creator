import {
  Context,
  StartEvent,
  StopEvent,
  Workflow,
  WorkflowEvent,
} from "@llamaindex/core/workflow";
import { OpenAI, Settings } from "llamaindex";
import { PackageEvent, packager } from "./packager";

const MAX_REVIEWS = 3;

// Create custom event types
export class MessageEvent extends WorkflowEvent<{ msg: string }> {}
class CodeEvent extends WorkflowEvent<{ code: string }> {}
class ReviewEvent extends WorkflowEvent<{
  review: string;
  code: string;
}> {}

// Helper function to truncate long strings
const truncate = (str: string) => {
  const MAX_LENGTH = 60;
  if (str.length <= MAX_LENGTH) return str;
  return str.slice(0, MAX_LENGTH) + "...";
};

// the architect is responsible for writing the structure and the initial code based on the specification
const architect = async (context: Context, ev: StartEvent) => {
  // get the specification from the start event and save it to context
  context.set("specification", ev.data.input);
  const spec = context.get("specification");
  // write a message to send an update to the user
  context.writeEventToStream(
    new MessageEvent({
      msg: `Writing app using this specification: ${truncate(spec)}`,
    }),
  );
  const prompt = `Build an app for this specification: <spec>${spec}</spec>. Make a plan for the directory structure you'll need, then return each file in full. Don't supply any reasoning, just code.`;
  const code = await Settings.llm.complete({ prompt });
  return new CodeEvent({ code: code.text });
};

// the coder is responsible for updating the code based on the review
const coder = async (context: Context, ev: ReviewEvent) => {
  // get the specification from the context
  const spec = context.get("specification");
  // get the latest review and code
  const { review, code } = ev.data;
  // write a message to send an update to the user
  context.writeEventToStream(
    new MessageEvent({
      msg: `Update code based on review: ${truncate(review)}`,
    }),
  );
  const prompt = `We need to improve code that should implement this specification: <spec>${spec}</spec>. Here is the current code: <code>${code}</code>. And here is a review of the code: <review>${review}</review>. Improve the code based on the review, keep the specification in mind, and return the full updated code. Don't supply any reasoning, just code.`;
  const updatedCode = await Settings.llm.complete({ prompt });
  return new CodeEvent({ code: updatedCode.text });
};

// the reviewer is responsible for reviewing the code and providing feedback
const reviewer = async (context: Context, ev: CodeEvent) => {
  // get the specification from the context
  const spec = context.get("specification");
  // get latest code from the event
  const { code } = ev.data;
  // update and check the number of reviews
  const numberReviews = context.get("numberReviews", 0) + 1;
  context.set("numberReviews", numberReviews);
  if (numberReviews > MAX_REVIEWS) {
    // the we've done this too many times - return the code
    context.writeEventToStream(
      new MessageEvent({
        msg: `Already reviewed ${numberReviews - 1} times, stopping!`,
      }),
    );
    return new StopEvent({ result: code });
  }
  // write a message to send an update to the user
  context.writeEventToStream(
    new MessageEvent({ msg: `Review #${numberReviews}: ${truncate(code)}` }),
  );
  const prompt = `Review this code: <code>${code}</code>. Check if the code quality and whether it correctly implements this specification: <spec>${spec}</spec>. If you're satisfied, just return 'Looks great', nothing else. If not, return a review with a list of changes you'd like to see.`;
  const review = (await Settings.llm.complete({ prompt })).text;
  if (review.includes("Looks great")) {
    // the reviewer is satisfied with the code, let's return the review
    context.writeEventToStream(
      new MessageEvent({
        msg: `Reviewer says: ${review}`,
      }),
    );
    return new PackageEvent({ code });
  }

  return new ReviewEvent({ review, code });
};

export function createAgent(model: string): Workflow {
  const codeAgent = new Workflow({ validate: true });
  codeAgent.addStep(StartEvent, architect, { outputs: CodeEvent });
  codeAgent.addStep(ReviewEvent, coder, { outputs: CodeEvent });
  codeAgent.addStep(CodeEvent, reviewer, {
    outputs: [ReviewEvent, PackageEvent],
  });
  codeAgent.addStep(PackageEvent, packager, { outputs: StopEvent });

  // Update the llm model with the provided model
  Settings.llm = new OpenAI({ model, temperature: 1 });

  return codeAgent;
}
