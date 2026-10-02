import { ensureContactTable, getSql, type ContactSubmission } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

// wa.me needs the number in international form with no symbols. Numbers
// typed without a country code are assumed to be Indian (10 digits).
function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const international = !phone.trim().startsWith("+") && digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${international}`;
}

export default async function SubmissionsPage() {
  let submissions: ContactSubmission[] = [];
  let dbError: string | null = null;

  try {
    await ensureContactTable();
    const sql = getSql();
    submissions = (await sql`
      SELECT id, name, email, phone, company, project_type, message, created_at
      FROM contact_submissions
      ORDER BY created_at DESC
    `) as ContactSubmission[];
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Failed to load submissions.";
  }

  if (dbError) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-page px-6 text-ink">
        <p className="max-w-md text-center text-sm text-muted">{dbError}</p>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-page px-6 py-16 text-ink">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-3xl font-semibold uppercase tracking-[-0.02em]">
          Contact submissions
        </h1>
        <p className="mt-2 text-sm text-muted">
          {submissions.length} total — newest first.
        </p>

        <div className="mt-10 flex flex-col gap-6">
          {submissions.length === 0 && (
            <p className="text-sm text-muted">No submissions yet.</p>
          )}
          {submissions.map((s) => (
            <div key={s.id} className="border border-line p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-lg font-semibold uppercase tracking-[-0.01em]">
                  {s.name}
                </span>
                <span className="text-xs uppercase tracking-[0.1em] text-muted">
                  {new Date(s.created_at).toLocaleString()}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                <a href={`mailto:${s.email}`} className="underline decoration-line hover:text-ink">
                  {s.email}
                </a>
                {s.phone && (
                  <>
                    <a href={`tel:${s.phone.replace(/[^\d+]/g, "")}`} className="underline decoration-line hover:text-ink">
                      {s.phone}
                    </a>
                    <a
                      href={whatsappHref(s.phone)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-line hover:text-ink"
                    >
                      WhatsApp
                    </a>
                  </>
                )}
                {s.company && <span>{s.company}</span>}
                {s.project_type && <span>{s.project_type}</span>}
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm text-ink">{s.message}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
