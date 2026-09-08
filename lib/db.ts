import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

export function getSql() {
  if (client) return client;

  const connectionString =
    process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.DATABASE_URL_UNPOOLED;

  if (!connectionString) {
    throw new Error(
      "Missing DATABASE_URL (or POSTGRES_URL) — connect the Neon database to this project in the Vercel dashboard."
    );
  }

  client = neon(connectionString);
  return client;
}

export type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  company: string | null;
  project_type: string | null;
  message: string;
  created_at: string;
};

let ensured: Promise<unknown> | null = null;

export function ensureContactTable() {
  const sql = getSql();
  ensured ??= sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      project_type TEXT,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  return ensured;
}
