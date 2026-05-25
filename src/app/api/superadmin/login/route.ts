import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const adminEmail = process.env.SUPERADMIN_EMAIL;
  const adminPassword = process.env.SUPERADMIN_PASSWORD;
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;

  if (!adminEmail || !adminPassword || !sessionToken) {
    return NextResponse.json({ error: "Admin credentials not configured in .env.local" }, { status: 500 });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  }

  // Set a simple plain-value cookie — no HMAC, no crypto
  const response = NextResponse.json({ success: true, token: sessionToken });
  response.cookies.set("sa_admin", sessionToken, {
    httpOnly: false,         // readable by JS so we can also check client-side
    secure: false,           // allow on http in dev
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("sa_admin");
  return response;
}
