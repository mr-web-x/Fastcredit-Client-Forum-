// Файл: app/ask/page.js

import { requireAuth } from "@/src/lib/auth-server";
import AskQuestionPage from "@/src/features/AskQuestionPage/AskQuestionPage";

export const metadata = {
  title: "Zadať otázku | FastCredit Forum",
  description:
    "Spýtajte sa expertov na finančné otázky a získajte profesionálne poradenstvo",
  keywords: "finančné otázky, expertné poradenstvo, pôžičky, banky, poistenie",
};

export default async function AskQuestion() {
  // Проверяем авторизацию - автоматический редирект если не авторизован
  const user = await requireAuth();

  return <AskQuestionPage user={user} />;
}
