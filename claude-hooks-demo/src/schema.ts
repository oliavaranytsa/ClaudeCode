import { Database } from "sqlite3";

export async function createSchema(db: Database, verbose: boolean) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      status TEXT CHECK(status IN ('active', 'inactive', 'suspended')),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}