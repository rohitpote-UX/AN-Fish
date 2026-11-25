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
      // Serverless hosts (Vercel) open many short-lived instances: keep each pool tiny.
      connectionLimit: Number(process.env.DB_POOL || (process.env.VERCEL ? 2 : 10)),
      maxIdle: process.env.VERCEL ? 1 : 10,
      idleTimeout: 30_000,
      charset: "utf8mb4",
      // Return SQL DATE columns as plain "YYYY-MM-DD" strings. As JS Dates they shift a day back in India (UTC conversion).
      dateStrings: ["DATE"],
      // Managed MySQL (TiDB, Aiven, PlanetScale…) requires TLS: set DB_SSL=1.
      ssl: process.env.DB_SSL === "1" ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined,
    });
  }
  return globalThis.__anfishPool;
}
