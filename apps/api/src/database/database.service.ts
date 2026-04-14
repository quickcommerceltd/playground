import { Injectable, type OnModuleInit } from "@nestjs/common";
import Database from "better-sqlite3";

@Injectable()
export class DatabaseService implements OnModuleInit {
	private db!: Database.Database;

	onModuleInit() {
		const dbPath = process.env.DATABASE_PATH || "./data.db";
		this.db = new Database(dbPath);
		this.db.pragma("journal_mode = WAL");
		this.createTables();
	}

	private createTables() {
		this.db.exec(`
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				email TEXT NOT NULL UNIQUE,
				phone TEXT,
				avatar_url TEXT,
				role TEXT DEFAULT 'customer',
				is_active INTEGER DEFAULT 1,
				created_at TEXT DEFAULT (datetime('now')),
				updated_at TEXT DEFAULT (datetime('now'))
			);

			CREATE TABLE IF NOT EXISTS products (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				description TEXT,
				price INTEGER NOT NULL,
				sku TEXT NOT NULL UNIQUE,
				category TEXT NOT NULL,
				brand TEXT,
				image_url TEXT,
				thumbnail_url TEXT,
				weight REAL,
				rating REAL DEFAULT 0,
				review_count INTEGER DEFAULT 0,
				in_stock INTEGER DEFAULT 0,
				stock_quantity INTEGER DEFAULT 0,
				discount_percent INTEGER DEFAULT 0,
				tags TEXT,
				created_at TEXT DEFAULT (datetime('now')),
				updated_at TEXT DEFAULT (datetime('now'))
			);
		`);
	}

	query<T = unknown>(sql: string, params: unknown[] = []): T[] {
		const stmt = this.db.prepare(sql);
		return stmt.all(...params) as T[];
	}

	get<T = unknown>(sql: string, params: unknown[] = []): T | undefined {
		const stmt = this.db.prepare(sql);
		return stmt.get(...params) as T | undefined;
	}

	run(sql: string, params: unknown[] = []) {
		const stmt = this.db.prepare(sql);
		return stmt.run(...params);
	}

	getConnection() {
		return this.db;
	}
}
