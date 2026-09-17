import type { Pool, PoolClient } from "pg";

/**
 * A minimal, chainable query builder over `pg` (plain Postgres/RDS) supporting:
 *   select, insert, update, delete, eq, neq, gt, gte, lt, lte, in, ilike,
 *   order, limit, single, maybeSingle — each resolving to { data, error }.
 *
 * It is NOT a general-purpose ORM — it only supports
 * what's listed above. If you add a new query method to the app, add it here too.
 */

type Row = Record<string, unknown>;
type ResultOne<T> = { data: T | null; error: { message: string } | null; count?: number | null };
type ResultMany<T> = { data: T[] | null; error: { message: string } | null; count?: number | null };

type WhereOp = "=" | "!=" | ">" | ">=" | "<" | "<=" | "IN" | "ILIKE" | "IS";
interface WhereClause {
  col: string;
  op: WhereOp;
  val: unknown;
}

type Mode = "select" | "insert" | "update" | "delete";

export class QueryBuilder<T extends Row = Row> implements PromiseLike<ResultMany<T>> {
  private mode: Mode = "select";
  private selectCols = "*";
  private wheres: WhereClause[] = [];
  private values: Row | Row[] | null = null;
  private orderCol: string | null = null;
  private orderAsc = true;
  private limitN: number | null = null;
  private singleMode: "single" | "maybeSingle" | null = null;
  private returningCols: string | null = null; // set when .select() chained after insert/update
  private wantCount: "exact" | null = null;
  private headOnly = false;

  constructor(
    private pool: Pool | PoolClient,
    private table: string
  ) {}

  select(cols = "*", opts?: { count?: "exact"; head?: boolean }) {
    if (this.mode === "insert" || this.mode === "update") {
      this.returningCols = cols;
    } else {
      this.selectCols = cols;
    }
    if (opts?.count) this.wantCount = opts.count;
    if (opts?.head) this.headOnly = true;
    return this;
  }

  insert(values: Row | Row[]) {
    this.mode = "insert";
    this.values = values;
    return this;
  }

  update(values: Row) {
    this.mode = "update";
    this.values = values;
    return this;
  }

  delete() {
    this.mode = "delete";
    return this;
  }

  eq(col: string, val: unknown) {
    this.wheres.push({ col, op: "=", val });
    return this;
  }
  neq(col: string, val: unknown) {
    this.wheres.push({ col, op: "!=", val });
    return this;
  }
  gt(col: string, val: unknown) {
    this.wheres.push({ col, op: ">", val });
    return this;
  }
  gte(col: string, val: unknown) {
    this.wheres.push({ col, op: ">=", val });
    return this;
  }
  lt(col: string, val: unknown) {
    this.wheres.push({ col, op: "<", val });
    return this;
  }
  lte(col: string, val: unknown) {
    this.wheres.push({ col, op: "<=", val });
    return this;
  }
  in(col: string, vals: unknown[]) {
    this.wheres.push({ col, op: "IN", val: vals });
    return this;
  }
  ilike(col: string, pattern: string) {
    this.wheres.push({ col, op: "ILIKE", val: pattern });
    return this;
  }
  /** `.is(col, null)` — the only value this codebase actually passes. */
  is(col: string, val: null) {
    this.wheres.push({ col, op: "IS", val });
    return this;
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this.orderCol = col;
    this.orderAsc = opts?.ascending ?? true;
    return this;
  }

  limit(n: number) {
    this.limitN = n;
    return this;
  }

  single(): PromiseLike<ResultOne<T>> {
    this.singleMode = "single";
    return this as unknown as PromiseLike<ResultOne<T>>;
  }

  maybeSingle(): PromiseLike<ResultOne<T>> {
    this.singleMode = "maybeSingle";
    return this as unknown as PromiseLike<ResultOne<T>>;
  }

  // --- SQL building -------------------------------------------------------

  private buildWhere(params: unknown[]): string {
    if (this.wheres.length === 0) return "";
    const clauses = this.wheres.map((w) => {
      if (w.op === "IN") {
        const arr = w.val as unknown[];
        if (arr.length === 0) return "FALSE"; // empty IN() matches nothing
        const placeholders = arr.map((v) => {
          params.push(v);
          return `$${params.length}`;
        });
        return `"${w.col}" IN (${placeholders.join(", ")})`;
      }
      if (w.op === "IS") {
        return `"${w.col}" IS ${w.val === null ? "NULL" : "NOT NULL"}`;
      }
      params.push(w.val);
      return `"${w.col}" ${w.op} $${params.length}`;
    });
    return ` WHERE ${clauses.join(" AND ")}`;
  }

