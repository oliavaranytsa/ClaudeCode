import { Database } from "sqlite3";

interface Customer {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  updated_at: string;
}

export async function getActiveCustomers(db: Database): Promise<Customer[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM customers WHERE status = 'active' ORDER BY first_name`,
      [],
      (err, rows) => (err ? reject(err) : resolve(rows as Customer[]))
    );
  });
}

export async function getCustomerByEmail(
  db: Database,
  email: string
): Promise<Customer | null> {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM customers WHERE email = ?`,
      [email],
      (err, row) => (err ? reject(err) : resolve((row as Customer) || null))
    );
  });
}