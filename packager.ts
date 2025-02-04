import { zodToJsonSchema } from "zod-to-json-schema";
import { HandlerContext, StopEvent, WorkflowEvent } from "@llamaindex/workflow";
import { OpenAI } from "llamaindex";
import { z } from "zod";
import { Context } from "./agent";

export class PackageEvent extends WorkflowEvent<{
  code: string;
}> {}

const FileSchema = z.object({
  path: z.string().describe("Path to the filename, e.g., 'app/main.py'"),
  content: z.string().describe("Complete content of the file"),
});

const PackageResultSchema = z.object({
  files: z.array(FileSchema),
});

export type PackageResult = z.infer<typeof PackageResultSchema>;

export const packager = async (
  context: HandlerContext<Context>,
  ev: PackageEvent,
) => {
  const { code } = ev.data;

  // use own llm for extracting the files
  const llm = new OpenAI({
    model: "gpt-4o",
    additionalChatOptions: { response_format: { type: "json_object" } },
  });

  const schema = JSON.stringify(zodToJsonSchema(PackageResultSchema));

  const response = await llm.chat({
    messages: [
      {
        role: "system",
        content: `You are an expert in extracting single files (path and content) from one large string.\n\nGenerate a valid JSON following the given schema below:\n\n${schema}`,
      },
      {
        role: "user",
        content: `Here is the large string: \n------\n${code}\n------`,
      },
    ],
  });

  const json = response.message.content as string;
  const result = PackageResultSchema.parse(JSON.parse(json));

  return new StopEvent<PackageResult>(result);
};
