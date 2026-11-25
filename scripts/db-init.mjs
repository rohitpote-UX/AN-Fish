// Creates the database tables and the Abnexa super-admin. Safe to re-run.
// Usage: node --env-file=.env.local scripts/db-init.mjs
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

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
  role ENUM('abnexa','super_admin','branch_admin') NOT NULL,
  branch_id INT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS fish_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  name_mr VARCHAR(160) NOT NULL,
  name_en VARCHAR(160) NOT NULL,
  category VARCHAR(30) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;
-- One row per branch + fish + day. sold = opening + added - closing.
CREATE TABLE IF NOT EXISTS stock_days (
  branch_id INT NOT NULL,
  fish_id INT NOT NULL,
  day DATE NOT NULL,
  price_per_kg DECIMAL(8,2) NOT NULL DEFAULT 0,
  opening_kg DECIMAL(8,2) NOT NULL DEFAULT 0,
  added_kg DECIMAL(8,2) NOT NULL DEFAULT 0,
  closing_kg DECIMAL(8,2) NULL,
  sold_out TINYINT(1) NOT NULL DEFAULT 0,
  updated_by INT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (branch_id, fish_id, day),
  FOREIGN KEY (branch_id) REFERENCES branches(id),
  FOREIGN KEY (fish_id) REFERENCES fish_items(id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(15) NOT NULL,
  note VARCHAR(300) NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('new','confirmed','ready','completed','cancelled') NOT NULL DEFAULT 'new',
  handled_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_branch_day (branch_id, created_at),
  FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  fish_id INT NOT NULL,
  fish_name VARCHAR(160) NOT NULL,
  qty_kg DECIMAL(6,2) NOT NULL,
  price_per_kg DECIMAL(8,2) NOT NULL,
  cut VARCHAR(80) NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (fish_id) REFERENCES fish_items(id)
) ENGINE=InnoDB;
`);

// Upgrades for databases created before billing existed (safe to re-run).
await conn.query(`ALTER TABLE users MODIFY role ENUM('abnexa','super_admin','branch_admin','counter') NOT NULL`);
await conn.query(`ALTER TABLE branches ADD COLUMN IF NOT EXISTS monthly_fee DECIMAL(10,2) NOT NULL DEFAULT 0`);
await conn.query(`
CREATE TABLE IF NOT EXISTS branch_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT NOT NULL,
  month CHAR(7) NOT NULL,            -- YYYY-MM the payment is for
  amount DECIMAL(10,2) NOT NULL,
  paid_on DATE NOT NULL,
  method VARCHAR(40) NULL,
  note VARCHAR(200) NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_branch_month (branch_id, month),
  FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB;
`);

await conn.query(`
CREATE TABLE IF NOT EXISTS wastage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT NOT NULL,
  fish_id INT NOT NULL,
  day DATE NOT NULL,
  qty_kg DECIMAL(8,2) NOT NULL,
  reason ENUM('spoilage','cleaning_loss','damaged','quality_rejection','other') NOT NULL,
  cost_per_kg DECIMAL(8,2) NOT NULL DEFAULT 0,
  note VARCHAR(300) NULL,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_w (branch_id, day),
  FOREIGN KEY (branch_id) REFERENCES branches(id),
  FOREIGN KEY (fish_id) REFERENCES fish_items(id)
) ENGINE=InnoDB;
-- Audit trail of every stock / price change.
CREATE TABLE IF NOT EXISTS stock_movements (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT NOT NULL,
  fish_id INT NOT NULL,
  day DATE NOT NULL,
  kind ENUM('opening','arrival','wastage','wastage_removed','closing','price') NOT NULL,
  prev_value DECIMAL(10,2) NULL,
  new_value DECIMAL(10,2) NULL,
  reason VARCHAR(200) NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_m_branch (branch_id, created_at),
  INDEX idx_m_day (day),
  FOREIGN KEY (branch_id) REFERENCES branches(id),
  FOREIGN KEY (fish_id) REFERENCES fish_items(id)
) ENGINE=InnoDB;
`);

await conn.query(`
CREATE TABLE IF NOT EXISTS order_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  status ENUM('new','confirmed','ready','completed','cancelled') NOT NULL,
  by_user INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_oe (order_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;
-- Existing orders get their first event so every order has a history.
INSERT INTO order_events (order_id, status, by_user, created_at)
  SELECT o.id, 'new', NULL, o.created_at FROM orders o WHERE NOT EXISTS (SELECT 1 FROM order_events e WHERE e.order_id=o.id);
`);

await conn.query(`
CREATE TABLE IF NOT EXISTS bills (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT NOT NULL,
  bill_day DATE NOT NULL,
  bill_no INT NOT NULL,                  -- running number per branch per day
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_mode ENUM('cash','upi','other') NOT NULL DEFAULT 'cash',
  customer_name VARCHAR(120) NULL,
  customer_phone VARCHAR(15) NULL,
  is_void TINYINT(1) NOT NULL DEFAULT 0,
  void_reason VARCHAR(200) NULL,
  voided_by INT NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_bill (branch_id, bill_day, bill_no),
  INDEX idx_bill_day (branch_id, bill_day),
  FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS bill_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  bill_id BIGINT NOT NULL,
  fish_id INT NOT NULL,
  fish_name VARCHAR(160) NOT NULL,
  qty_kg DECIMAL(8,3) NOT NULL,
  price_per_kg DECIMAL(8,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  cut VARCHAR(80) NULL,
  INDEX idx_bi_fish (fish_id),
  FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
  FOREIGN KEY (fish_id) REFERENCES fish_items(id)
) ENGINE=InnoDB;
ALTER TABLE stock_movements MODIFY kind ENUM('opening','arrival','wastage','wastage_removed','closing','price','sale','sale_void') NOT NULL;
`);

// Fish list: read from the website's own catalogue so names stay identical.
const species = readFileSync("src/data/species.ts", "utf8");
const fishRe = /slug:\s*"([^"]+)",\s*nameMr:\s*"([^"]+)",\s*nameEn:\s*"([^"]+)",\s*category:\s*"([^"]+)"/g;
let order = 0;
for (const m of species.matchAll(fishRe)) {
  await conn.query(
    `INSERT INTO fish_items (slug, name_mr, name_en, category, sort_order) VALUES (?,?,?,?,?)
     ON DUPLICATE KEY UPDATE name_mr=VALUES(name_mr), name_en=VALUES(name_en), category=VALUES(category)`,
    [m[1], m[2], m[3], m[4], order++],
  );
}

const loginId = (process.env.SUPERADMIN_LOGIN || "9689030301").toLowerCase();
const password = process.env.SUPERADMIN_PASSWORD;
if (!password) throw new Error("Set SUPERADMIN_PASSWORD in .env.local first");
const hash = await bcrypt.hash(password, 12);
await conn.query(
  `INSERT INTO users (login_id, name, password_hash, role) VALUES (?, 'Abnexa', ?, 'abnexa')
   ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), name = 'Abnexa', role = 'abnexa'`,
  [loginId, hash],
);
// --demo: create 3 demo branches, each with its own admin login (passwords printed once).
if (process.argv.includes("--demo")) {
  const src = readFileSync("src/data/branches.ts", "utf8");
  const geo = readFileSync("src/data/branchGeo.ts", "utf8");
  const wa = (process.env.DEMO_WHATSAPP || "917666287015");
  const bRe = /slug:\s*"([^"]+)",\s*nameMr:\s*"([^"]+)"[\s\S]*?addressMr:\s*"([^"]+)"[\s\S]*?hoursMr:\s*"([^"]+)"/g;
  const demo = ["karad-hq", "karad-kolhapur-naka", "satara-guruwar-peth"];
  for (const m of src.matchAll(bRe)) {
    if (!demo.includes(m[1])) continue;
    const g = geo.match(new RegExp(`"?${m[1]}"?:\\s*\\{\\s*lat:\\s*([\\d.]+),\\s*lng:\\s*([\\d.]+)`));
    await conn.query(
      `INSERT IGNORE INTO branches (slug, name, address, lat, lng, whatsapp, open_time) VALUES (?,?,?,?,?,?,?)`,
      [m[1], m[2], m[3], g?.[1] ?? null, g?.[2] ?? null, wa, m[4]],
    );
    const [[b]] = await conn.query("SELECT id FROM branches WHERE slug=?", [m[1]]);
    const login = `demo-${m[1]}@anfish.test`;
    const [[exists]] = await conn.query("SELECT id FROM users WHERE login_id=?", [login]);
    if (!exists) {
      const pw = randomBytes(7).toString("base64url");
      await conn.query(
        "INSERT INTO users (login_id, name, password_hash, role, branch_id) VALUES (?,?,?,'branch_admin',?)",
        [login, m[2], await bcrypt.hash(pw, 12), b.id],
      );
      console.log(`DEMO LOGIN  ${login}  /  ${pw}   (${m[1]})`);
    }
  }
}
if (process.argv.includes("--demo")) {
  // one counter (billing) login per demo branch
  const [bs] = await conn.query("SELECT id, slug FROM branches");
  for (const b of bs) {
    const login = `demo-counter-${b.slug}@anfish.test`;
    const [[ex]] = await conn.query("SELECT id FROM users WHERE login_id=?", [login]);
    if (!ex) {
      const pw = randomBytes(7).toString("base64url");
      await conn.query("INSERT INTO users (login_id, name, password_hash, role, branch_id) VALUES (?, 'Counter', ?, 'counter', ?)", [login, await bcrypt.hash(pw, 12), b.id]);
      console.log(`DEMO COUNTER LOGIN  ${login}  /  ${pw}`);
    }
  }
}
if (process.argv.includes("--demo")) {
  const login = "demo-head@anfish.test";
  const [[ex]] = await conn.query("SELECT id FROM users WHERE login_id=?", [login]);
  if (!ex) {
    const pw = randomBytes(7).toString("base64url");
    await conn.query("INSERT INTO users (login_id, name, password_hash, role) VALUES (?, 'AN Fish World (Head)', ?, 'super_admin')", [login, await bcrypt.hash(pw, 12)]);
    console.log(`DEMO HEAD (super admin) LOGIN  ${login}  /  ${pw}`);
  }
}
console.log(`OK: database "${name}" ready. Super admin login id: ${loginId}`);
await conn.end();
