import { Database } from "sqlite3";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  created_at: string;
}

export async function getAvailableProducts(db: Database): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM products WHERE stock > 0 ORDER BY name`,
      [],
      (err, rows) => (err ? reject(err) : resolve(rows as Product[]))
    );
  });
}

export async function getLowStockProducts(
  db: Database,
  threshold: number = 5
): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM products WHERE stock <= ? ORDER BY stock`,
      [threshold],
      (err, rows) => (err ? reject(err) : resolve(rows as Product[]))
    );
  });
}