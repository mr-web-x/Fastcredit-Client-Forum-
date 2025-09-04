// Файл: src/features/ProfilePage/ProfileForm/ProfileForm.jsx

"use client";

import { useActionState, useEffect } from "react";
import { updateProfileAction } from "@/app/actions/auth";
import "./ProfileForm.scss";

export default function ProfileForm({ user, onSuccess }) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    null
  );

  // Вызываем onSuccess когда форма успешно отправлена
  useEffect(() => {
    if (state?.success) {
      onSuccess?.();
      // Сбрасываем success состояние через 5 секунд
      const timer = setTimeout(() => {
        // Можно добавить функцию для сброса состояния если нужно
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, onSuccess]);

  return (
    <div className="profile-form">
      <div className="profile-form__card">
        <div className="profile-form__header">
          <h2 className="profile-form__title">
            <span className="profile-form__title-icon">✏️</span>
            Upraviť profil
          </h2>
          <p className="profile-form__description">
            Aktualizujte svoje osobné údaje a informácie o profile
          </p>
        </div>

        <form action={formAction} className="profile-form__form">
          {/* Общая ошибка */}
          {state?.error && (
            <div className="profile-form__error-banner">
              <span className="profile-form__error-icon">⚠️</span>
              <div>
                <strong>Chyba pri aktualizácii profilu</strong>
                <p>{state.error}</p>
              </div>
            </div>
          )}

          <div className="profile-form__row">
            {/* Имя */}
            <div className="profile-form__field">
              <label htmlFor="firstName" className="profile-form__label">
                Meno
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Vaše meno"
                defaultValue={user.firstName || ""}
                className={`profile-form__input ${
                  state?.fieldErrors?.firstName
                    ? "profile-form__input--error"
                    : ""
                }`}
                disabled={isPending}
                autoComplete="given-name"
                maxLength={50}
              />
              {state?.fieldErrors?.firstName && (
                <div className="profile-form__field-error">
                  {state.fieldErrors.firstName}
                </div>
              )}
            </div>

            {/* Фамилия */}
            <div className="profile-form__field">
              <label htmlFor="lastName" className="profile-form__label">
                Priezvisko
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Vaše priezvisko"
                defaultValue={user.lastName || ""}
                className={`profile-form__input ${
                  state?.fieldErrors?.lastName
                    ? "profile-form__input--error"
                    : ""
                }`}
                disabled={isPending}
                autoComplete="family-name"
                maxLength={50}
              />
              {state?.fieldErrors?.lastName && (
                <div className="profile-form__field-error">
                  {state.fieldErrors.lastName}
                </div>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="profile-form__field">
            <label htmlFor="username" className="profile-form__label">
              Používateľské meno
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Vaše používateľské meno"
              defaultValue={user.username || ""}
              className={`profile-form__input ${
                state?.fieldErrors?.username ? "profile-form__input--error" : ""
              }`}
              disabled={isPending}
              autoComplete="username"
              maxLength={30}
              pattern="^[a-zA-Z0-9_-]+$"
              title="Používateľské meno môže obsahovať len písmená, číslice, pomlčky a podtržítka"
            />
            {state?.fieldErrors?.username && (
              <div className="profile-form__field-error">
                {state.fieldErrors.username}
              </div>
            )}
            <div className="profile-form__field-help">
              Môže obsahovať len písmená, číslice, pomlčky a podtržítka
            </div>
          </div>

          {/* Email (показываем, но недоступно для редактирования) */}
          <div className="profile-form__field">
            <label htmlFor="email" className="profile-form__label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              className="profile-form__input profile-form__input--disabled"
              disabled
              readOnly
            />
            <div className="profile-form__field-help">
              Email nie je možné zmeniť. Pre zmenu kontaktujte podporu.
            </div>
          </div>

          {/* Bio */}
          <div className="profile-form__field">
            <label htmlFor="bio" className="profile-form__label">
              O mne
            </label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Napíšte niečo o sebe..."
              defaultValue={user.bio || ""}
              className={`profile-form__textarea ${
                state?.fieldErrors?.bio ? "profile-form__textarea--error" : ""
              }`}
              disabled={isPending}
              maxLength={500}
              rows={4}
            />
            {state?.fieldErrors?.bio && (
              <div className="profile-form__field-error">
                {state.fieldErrors.bio}
              </div>
            )}
            <div className="profile-form__field-help">Maximálne 500 znakov</div>
          </div>

          {/* Дополнительная информация */}
          <div className="profile-form__additional-info">
            <h3 className="profile-form__section-title">
              <span className="profile-form__section-icon">📋</span>
              Dodatočné informácie
            </h3>

            <div className="profile-form__info-grid">
              <div className="profile-form__info-item">
                <span className="profile-form__info-label">Rola:</span>
                <span
                  className={`profile-form__role-badge profile-form__role-badge--${user.role}`}
                >
                  {user.role === "user" && "👤 Používateľ"}
                  {user.role === "expert" && "👨‍💼 Expert"}
                  {user.role === "moderator" && "🛡️ Moderátor"}
                  {user.role === "admin" && "⚙️ Administrátor"}
                </span>
              </div>

              <div className="profile-form__info-item">
                <span className="profile-form__info-label">Stav účtu:</span>
                <span
                  className={`profile-form__status-badge ${
                    user.isActive
                      ? "profile-form__status-badge--active"
                      : "profile-form__status-badge--inactive"
                  }`}
                >
                  {user.isActive ? "✅ Aktívny" : "⛔ Neaktívny"}
                </span>
              </div>

              <div className="profile-form__info-item">
                <span className="profile-form__info-label">Email stav:</span>
                <span
                  className={`profile-form__status-badge ${
                    user.isEmailVerified
                      ? "profile-form__status-badge--verified"
                      : "profile-form__status-badge--unverified"
                  }`}
                >
                  {user.isEmailVerified ? "✅ Overený" : "⚠️ Neoverený"}
                </span>
              </div>

              <div className="profile-form__info-item">
                <span className="profile-form__info-label">Registrácia:</span>
                <span className="profile-form__info-value">
                  {new Date(user.createdAt).toLocaleDateString("sk-SK")}
                </span>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="profile-form__actions">
            <button
              type="submit"
              disabled={isPending}
              className={`profile-form__submit-btn ${
                isPending ? "profile-form__submit-btn--loading" : ""
              }`}
            >
              {isPending ? (
                <>
                  <span className="profile-form__loading-spinner"></span>
                  Ukladá sa...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Uložiť zmeny
                </>
              )}
            </button>

            <button
              type="reset"
              disabled={isPending}
              className="profile-form__reset-btn"
              onClick={() => {
                // Сброс формы к исходным значениям
                const form = document.querySelector(".profile-form__form");
                if (form) {
                  form.reset();
                }
              }}
            >
              <span>↩️</span>
              Resetovať
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
