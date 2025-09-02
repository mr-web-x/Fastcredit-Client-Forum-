import { redirect } from "next/navigation";
import { basePath } from "@/src/constants/config";
import { authService } from "@/src/services/server";
import RegisterPage from "@/src/features/RegisterPage/RegisterPage";

export const metadata = {
  title: "Registrácia — FastCredit Fórum",
  description: "Registrácia na FastCredit fóre.",
};

export default async function Register() {
  // если пользователь уже залогинен — сразу уводим
  const user = await authService.getServerUser();
  if (user) {
    redirect(`${basePath}/`);
  }

  return <RegisterPage />;
}
