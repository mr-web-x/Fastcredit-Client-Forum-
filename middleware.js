// Файл: middleware.js

import { NextResponse } from "next/server";
import { basePath } from "@/src/constants/config";

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
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
    "/forum/reset-password",
  ];

  // === API ROUTES PROTECTION ===
  if (pathname.startsWith("/forum/api/auth/")) {
    // API auth routes доступны всем, но логируем для безопасности
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
      `[Middleware] Redirecting unauthenticated user from ${pathname} to login`
    );
    return NextResponse.redirect(loginUrl);
  }

  // === ГОСТЕВЫЕ МАРШРУТЫ ===
  const isGuestRoute = guestRoutes.some((route) => pathname === route);

  if (isGuestRoute && token) {
    // Авторизованные пользователи не должны видеть страницы входа
    const redirectTo = searchParams.get("next") || `${basePath}/`;
    const homeUrl = new URL(redirectTo, request.url);

    console.log(
      `[Middleware] Redirecting authenticated user from ${pathname} to ${redirectTo}`
    );
    return NextResponse.redirect(homeUrl);
  }

  // === РОЛЬ-СПЕЦИФИЧНЫЕ МАРШРУТЫ ===
  // Для этого нужно декодировать JWT или сделать запрос к API
  // Пока оставляем базовую проверку - более детальную проверку ролей делаем в Server Components

  if (pathname.startsWith("/forum/admin") && token) {
    // Админ маршруты - дополнительная проверка будет в Server Components через requireRole()
    // Здесь просто проверяем наличие токена
    console.log(`[Middleware] Admin route access attempt: ${pathname}`);
  }

  if (pathname.startsWith("/forum/expert") && token) {
    // Эксперт маршруты - дополнительная проверка будет в Server Components
    console.log(`[Middleware] Expert route access attempt: ${pathname}`);
  }

  // === ДОБАВЛЯЕМ ЗАГОЛОВКИ ДЛЯ SERVER COMPONENTS ===
  const requestHeaders = new Headers(request.headers);

  // Передаем информацию о наличии токена в Server Components
  if (token) {
    requestHeaders.set("x-has-auth-token", "true");
    // НЕ передаем сам токен в заголовках - это небезопасно
    // Server Components будут получать user данные через getServerUser()
  } else {
    requestHeaders.set("x-has-auth-token", "false");
  }

  // Передаем текущий path для логики в компонентах
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

  // Защита от clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Предотвращение MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // XSS Protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Strict Transport Security (только в production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  return response;
}

// Конфигурация middleware - на какие маршруты применяется
export const config = {
  matcher: [
    // Применяется ко всем forum маршрутам
    "/forum/:path*",
    // API routes
    "/api/auth/:path*",
    // Исключаем статические файлы
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
