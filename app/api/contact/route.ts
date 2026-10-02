import { NextResponse } from "next/server";
import { ensureContactTable, getSql } from "@/lib/db";
import { SITE } from "@/lib/site";
import { isValidPhone } from "@/lib/phone";

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

  const { name, email, phone, company, projectType, message } = body as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !phone.trim() ||
    !message.trim()
  ) {
    return NextResponse.json(
      { error: "Name, email, mobile number, and message are required." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Enter a valid mobile number." }, { status: 400 });
  }

  try {
    await ensureContactTable();
    const sql = getSql();
    await sql`
      INSERT INTO contact_submissions (name, email, phone, company, project_type, message)
      VALUES (
        ${name.trim()},
        ${email.trim()},
        ${phone.trim()},
        ${typeof company === "string" && company.trim() ? company.trim() : null},
        ${typeof projectType === "string" && projectType.trim() ? projectType.trim() : null},
        ${message.trim()}
      )
    `;
  } catch (err) {
    console.error("Failed to store contact submission:", err);
    // Never strand a lead: if saving fails, point them at a direct channel.
    return NextResponse.json(
      {
        error: `We couldn't send your message just now. Please email ${SITE.email} or call/WhatsApp ${SITE.phone}.`,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
