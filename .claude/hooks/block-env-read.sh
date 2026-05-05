#!/bin/bash
file_path=$(jq -r '.tool_input.file_path // empty')
if [[ "$file_path" == *.env ]]; then
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":".env files are protected"}}\n'
fi
