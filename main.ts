import { createAgent, MessageEvent } from "./agent";

// example specification from https://platform.openai.com/docs/guides/reasoning?reasoning-prompt-examples=coding-planning
const specification = `Python app that takes user questions and looks them up in a 
database where they are mapped to answers. If there is a close match, it retrieves 
the matched answer. If there isn't, it asks the user to provide an answer and 
stores the question/answer pair in the database.`;

// Usage
async function main() {
  const codeAgent = createAgent();
  const run = codeAgent.run(specification);
  for await (const event of codeAgent.streamEvents()) {
    const msg = (event as MessageEvent).data.msg;
    console.log(`${msg}\n`);
  }
  const result = await run;
  console.log("Final code:\n", result.data.result);
}

main().catch(console.error);
