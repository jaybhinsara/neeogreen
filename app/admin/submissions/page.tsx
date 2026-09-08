import { ensureContactTable, getSql, type ContactSubmission } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function SubmissionsPage() {
  let submissions: ContactSubmission[] = [];
  let dbError: string | null = null;

  try {
    await ensureContactTable();
    const sql = getSql();
    submissions = (await sql`
      SELECT id, name, email, company, project_type, message, created_at
      FROM contact_submissions
      ORDER BY created_at DESC
    `) as ContactSubmission[];
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Failed to load submissions.";
  }

  if (dbError) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-bg-primary px-6 text-ink-on-dark">
        <p className="max-w-md text-center text-sm text-muted-on-dark">{dbError}</p>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-bg-primary px-6 py-16 text-ink-on-dark">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-3xl font-semibold uppercase tracking-[-0.02em]">
          Contact submissions
        </h1>
        <p className="mt-2 text-sm text-muted-on-dark">
          {submissions.length} total — newest first.
        </p>

        <div className="mt-10 flex flex-col gap-6">
          {submissions.length === 0 && (
            <p className="text-sm text-muted-on-dark">No submissions yet.</p>
          )}
          {submissions.map((s) => (
            <div key={s.id} className="border border-line-on-dark p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-lg font-semibold uppercase tracking-[-0.01em]">
                  {s.name}
                </span>
                <span className="text-xs uppercase tracking-[0.1em] text-muted-on-dark">
                  {new Date(s.created_at).toLocaleString()}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-on-dark">
                <a href={`mailto:${s.email}`} className="underline decoration-line-on-dark hover:text-ink-on-dark">
                  {s.email}
                </a>
                {s.company && <span>{s.company}</span>}
                {s.project_type && <span>{s.project_type}</span>}
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm text-ink-on-dark">{s.message}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
