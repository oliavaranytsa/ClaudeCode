#!/usr/bin/env node

import { createInterface } from "readline";

const rl = createInterface({ input: process.stdin });
let input = "";

rl.on("line", (line) => (input += line));

rl.on("close", () => {
  const data = JSON.parse(input);
  const filePath = data?.tool_input?.file_path ?? "";

  if (filePath.endsWith(".env") || filePath.match(/(^|\/)\.env(\.|$)/)) {
    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: ".env files are protected",
        },
      })
    );
  }
});
