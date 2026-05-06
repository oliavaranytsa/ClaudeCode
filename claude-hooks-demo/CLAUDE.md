# E-commerce AI Assistant

A TypeScript e-commerce backend with AI-powered automation using Claude Code hooks and SDK.

## Project Structure

- `src/schema.ts` — Database schema (customers, orders, products tables)
- `src/main.ts` — Main entry point
- `src/queries/` — Database query functions
- `scripts/` — AI-powered automation scripts
- `.claude/hooks/` — Claude Code hooks
- `.claude/commands/` — Custom slash commands

## Commands

- `npx tsc --noEmit` — TypeScript type checking
- `npx ts-node src/main.ts` — Run the app
- `npx ts-node scripts/analyze-code.ts` — Analyze code quality

## Hooks

- `PostToolUse` — Runs TypeScript check after every file edit
- `PreToolUse` — Checks for duplicate queries before writing
- `PostToolUse` — Logs hook data for debugging (jq)

## Custom Commands

- `/audit` — Run security and TypeScript audit
- `/review $ARGUMENTS` — Review specific file for issues

## Code Style

- Use TypeScript interfaces for all database types
- Wrap all db calls in Promises
- Use comments sparingly — only for complex logic