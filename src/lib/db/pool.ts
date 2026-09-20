import { Pool } from "pg";

// Reused across hot-reloads in dev and across warm Lambda/EC2 process lifetime.
declare global {
  // eslint-disable-next-line no-var
  var __vvPgPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Point it at your RDS instance.");
  }
  return new Pool({
    connectionString,
    // RDS requires TLS; the default RDS cert chain is trusted by Node's CA store,
    // so plain `ssl: true` (not `rejectUnauthorized: false`) is enough and keeps
    // the connection actually verified.
    ssl: { rejectUnauthorized: false },
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
  });
}

export const pool = globalThis.__vvPgPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  globalThis.__vvPgPool = pool;
}
