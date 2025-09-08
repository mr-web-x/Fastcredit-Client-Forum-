// Файл: src/features/ProfilePage/MyDataPage/MyDataPage.jsx

"use client";
import BasicInfoSection from "./BasicInfoSection/BasicInfoSection";
import AccountInfoSection from "./AccountInfoSection/AccountInfoSection";
import "./MyDataPage.scss";

export default function MyDataPage({ user }) {
  return (
    <div className="my-data-page">
      {/* Заголовок с кнопкой управления */}
      <div className="my-data-page__header">
        <div className="my-data-page__title-section">
          <h1 className="my-data-page__title">
            <span className="my-data-page__title-icon">🏷️</span>
            Moje osobné údaje
          </h1>
          <p className="my-data-page__subtitle">
            Zobrazte a upravte svoje osobné informácie
          </p>
        </div>
      </div>

      {/* Секция основной информации - БЕЗ formData и onInputChange! */}
      <BasicInfoSection user={user} />

      {/* Секция информации об аккаунте */}
      <AccountInfoSection user={user} />
    </div>
  );
}
