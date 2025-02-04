import { createAgent, MessageEvent } from "./agent";
import * as fs from "fs/promises";
import * as path from "path";
import { PackageResult } from "./packager";
import { StopEvent } from "@llamaindex/workflow";

const apps = [
  {
    name: "Python QA Database",
    spec: `Python app that takes user questions and looks them up in a 
database where they are mapped to answers. If there is a close match, it retrieves 
the matched answer. If there isn't, it asks the user to provide an answer and 
stores the question/answer pair in the database.`,
    models: ["gpt-4o-mini", "gpt-4o", "o1-mini", "o1-preview"],
  },
  {
    name: "JavaScript Todo App",
    spec: `Create a full-stack NextJS todo app with a TailwindCSS frontend, that allows users to add, 
remove, and mark tasks as complete. Use a Postgres database to persist the tasks.`,
    models: ["gpt-4o-mini", "gpt-4o", "o1-mini"], // didn't complete with o1-preview
  },
  {
    name: "Iphone calculator",
    spec: `Iphone style scientific calculator in one html file, using tailwind css and javascript.`,
    models: ["gpt-4o-mini", "gpt-4o", "o1-mini", "o3-mini"],
  },
  // Add more specifications as needed
];

async function outputResult(
  name: string,
  model: string,
  packageResult: PackageResult,
) {
  // Generate timestamp
  const timestamp = new Date().toISOString().slice(0, 10);

  // Create output directory if it doesn't exist
  const outputDir = path.join("output", timestamp, name, model);
  await fs.mkdir(outputDir, { recursive: true });

  try {
    // Iterate over all files in the packageResult and store each file with their correct path
    for (const file of packageResult.files) {
      const filePath = path.join(outputDir, file.path);
      const fileDir = path.dirname(filePath);

      // Create directory if it doesn't exist
      await fs.mkdir(fileDir, { recursive: true });

      // Write file content
      await fs.writeFile(filePath, file.content);
      console.log(`File written to: ${filePath}`);
    }
  } catch (error) {
    console.error("Error in outputResult:", error);
    const errorLogPath = path.join(outputDir, "error.log");
    const errorContent = `Error: ${error}\n\nPackageResult structure:\n${JSON.stringify(packageResult, null, 2)}`;
    await fs.writeFile(errorLogPath, errorContent);
    console.log(`Error details written to: ${errorLogPath}`);
  }
}

async function runGeneration(name: string, spec: string, model: string) {
  console.log(`Running generation with model: ${model}`);
  const codeAgent = createAgent(model);
  const run = codeAgent.run(spec).with({
    specification: spec,
    numberReviews: 0,
  });
  for await (const event of run) {
    if (event instanceof MessageEvent) {
      const msg = (event as MessageEvent).data.msg;
      console.log(`${msg}\n`);
    } else if (event instanceof StopEvent) {
      const packageResult = (event as StopEvent<PackageResult>).data;
      await outputResult(name, model, packageResult);
    }
  }
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
