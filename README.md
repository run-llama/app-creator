# App Creator

This project uses a multi-agent pattern with different OpenAI models (including the new [o1 models](https://platform.openai.com/docs/guides/reasoning)) to generate code for various applications based on provided specifications.

The multi-agents are implemented using [Workflows](https://ts.llamaindex.ai/modules/workflows) from [LlamaIndex](https://www.llamaindex.ai/).

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/run-llama/app-creator.git
   cd app-creator
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Run the project:
   ```
   pnpm start
   ```

This will generate code for the specified applications and models (see the `apps` constant in `main.ts`). The generated code will be saved in the `output` directory.

## Project Structure

- `main.ts`: Main script that runs the code generation process
- `agent.ts`: Contains the AI agent implementation
- `output/`: Directory where generated code is saved to

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Learn More

To learn more about LlamaIndex, take a look at the following resources:

- [LlamaIndexTS Documentation](https://ts.llamaindex.ai) - learn about LlamaIndex (Typescript).

You can check out [the LlamaIndexTS GitHub repository](https://github.com/run-llama/LlamaIndexTS) - your feedback and contributions are welcome!
