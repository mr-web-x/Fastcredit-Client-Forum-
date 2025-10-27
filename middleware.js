// Файл: middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get("fc_jwt")?.value;

  // При basePath: "/forum" Next.js получает пути БЕЗ /forum
  // Nginx проксирует /forum/login → localhost:10002/login

  console.log(`[Middleware] Processing: ${pathname}, Has token: ${!!token}`);

  // === ЗАЩИЩЕННЫЕ МАРШРУТЫ ===
  const protectedRoutes = [
    "/profile", // Профиль пользователя
    "/ask", // Создание вопроса
    "/admin", // Админ панель
    "/expert", // Панель эксперта
    "/my", // Мои вопросы/ответы
  ];

  // === ГОСТЕВЫЕ МАРШРУТЫ (только для неавторизованных) ===
  const guestRoutes = ["/forum/login", "/forum/register", "/forgot-password"];

  // === API ROUTES ===
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // === ЗАЩИЩЕННЫЕ МАРШРУТЫ ===
  const isProtectedRoute = protectedRoutes.some((route) => {
    return pathname === route || pathname.startsWith(route + "/");
  });

  if (isProtectedRoute && !token) {
    // Redirect на /login (в браузере станет /forum/login)
    const loginUrl = new URL("/forum/login", request.url);
    loginUrl.searchParams.set(
      "next",
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    );

    console.log(`[Middleware] Redirecting to login: ${loginUrl.pathname}`);
    return NextResponse.redirect(loginUrl);
  }

  // === ГОСТЕВЫЕ МАРШРУТЫ ===
  const isGuestRoute = guestRoutes.includes(pathname);

  if (isGuestRoute && token) {
    // Redirect авторизованных пользователей на главную
    const redirectPath = searchParams.get("next") || "/";
    const homeUrl = new URL(redirectPath, request.url);

    console.log(
      `[Middleware] Redirecting authenticated user to: ${redirectPath}`
    );
    return NextResponse.redirect(homeUrl);
  }

  // === ДОБАВЛЯЕМ ЗАГОЛОВКИ ДЛЯ SERVER COMPONENTS ===
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-has-auth-token", token ? "true" : "false");
  requestHeaders.set("x-current-path", pathname);

  console.log(`[Middleware] Passing through: ${pathname}`);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Исключаем статические файлы Next.js
    "/((?!_next|favicon.ico|logo.svg|site.webmanifest).*)",
  ],
};
