import { requireGuest } from "@/src/lib/auth-server";
import ForgotPasswordPage from "@/src/features/ForgotPasswordPage/ForgotPasswordPage";

export const metadata = {
  title: "Zabudnuté heslo — FastCredit Fórum",
  description:
    "Obnovte si prístup k svojmu účtu na FastCredit fóre. Zadajte email a pošleme vám odkaz na obnovenie hesla.",
  keywords: "zabudnuté heslo, reset hesla, obnova hesla, fastcredit, forum",
  robots: {
    index: false, // Neindexujeme recovery stránky
    follow: true,
  },
  openGraph: {
    title: "Zabudnuté heslo — FastCredit Fórum",
    description: "Obnovte si prístup k svojmu účtu na FastCredit fóre",
    url: "https://fastcredit.sk//forgot-password",
    type: "website",
  },
  alternates: {
    canonical: "https://fastcredit.sk//forgot-password",
  },
};

export default async function ForgotPassword() {
  // Server-side guard - перенаправляем авторизованных пользователей
  await requireGuest("/forum");

  return <ForgotPasswordPage />;
}
