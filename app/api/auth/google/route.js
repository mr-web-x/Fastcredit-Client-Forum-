import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    // Получаем Google ID token из Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid authorization header" },
        { status: 400 }
      );
    }

    const googleIdToken = authHeader.replace("Bearer ", "");

    // Отправляем токен на наш backend для верификации
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const backendResponse = await fetch(`${backendUrl}/auth/verify-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${googleIdToken}`,
        "Content-Type": "application/json",
      },
    });

    const backendData = await backendResponse.json();

    if (!backendResponse.ok || !backendData.success) {
      return NextResponse.json(
        {
          success: false,
          message: backendData.message || "Google authentication failed",
        },
        { status: backendResponse.status || 400 }
      );
    }

    // Получаем JWT токен и данные пользователя от backend
    const { token: jwtToken, user } = backendData.data;

    if (!jwtToken) {
      return NextResponse.json(
        { success: false, message: "No JWT token received from backend" },
        { status: 500 }
      );
    }

    // Устанавливаем HttpOnly cookie с JWT токеном
    const cookieStore = await cookies();
    cookieStore.set({
      name: "fc_jwt",
      value: jwtToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 дней
      path: "/", // Ограничиваем cookie только для forum части
    });

    // Возвращаем успешный ответ с данными пользователя (без токена)
    return NextResponse.json({
      success: true,
      data: {
        user: user,
        message: "Successfully authenticated with Google",
      },
    });
  } catch (error) {
    console.error("[Google OAuth Route Handler] Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during Google authentication",
      },
      { status: 500 }
    );
  }
}

// Обрабатываем только POST запросы
export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}
