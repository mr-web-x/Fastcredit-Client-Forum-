// Файл: app/profile/layout.js

import { requireAuth } from "@/src/lib/auth-server";
import ProfileSidebar from "@/src/components/ProfileSidebar/ProfileSidebar";
import "./profile-layout.scss";
export const metadata = {
  title: "Profil | FastCredit Forum",
  description: "Nastavenia vášho profilu na FastCredit Forum",
};

export default async function ProfileLayout({ children }) {
  // Проверяем авторизацию - автоматический редирект если не авторизован
  const user = await requireAuth();

  return (
    <div className="profile-layout">
      <div className="container">
        <div className="profile-layout__content">
          {/* Sidebar компонент */}
          <ProfileSidebar user={user} />

          {/* Основной контент страницы */}
          <main className="profile-layout__main">{children}</main>
        </div>
      </div>
    </div>
  );
}
