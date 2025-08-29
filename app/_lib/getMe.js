// app/_lib/getMe.ts
export async function getMe(cookieHeader) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: { Cookie: cookieHeader ?? "" },
    cache: "no-store",
  });
  if (!r.ok) return null;
  const j = await r.json();
  return j?.data ?? null;
}
