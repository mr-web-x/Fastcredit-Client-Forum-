// Файл: app/register/page.js

import { requireGuest } from "@/src/lib/auth-server";
import RegisterPage from "@/src/features/RegisterPage/RegisterPage";

export const metadata = {
  title: "Registrácia — FastCredit Fórum",
  description:
    "Vytvorte si účet na FastCredit fóre a získajte prístup k expertným finančným poradám zdarma.",
  keywords:
    "registrácia, účet, fastcredit, forum, finančné poradenstvo, expert",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Registrácia — FastCredit Fórum",
    description:
      "Vytvorte si účet na FastCredit fóre a získajte prístup k expertným finančným poradám",
    url: "https://fastcredit.sk/forum/register",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Registrácia — FastCredit Fórum",
    description:
      "Vytvorte si účet na FastCredit fóre a získajte prístup k expertným finančným poradám",
  },
  alternates: {
    canonical: "https://fastcredit.sk/forum/register",
  },
};

// ✅ ИСПРАВЛЕНИЕ: Добавляем { searchParams } и передаем redirectTo как prop
export default async function Register({ searchParams }) {
  // Server-side guard - перенаправляем авторизованных пользователей
  await requireGuest("/");

  // ✅ Читаем searchParams на сервере (Server Component)
  const redirectTo = searchParams?.next || "/";

  // ✅ Передаем redirectTo в Client Component как prop
  return <RegisterPage redirectTo={redirectTo} />;
}
