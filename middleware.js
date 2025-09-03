// Файл: middleware.js
import { NextResponse } from "next/server";
import { basePath } from "@/src/constants/config";

export function middleware(request) {
  const { pathname, searchParams, origin } = request.nextUrl;
  const token = request.cookies.get("fc_jwt")?.value;

  // Проверяем, что мы находимся в forum части сайта
  if (!pathname.startsWith("/forum")) {
    return NextResponse.next();
  }

  // === ЗАЩИЩЕННЫЕ МАРШРУТЫ ===
  const protectedRoutes = [
    "/forum/profile", // Личный кабинет
    "/forum/ask", // Создание вопроса
    "/forum/admin", // Админ панель
    "/forum/expert", // Панель эксперта
  ];

  // === ГОСТЕВЫЕ МАРШРУТЫ (только для неавторизованных) ===
  const guestRoutes = [
    "/forum/login",
    "/forum/register",
    "/forum/forgot-password",
  ];

  // === API ROUTES PROTECTION ===
  if (pathname.startsWith("/forum/api/auth/")) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Middleware] Auth API access: ${pathname}`);
    }
    return NextResponse.next();
  }

  // === ЗАЩИЩЕННЫЕ МАРШРУТЫ ===
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    // Сохраняем текущий URL для редиректа после входа
    const loginUrl = new URL(`${basePath}/login`, request.url);
    loginUrl.searchParams.set(
      "next",
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    );

    console.log(
      `[Middleware] Redirecting unauthenticated user from ${pathname} to ${loginUrl.toString()}`
    );
    return NextResponse.redirect(loginUrl);
  }

  // === ГОСТЕВЫЕ МАРШРУТЫ ===
  const isGuestRoute = guestRoutes.some((route) => pathname === route);

  if (isGuestRoute && token) {
    // Авторизованные пользователи не должны видеть страницы входа
    let redirectPath = searchParams.get("next");

    if (!redirectPath || redirectPath === "/") {
      // Редирект на главную страницу форума
      redirectPath = `${basePath}`;
    } else if (!redirectPath.startsWith(basePath)) {
      // Если next параметр не содержит basePath, добавляем его
      redirectPath = `${basePath}${
        redirectPath.startsWith("/") ? "" : "/"
      }${redirectPath}`;
    }

    const homeUrl = new URL(redirectPath, request.url);

    console.log(
      `[Middleware] Redirecting authenticated user from ${pathname} to ${homeUrl.toString()}`
    );
    return NextResponse.redirect(homeUrl);
  }

  // === РОЛЬ-СПЕЦИФИЧНЫЕ МАРШРУТЫ ===
  if (pathname.startsWith("/forum/admin") && token) {
    console.log(`[Middleware] Admin route access attempt: ${pathname}`);
  }

  if (pathname.startsWith("/forum/expert") && token) {
    console.log(`[Middleware] Expert route access attempt: ${pathname}`);
  }

  // === ДОБАВЛЯЕМ ЗАГОЛОВКИ ДЛЯ SERVER COMPONENTS ===
  const requestHeaders = new Headers(request.headers);

  if (token) {
    requestHeaders.set("x-has-auth-token", "true");
  } else {
    requestHeaders.set("x-has-auth-token", "false");
  }

  requestHeaders.set("x-current-path", pathname);

  // === SECURITY HEADERS ===
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Content Security Policy для защиты от XSS
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://accounts.google.com",
      "frame-src https://accounts.google.com",
    ].join("; ")
  );

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/forum/:path*",
    "/api/auth/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
