import { Database } from "sqlite3";

export async function getPendingOrders(db: Database): Promise<any[]> {
  const query = `
    SELECT
      id,
      customer_id,
      status,
      total,
      created_at
    FROM orders
    WHERE status = 'pending'
    ORDER BY created_at
  `;
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}