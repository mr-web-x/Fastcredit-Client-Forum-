// Файл: app/profile/page.js

import { requireAuth } from "@/src/lib/auth-server";
import ProfilePage from "@/src/features/ProfilePage/ProfilePage";
import { questionsService } from "@/src/services/server";

export const metadata = {
  title: "Môj profil | FastCredit Forum",
  description: "Upravte svoj profil a osobné údaje na FastCredit Forum",
};

export default async function Profile() {
  // Получаем авторизованного пользователя (redirect если нет авторизации)
  const user = await requireAuth();

  const data = await questionsService.getUserQuestions(user.id, {
    limit: 1,
    page: 1,
  });

  const latestQuestion = data.data.length > 0 ? data.data[0] : null;

  return <ProfilePage user={user} latestQuestion={latestQuestion} />;
}
