import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const expectedUser = process.env.ADMIN_USER ?? "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return new NextResponse("Admin access is not configured (missing ADMIN_PASSWORD).", {
      status: 500,
    });
  }

  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const [user, password] = Buffer.from(encoded, "base64").toString("utf-8").split(":");
      if (user === expectedUser && password === expectedPassword) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="NeeoGreen Admin"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
