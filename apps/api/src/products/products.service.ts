import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class ProductsService {
  constructor(private readonly db: DatabaseService) {}

  findAll() {
    return this.db.query(
      "SELECT * FROM products where stock_quantity > 0 ORDER BY id ASC",
    );
  }

  findById(id: number) {
    return this.db.get("SELECT * FROM products WHERE id = ?", [id]);
  }

  create(data: {
    name: string;
    description?: string;
    price: number;
    sku: string;
    category: string;
    brand?: string;
  }) {
    const result = this.db.run(
      "INSERT INTO products (name, description, price, sku, category, brand) VALUES (?, ?, ?, ?, ?, ?)",
      [
        data.name,
        data.description || null,
        data.price,
        data.sku,
        data.category,
        data.brand || null,
      ],
    );
    return this.db.get("SELECT * FROM products WHERE id = ?", [
      result.lastInsertRowid,
    ]);
  }
}
