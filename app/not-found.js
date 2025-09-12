// Файл: app/not-found.js
import { NotFoundPage } from "@/src/features/NotFoundPage/NotFoundPage";

export const metadata = {
  title: "Stránka nebola nájdená | FastCredit Forum",
  description: "Požadovaná stránka nebola nájdená na FastCredit Forum",
};

export default function NotFound() {
  return <NotFoundPage />;
}
