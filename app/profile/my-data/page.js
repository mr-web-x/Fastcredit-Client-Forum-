// Файл: app/profile/my-data/page.js

import { requireAuth } from "@/src/lib/auth-server";
import MyDataPage from "@/src/features/ProfilePage/MyDataPage/MyDataPage";

export const metadata = {
  title: "Moje osobné údaje | FastCredit Forum",
  description: "Zobrazenie a úprava vašich osobných údajov na FastCredit Forum",
};

export default async function ProfileMyData() {
  // Получаем авторизованного пользователя (redirect если нет авторизации)
  const user = await requireAuth();

  // Передаем все данные пользователя в клиентский компонент
  return <MyDataPage user={user} />;
}
