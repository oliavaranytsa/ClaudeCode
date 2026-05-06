import { execSync } from "child_process";

const result = execSync(
  'claude -p "Analyze ./src directory for code quality issues, duplicate code, and missing error handling. Be brief."',
  { encoding: "utf-8", cwd: process.cwd() }
);

console.log(result);