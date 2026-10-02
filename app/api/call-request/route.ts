import { NextResponse } from "next/server";
import { ensureContactTable, getSql } from "@/lib/db";
import { isValidPhone } from "@/lib/phone";

// "Book a call" requests: just a name and number. Stored alongside contact
// form submissions so every lead shows up in the admin, even if the visitor
// never presses Send in the WhatsApp chat that opens next.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, phone } = (body ?? {}) as Record<string, unknown>;
  if (typeof name !== "string" || typeof phone !== "string" || !name.trim() || !phone.trim()) {
    return NextResponse.json({ error: "Name and mobile number are required." }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Enter a valid mobile number." }, { status: 400 });
  }

  try {
    await ensureContactTable();
    const sql = getSql();
    await sql`
      INSERT INTO contact_submissions (name, email, phone, project_type, message)
      VALUES (${name.trim()}, '', ${phone.trim()}, 'Call request', 'Asked to book a call via WhatsApp.')
    `;
  } catch (err) {
    console.error("Failed to store call request:", err);
    return NextResponse.json({ error: "Could not save the request." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
