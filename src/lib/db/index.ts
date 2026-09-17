import { pool } from "./pool";
import { QueryBuilder } from "./query-builder";
import type { Database } from "@/types";

export { pool };

type TableMap = Database["public"]["Tables"];

/** Server-only DB client. `.from("table")` gives you a chainable query builder over Postgres. */
export function db() {
  return {
    from<K extends keyof TableMap>(table: K) {
      return new QueryBuilder<TableMap[K]["Row"]>(pool, table as string);
    },
  };
}

/** Escape hatch for anything the query-builder subset can't express. */
export async function rawQuery<T extends Record<string, unknown> = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
) {
  const res = await pool.query(sql, params);
  return res.rows as T[];
}
