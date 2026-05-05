import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const REVIEW_DIR = "src/queries";

async function main() {
  const input = await new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });

  const hookData = JSON.parse(input);
  const toolInput = hookData.tool_input;
  const filePath = toolInput.file_path || toolInput.path;

  if (!filePath || !filePath.includes(REVIEW_DIR)) {
    process.exit(0);
  }

  // Read all existing files in queries dir
  const queriesDir = path.resolve(REVIEW_DIR);
  const existingFiles = fs.readdirSync(queriesDir)
    .filter(f => f.endsWith(".ts") && f !== path.basename(filePath))
    .map(f => {
      const content = fs.readFileSync(path.join(queriesDir, f), "utf-8");
      return `File: ${f}\n${content}`;
    })
    .join("\n\n");

  const newContent = toolInput.content || toolInput.new_content || "";

  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: `Review this new file and check if similar functionality already exists.

Existing files in ${REVIEW_DIR}:
${existingFiles}

New file being created (${path.basename(filePath)}):
${newContent}

If similar functionality exists, explain which function to use instead.
If no duplicates, just say "Changes look appropriate."`
    }]
  });

  const result = message.content[0].text;

  if (result.includes("Changes look appropriate")) {
    process.exit(0);
  }

  console.log(result);
  process.exit(2);
}

main();