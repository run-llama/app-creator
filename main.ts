import { createAgent, MessageEvent } from "./agent";

const MODELS = ["gpt-4o-mini", "o1-preview"];

const apps = [
  {
    name: "Python QA Database",
    spec: `Python app that takes user questions and looks them up in a 
database where they are mapped to answers. If there is a close match, it retrieves 
the matched answer. If there isn't, it asks the user to provide an answer and 
stores the question/answer pair in the database.`,
    models: MODELS
  },
  {
    name: "JavaScript Todo App",
    spec: `Create a full-stack NextJS todo app with a TailwindCSS frontend, that allows users to add, 
remove, and mark tasks as complete. Use a Postgres database to persist the tasks.`,
    models: MODELS
  }
  // Add more specifications as needed
];

async function runGeneration(spec: string, model: string) {
  console.log(`Running generation with model: ${model}`);
  const codeAgent = createAgent(model);
  const run = codeAgent.run(spec);
  for await (const event of codeAgent.streamEvents()) {
    const msg = (event as MessageEvent).data.msg;
    console.log(`${msg}\n`);
  }
  const result = await run;
  console.log("Final code:\n", result.data.result);
}

async function main() {
  for (const specItem of apps) {
    console.log(`\n--- Starting specification: ${specItem.name} ---\n`);
    for (const model of specItem.models) {
      await runGeneration(specItem.spec, model);
    }
    console.log(`\n--- Finished specification: ${specItem.name} ---\n`);
  }
}

main().catch(console.error);
