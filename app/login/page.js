// Файл: app/login/page.js

import { requireGuest } from "@/src/lib/auth-server";
import LoginPage from "@/src/features/LoginPage/LoginPage";
import { getLoginPageStructuredData } from "@/src/lib/seo/structured-data";

export const metadata = {
  title: "Prihlásenie — FastCredit Fórum",
  description:
    "Prihláste sa do svojho účtu na FastCredit fóre a získajte prístup k expertným radám.",
  keywords: "prihlásenie, login, fastcredit, forum, účet",
  openGraph: {
    title: "Prihlásenie — FastCredit Fórum",
    description: "Prihláste sa do svojho účtu na FastCredit fóre",
    url: "https://fastcredit.sk/forum/login",
    type: "website",
  },
  alternates: {
    canonical: "https://fastcredit.sk/forum/login",
  },
};

export default async function Login({ searchParams }) {
  // Server-side guard - перенаправляем авторизованных пользователей
  await requireGuest("/forum");

  const redirectTo = searchParams?.next || "/forum/profile";

  return (
    <>
      <Script
        id="forum-login-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getLoginPageStructuredData()),
        }}
      />
      <LoginPage redirectTo={redirectTo} />;
    </>
  );
}
