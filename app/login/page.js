// Файл: app/login/page.js

import { requireGuest } from "@/src/lib/auth-server";
import LoginPage from "@/src/features/LoginPage/LoginPage";

export const metadata = {
  title: "Prihlásenie — FastCredit Fórum",
  description:
    "Prihláste sa do svojho účtu na FastCredit fóre a získajte prístup k expertným radám.",
  keywords: "prihlásenie, login, fastcredit, forum, účet",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Prihlásenie — FastCredit Fórum",
    description: "Prihláste sa do svojho účtu na FastCredit fóre",
    url: "https://fastcredit.sk//login",
    type: "website",
  },
  alternates: {
    canonical: "https://fastcredit.sk//login",
  },
};

export default async function Login({ searchParams }) {
  // Server-side guard - перенаправляем авторизованных пользователей
  await requireGuest("/forum");

  const redirectTo = searchParams?.next || "/";

  return <LoginPage redirectTo={redirectTo} />;
}
