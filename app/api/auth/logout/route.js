// Файл: app/api/auth/logout/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = await cookies();

    // Получаем текущий JWT токен из cookie
    const currentToken = cookieStore.get("fc_jwt");

    // Если есть токен, уведомляем backend о logout
    if (currentToken?.value) {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

        // Отправляем запрос на backend для logout (чтобы invalidate токен на сервере)
        await fetch(`${backendUrl}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentToken.value}`,
            "Content-Type": "application/json",
          },
        });

        // Игнорируем ошибки от backend - cookie все равно удаляем
      } catch (backendError) {
        console.warn(
          "[Logout Route] Backend logout failed:",
          backendError.message
        );
        // Продолжаем выполнение - локальный logout все равно делаем
      }
    }

    // Удаляем HttpOnly cookie (главное действие)
    cookieStore.set({
      name: "fc_jwt",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Удаляем cookie немедленно
      path: "/",
    });

    // Возвращаем успешный ответ
    return NextResponse.json({
      success: true,
      data: {
        message: "Successfully logged out",
      },
    });
  } catch (error) {
    console.error("[Logout Route Handler] Error:", error);

    // Даже если произошла ошибка, пытаемся удалить cookie
    try {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "fc_jwt",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      });
    } catch (cookieError) {
      console.error("[Logout Route] Failed to clear cookie:", cookieError);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error during logout, but cookie cleared",
      },
      { status: 500 }
    );
  }
}

// Обрабатываем только POST запросы
export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method not allowed. Use POST for logout." },
    { status: 405 }
  );
}
