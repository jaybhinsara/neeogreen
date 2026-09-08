import { NextResponse } from "next/server";
import { ensureContactTable, getSql } from "@/lib/db";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, company, projectType, message } = body as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await ensureContactTable();
    const sql = getSql();
    await sql`
      INSERT INTO contact_submissions (name, email, company, project_type, message)
      VALUES (
        ${name.trim()},
        ${email.trim()},
        ${typeof company === "string" && company.trim() ? company.trim() : null},
        ${typeof projectType === "string" && projectType.trim() ? projectType.trim() : null},
        ${message.trim()}
      )
    `;
  } catch (err) {
    console.error("Failed to store contact submission:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
