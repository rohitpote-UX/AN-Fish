// Creates the database tables and the Abnexa super-admin. Safe to re-run.
// Usage: node --env-file=.env.local scripts/db-init.mjs
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const name = process.env.DB_NAME || "anfish";
const conn = await mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  multipleStatements: true,
});
await conn.query(`CREATE DATABASE IF NOT EXISTS \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
await conn.changeUser({ database: name });

await conn.query(`
CREATE TABLE IF NOT EXISTS branches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  address VARCHAR(400) NULL,
  lat DECIMAL(9,6) NULL,
  lng DECIMAL(9,6) NULL,
  whatsapp VARCHAR(20) NULL,
  open_time VARCHAR(40) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login_id VARCHAR(160) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  role ENUM('super_admin','branch_admin') NOT NULL,
  branch_id INT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB;
`);

const loginId = (process.env.SUPERADMIN_LOGIN || "9689030301").toLowerCase();
const password = process.env.SUPERADMIN_PASSWORD;
if (!password) throw new Error("Set SUPERADMIN_PASSWORD in .env.local first");
const hash = await bcrypt.hash(password, 12);
await conn.query(
  `INSERT INTO users (login_id, name, password_hash, role) VALUES (?, 'Abnexa', ?, 'super_admin')
   ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), name = 'Abnexa', role = 'super_admin'`,
  [loginId, hash],
);
console.log(`OK: database "${name}" ready. Super admin login id: ${loginId}`);
await conn.end();
