import sqlite3 from "sqlite3";
import { createSchema } from "./schema";

async function main() {
  const db = new sqlite3.Database("ecommerce.db");

  await createSchema(db, false);
}

main();