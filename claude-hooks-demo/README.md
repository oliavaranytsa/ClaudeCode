# E-commerce AI Assistant

A TypeScript e-commerce backend that demonstrates Claude Code hooks and the Anthropic SDK. The project uses SQLite for storage and integrates Claude to automate code quality checks during development.

## What this project is about

This project has two purposes:

1. **Working e-commerce backend** — SQLite database with customers, orders, and products; typed query functions; a seeded main entry point.
2. **Claude Code hooks demo** — shows how to wire up automated TypeScript checking, AI-powered duplicate detection, and debug logging so they run automatically as Claude writes code.

---

## Project Structure

```
claude-hooks-demo/
├── src/
│   ├── schema.ts                  # Creates customers and orders tables
│   ├── main.ts                    # Seeds the DB and queries stale pending orders
│   └── queries/
│       ├── customer_queries.ts    # getActiveCustomers, getCustomerByEmail
│       ├── order_queries.ts       # getPendingOrders
│       └── product_queries.ts     # getAvailableProducts, getLowStockProducts
├── scripts/
│   └── analyze-code.ts            # Runs Claude CLI to audit src/ for code issues
├── .claude/
│   ├── settings.json              # Hook configuration
│   ├── hooks/
│   │   ├── typecheck.sh           # PostToolUse: runs tsc after every file edit
│   │   └── query_hook.js          # PreToolUse: checks for duplicate queries via Claude API
│   └── commands/
│       ├── audit.md               # /audit slash command
│       └── review.md              # /review slash command
├── analyze-code.ts                # Root-level alias for the SDK script
├── .env.example                   # Environment variable template
└── ecommerce.db                   # SQLite database (auto-created on first run)
```

---

## How Hooks Work

Hooks are shell commands Claude Code runs automatically in response to tool events. They are configured in `.claude/settings.json`.

### 1. TypeScript Check (PostToolUse)

**Trigger:** After every `Write`, `Edit`, or `MultiEdit` tool call.

**What it does:** Runs `npx tsc --noEmit` from the project root. If TypeScript finds errors, Claude sees them immediately and can fix them before moving on.

**File:** `.claude/hooks/typecheck.sh`

```bash
#!/bin/bash
cd "$(dirname "$0")/../.."
npx tsc --noEmit 2>&1
```

### 2. Duplicate Query Prevention (PreToolUse)

**Trigger:** Before every `Write` tool call that targets a file inside `src/queries/`.

**What it does:** Reads all existing query files, then asks Claude (via the Anthropic SDK) whether the new file duplicates functionality that already exists. If a duplicate is found, the hook exits with code `2`, which blocks the write and prints an explanation. If everything looks fine, it exits `0` and the write proceeds.

**File:** `.claude/hooks/query_hook.js`

This is the key pattern:
- Exit `0` → allow the tool call
- Exit `2` → block the tool call and surface the hook's stdout to Claude

### 3. Debug Logging (PostToolUse)

**Trigger:** After every `Write`, `Edit`, or `MultiEdit` tool call (runs alongside the TypeScript check).

**What it does:** Appends the raw hook JSON payload to `/tmp/hook-debug-log.json`. Useful for inspecting exactly what data Claude Code sends to hooks.

To view the log:
```bash
cat /tmp/hook-debug-log.json | jq .
```

### Hook configuration (`settings.json`)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/typecheck.sh" },
          { "type": "command", "command": "cat >> /tmp/hook-debug-log.json" }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          { "type": "command", "command": "node .claude/hooks/query_hook.js" }
        ]
      }
    ]
  }
}
```

---

## Custom Slash Commands

### `/audit`
Runs a full security and TypeScript audit:
1. `npm audit` — finds vulnerable packages
2. `npm audit fix` — applies safe patches
3. `npx tsc --noEmit` — checks for type errors
4. Reports what changed and what remains

### `/review <file>`
Reviews a specific file for:
- Code quality issues
- Missing error handling
- TypeScript type safety
- Duplicate code
- Security vulnerabilities

Usage: `/review src/queries/order_queries.ts`

---

## How to Run the SDK Scripts

### Prerequisites

```bash
cp .env.example .env
# Fill in ANTHROPIC_API_KEY
npm install
```

### Run the main app

Seeds the database with sample customers and orders, then queries for pending orders older than 3 days.

```bash
npx ts-node src/main.ts
```

### Run the AI code analysis script

Uses the Claude CLI (`claude -p`) to analyze `src/` for code quality issues, duplicates, and missing error handling.

```bash
npx ts-node analyze-code.ts
# or
npx ts-node scripts/analyze-code.ts
```

### Type check only

```bash
npx tsc --noEmit
```

---

## What Each File Does

| File | Purpose |
|------|---------|
| `src/schema.ts` | Creates `customers` and `orders` tables with constraints and enums |
| `src/main.ts` | Entry point — opens the DB, runs schema, seeds data, queries stale orders |
| `src/queries/customer_queries.ts` | `getActiveCustomers` and `getCustomerByEmail` — typed with a `Customer` interface |
| `src/queries/order_queries.ts` | `getPendingOrders` — returns all orders with `status = 'pending'` |
| `src/queries/product_queries.ts` | `getAvailableProducts` and `getLowStockProducts` — typed with a `Product` interface |
| `analyze-code.ts` | Shells out to `claude -p` to get a brief code quality report on `src/` |
| `.claude/hooks/typecheck.sh` | Runs `tsc --noEmit`; failures surface as errors in Claude's context |
| `.claude/hooks/query_hook.js` | Calls Claude API to detect duplicate query logic before a new file is written |
| `.claude/settings.json` | Wires hooks to tool events (`PreToolUse`, `PostToolUse`) |
| `.claude/commands/audit.md` | Definition for the `/audit` custom command |
| `.claude/commands/review.md` | Definition for the `/review` custom command |
| `.env.example` | Template for required environment variables |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Required for `query_hook.js` and `analyze-code.ts` |
| `DATABASE_URL` | SQLite path (default: `sqlite://ecommerce.db`) |
| `STRIPE_SECRET_KEY` | Placeholder for payment integration |
| `NODE_ENV` | `development` or `production` |
| `PORT` | HTTP port (default: `3000`) |
