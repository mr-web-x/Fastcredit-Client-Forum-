import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json();

  if (!r.ok || !data?.success) {
    return NextResponse.json(data, { status: r.status || 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(process.env.JWT_COOKIE_NAME, data.data.token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
