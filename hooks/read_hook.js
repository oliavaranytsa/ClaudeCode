#!/usr/bin/env node

import { createInterface } from "readline";

const rl = createInterface({ input: process.stdin });
let input = "";

rl.on("line", (line) => (input += line));

rl.on("close", () => {
  const data = JSON.parse(input);
  const filePath = data?.tool_input?.file_path ?? "";

  const isEnv = filePath.endsWith(".env") || filePath.match(/(^|\/)\.env(\.|$)/);
  const isSensitive = isEnv || filePath.endsWith(".pem") || filePath.endsWith(".key");

  if (isSensitive) {
    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: "sensitive files are protected",
        },
      })
    );
  }
});
