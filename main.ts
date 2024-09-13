import { createAgent, MessageEvent } from "./agent";
import * as fs from 'fs/promises';
import * as path from 'path';

const apps = [
  {
    name: "Python QA Database",
    spec: `Python app that takes user questions and looks them up in a 
database where they are mapped to answers. If there is a close match, it retrieves 
the matched answer. If there isn't, it asks the user to provide an answer and 
stores the question/answer pair in the database.`,
    models: ["gpt-4o-mini", "gpt-4o", "o1-mini", "o1-preview"]
  },
  {
    name: "JavaScript Todo App",
    spec: `Create a full-stack NextJS todo app with a TailwindCSS frontend, that allows users to add, 
remove, and mark tasks as complete. Use a Postgres database to persist the tasks.`,
    models: ["gpt-4o-mini", "gpt-4o", "o1-mini"]  // didn't complete with o1-preview
  }
  // Add more specifications as needed
];

async function runGeneration(name: string, spec: string, model: string) {
  console.log(`Running generation with model: ${model}`);
  const codeAgent = createAgent(model);
  const run = codeAgent.run(spec);
  for await (const event of codeAgent.streamEvents()) {
    const msg = (event as MessageEvent).data.msg;
    console.log(`${msg}\n`);
  }
  const result = await run;
  
  // Create output directory if it doesn't exist
  const outputDir = path.join('output', name);
  await fs.mkdir(outputDir, { recursive: true });
  
  // Write the generated code to a file
  const outputFile = path.join(outputDir, `${model}.code`);
  await fs.writeFile(outputFile, result.data.result);
  console.log(`Generated code written to: ${outputFile}\n`);
}

async function main() {
  for (const specItem of apps) {
    console.log(`\n--- Starting generation: ${specItem.name} ---\n`);
    for (const model of specItem.models) {
      await runGeneration(specItem.name, specItem.spec, model);
    }
    console.log(`\n--- Finished generation: ${specItem.name} ---\n`);
  }
}

main().catch(console.error);
