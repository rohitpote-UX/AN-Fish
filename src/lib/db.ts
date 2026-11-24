import mysql from "mysql2/promise";

declare global {
  var __anfishPool: mysql.Pool | undefined;
}

/** Single shared MySQL pool (reused across hot reloads in dev). */
export function db(): mysql.Pool {
  if (!globalThis.__anfishPool) {
    globalThis.__anfishPool = mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "anfish",
      waitForConnections: true,
      connectionLimit: 10,
      charset: "utf8mb4",
    });
  }
  return globalThis.__anfishPool;
}