  private async execSelect(): Promise<ResultMany<T> | ResultOne<T>> {
    const params: unknown[] = [];

    if (this.headOnly) {
      // count-only query: SELECT COUNT(*) ..., no rows returned
      let countSql = `SELECT COUNT(*)::int AS count FROM "${this.table}"`;
      countSql += this.buildWhere(params);
      try {
        const res = await this.pool.query(countSql, params);
        return { data: null, error: null, count: res.rows[0]?.count ?? 0 };
      } catch (err) {
        return { data: null, error: { message: (err as Error).message } };
      }
    }

    let sql = `SELECT ${this.selectCols} FROM "${this.table}"`;
    sql += this.buildWhere(params);
    if (this.orderCol) sql += ` ORDER BY "${this.orderCol}" ${this.orderAsc ? "ASC" : "DESC"}`;
    if (this.singleMode) this.limitN = this.limitN ?? 2; // fetch 2 so we can detect "not exactly one"
    if (this.limitN != null) sql += ` LIMIT ${this.limitN}`;

    try {
      const res = await this.pool.query(sql, params);
      let count: number | undefined;
      if (this.wantCount) {
        const countParams: unknown[] = [];
        let countSql = `SELECT COUNT(*)::int AS count FROM "${this.table}"`;
        countSql += this.buildWhere(countParams);
        const countRes = await this.pool.query(countSql, countParams);
        count = countRes.rows[0]?.count ?? 0;
      }
      if (this.singleMode === "single") {
        if (res.rows.length !== 1) {
          return { data: null, error: { message: "Row not found or not unique" } };
        }
        return { data: res.rows[0] as T, error: null, count };
      }
      if (this.singleMode === "maybeSingle") {
        if (res.rows.length > 1) {
          return { data: null, error: { message: "Multiple rows returned for maybeSingle()" } };
        }
        return { data: (res.rows[0] as T) ?? null, error: null, count };
      }
      return { data: res.rows as T[], error: null, count };
    } catch (err) {
      return { data: null, error: { message: (err as Error).message } };
    }
  }

  private async execInsert(): Promise<ResultMany<T> | ResultOne<T>> {
    const rows = Array.isArray(this.values) ? this.values : [this.values as Row];
    if (rows.length === 0) return { data: this.singleMode ? null : [], error: null };
    const cols = Object.keys(rows[0]);
    const params: unknown[] = [];
    const valueTuples = rows.map((row) => {
      const placeholders = cols.map((c) => {
        params.push(row[c] ?? null);
        return `$${params.length}`;
      });
      return `(${placeholders.join(", ")})`;
    });
    let sql = `INSERT INTO "${this.table}" (${cols.map((c) => `"${c}"`).join(", ")}) VALUES ${valueTuples.join(", ")}`;
    if (this.returningCols) sql += ` RETURNING ${this.returningCols}`;

    try {
      const res = await this.pool.query(sql, params);
      if (!this.returningCols) return { data: null, error: null };
      if (this.singleMode === "single") {
        if (res.rows.length !== 1) return { data: null, error: { message: "Insert did not return exactly one row" } };
        return { data: res.rows[0] as T, error: null };
      }
      if (this.singleMode === "maybeSingle") {
        return { data: (res.rows[0] as T) ?? null, error: null };
      }
      return { data: res.rows as T[], error: null };
    } catch (err) {
      return { data: null, error: { message: (err as Error).message } };
    }
  }

  private async execUpdate(): Promise<ResultMany<T> | ResultOne<T>> {
    const row = this.values as Row;
    const cols = Object.keys(row);
    const params: unknown[] = [];
    const setClauses = cols.map((c) => {
      params.push(row[c] ?? null);
      return `"${c}" = $${params.length}`;
    });
    let sql = `UPDATE "${this.table}" SET ${setClauses.join(", ")}`;
    sql += this.buildWhere(params);
    if (this.returningCols) sql += ` RETURNING ${this.returningCols}`;

    try {
      const res = await this.pool.query(sql, params);
      if (!this.returningCols) return { data: null, error: null };
      if (this.singleMode === "single") {
        if (res.rows.length !== 1) return { data: null, error: { message: "Update did not return exactly one row" } };
        return { data: res.rows[0] as T, error: null };
      }
      return { data: res.rows as T[], error: null };
    } catch (err) {
      return { data: null, error: { message: (err as Error).message } };
    }
  }

  private async execDelete(): Promise<ResultMany<T> | ResultOne<T>> {
    const params: unknown[] = [];
    let sql = `DELETE FROM "${this.table}"`;
    sql += this.buildWhere(params);

    try {
      await this.pool.query(sql, params);
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: { message: (err as Error).message } };
    }
  }

  private exec(): Promise<ResultMany<T> | ResultOne<T>> {
    switch (this.mode) {
      case "select":
        return this.execSelect();
      case "insert":
        return this.execInsert();
      case "update":
        return this.execUpdate();
      case "delete":
        return this.execDelete();
    }
  }

  // Makes `await builder` work without an explicit `.then()`/execute call at each site.
  then<TResult1 = ResultMany<T>, TResult2 = never>(
    onfulfilled?: ((value: ResultMany<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.exec().then(onfulfilled as never, onrejected);
  }
}
