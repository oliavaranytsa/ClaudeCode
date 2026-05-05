import sqlite3 from "sqlite3";
import { createSchema } from "./schema";

async function main() {
  const db = new sqlite3.Database("ecommerce.db");

  await createSchema(db, false);

  await new Promise<void>((resolve, reject) => {
    db.exec(
      `INSERT OR IGNORE INTO customers (email, first_name, last_name, status) VALUES
        ('alice@example.com', 'Alice', 'Smith', 'active'),
        ('bob@example.com', 'Bob', 'Jones', 'active');

       INSERT INTO orders (customer_id, status, total, created_at) VALUES
        (1, 'pending',  49.99, datetime('now', '-5 days')),
        (1, 'pending', 120.00, datetime('now', '-4 days')),
        (2, 'pending',  15.50, datetime('now', '-1 day')),
        (2, 'shipped',  89.00, datetime('now', '-6 days'));`,
      (err) => (err ? reject(err) : resolve())
    );
  });

  const rows: any[] = await new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM orders
       WHERE status = 'pending'
         AND created_at <= datetime('now', '-3 days')`,
      (err, rows) => (err ? reject(err) : resolve(rows))
    );
  });

  console.log(`Pending orders older than 3 days (${rows.length}):`);
  rows.forEach((order) => console.log(order));
}

main();