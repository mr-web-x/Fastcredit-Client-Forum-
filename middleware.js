import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get(process.env.JWT_COOKIE_NAME || "fc_jwt")?.value;
  const url = req.nextUrl;

  // Пример: защищаем /forum/(private)
  if (url.pathname.startsWith("/forum/(private)") && !token) {
    url.pathname = "/forum/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
