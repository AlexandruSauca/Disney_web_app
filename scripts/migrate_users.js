const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(process.cwd(), 'disney.db');
const db = new Database(dbPath);

console.log('Migrating users table...');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const adminUser = 'admin';
const adminPass = 'admin';

const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(adminUser);

if (!existing) {
    const hash = bcrypt.hashSync(adminPass, 10);
    db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(adminUser, hash);
    console.log(`Created default admin user: ${adminUser}`);
} else {
    console.log('Admin user already exists.');
}

console.log('Migration complete.');
