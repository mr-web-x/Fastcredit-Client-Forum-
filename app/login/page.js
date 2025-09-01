import { redirect } from "next/navigation";
import { basePath } from "@/src/constants/config";
import { authService } from "@/src/services/server";
import LoginPage from "@/src/features/LoginPage/LoginPage";

export const metadata = {
  title: "Prihlásenie — FastCredit Fórum",
  description: "Prihláste sa do svojho účtu na FastCredit fóre.",
};

export default async function Login() {
  // если пользователь уже залогинен — сразу уводим
  const user = await authService.getServerUser();
  if (user) {
    redirect(`${basePath}/`);
  }

  return <LoginPage />;
}
