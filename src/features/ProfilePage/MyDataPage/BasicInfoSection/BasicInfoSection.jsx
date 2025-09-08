// Файл: src/features/ProfilePage/MyDataPage/BasicInfoSection/BasicInfoSection.jsx

"use client";

import "./BasicInfoSection.scss";

import { useState, useEffect, useActionState } from "react";
import { updateMyDataAction } from "@/app/actions/profile";

export default function BasicInfoSection({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateMyDataAction,
    null
  );

  // Переключение режима редактирования
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Обработка успешного сохранения
  useEffect(() => {
    if (state?.success) {
      setIsEditing(false);
      // TODO: Заменить на toast-уведомление
      console.log("Profile updated successfully!");
    }
  }, [state?.success]);

  return (
    <section className="basic-info-section">
      <div className="basic-info-section__header">
        <div className="basic-info-section__header-text">
          <h2 className="basic-info-section__title">
            <span className="basic-info-section__title-icon">📝</span>
            Základné informácie
          </h2>
          <p className="basic-info-section__description">
            {isEditing
              ? "Upravte svoje osobné údaje"
              : "Vaše základné osobné informácie"}
          </p>
        </div>

        <div className="basic-info-section__actions">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleToggleEdit}
              className="basic-info-section__edit-button"
            >
              <span className="basic-info-section__button-icon">✏️</span>
              Upraviť profil
            </button>
          ) : (
            <button
              type="button"
              onClick={handleToggleEdit}
              className="basic-info-section__cancel-button"
            >
              <span className="basic-info-section__button-icon">❌</span>
              Zrušiť úpravy
            </button>
          )}
        </div>
      </div>

      <form action={formAction} className="basic-info-section__form">
        {/* Скрытое поле для определения действия */}
        <input type="hidden" name="action" value="update_profile" />

        <div className="basic-info-section__content">
          <div className="basic-info-section__alerts">
            {/* Общая ошибка */}
            {state?.error && (
              <div className="basic-info-section__error-banner">
                <span className="basic-info-section__error-icon">⚠️</span>
                <div>
                  <strong>Chyba pri ukladaní údajov</strong>
                  <p>{state.error}</p>
                </div>
              </div>
            )}

            {/* Уведомление об успехе */}
            {state?.success && (
              <div className="basic-info-section__success-banner">
                <span className="basic-info-section__success-icon">✅</span>
                <div>
                  <strong>Údaje úspešne uložené</strong>
                  <p>Vaše osobné informácie boli aktualizované</p>
                </div>
              </div>
            )}
          </div>
          <div className="basic-info-section__grid">
            {/* Meno */}
            <div className="basic-info-section__field">
              <label htmlFor="firstName" className="basic-info-section__label">
                <span className="basic-info-section__label-icon">👤</span>
                Meno
              </label>

              {isEditing ? (
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  defaultValue={user.firstName || ""}
                  placeholder="Zadajte vaše meno"
                  disabled={isPending}
                  className={`basic-info-section__input ${
                    state?.fieldErrors?.firstName
                      ? "basic-info-section__input--error"
                      : ""
                  }`}
                  autoComplete="given-name"
                  maxLength="50"
                  aria-describedby={
                    state?.fieldErrors?.firstName
                      ? "firstName-error"
                      : undefined
                  }
                />
              ) : (
                <div className="basic-info-section__value">
                  {user.firstName || "Nezadané"}
                </div>
              )}

              {state?.fieldErrors?.firstName && (
                <div id="firstName-error" className="basic-info-section__error">
                  {state?.fieldErrors.firstName}
                </div>
              )}
            </div>

            {/* Priezvisko */}
            <div className="basic-info-section__field">
              <label htmlFor="lastName" className="basic-info-section__label">
                <span className="basic-info-section__label-icon">👤</span>
                Priezvisko
              </label>

              {isEditing ? (
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  defaultValue={user.lastName || ""}
                  placeholder="Zadajte vaše priezvisko"
                  disabled={isPending}
                  className={`basic-info-section__input ${
                    state?.fieldErrors?.lastName
                      ? "basic-info-section__input--error"
                      : ""
                  }`}
                  autoComplete="family-name"
                  maxLength="50"
                  aria-describedby={
                    state?.fieldErrors?.lastName ? "lastName-error" : undefined
                  }
                />
              ) : (
                <div className="basic-info-section__value">
                  {user.lastName || "Nezadané"}
                </div>
              )}

              {state?.fieldErrors?.lastName && (
                <div id="lastName-error" className="basic-info-section__error">
                  {state?.fieldErrors.lastName}
                </div>
              )}
            </div>

            {/* Používateľské meno */}
            <div className="basic-info-section__field basic-info-section__field--full-width">
              <label htmlFor="username" className="basic-info-section__label">
                <span className="basic-info-section__label-icon">🏷️</span>
                Používateľské meno
              </label>

              {isEditing ? (
                <input
                  id="username"
                  type="text"
                  name="username"
                  defaultValue={user.username || ""}
                  placeholder="Zadajte používateľské meno"
                  disabled={isPending}
                  className={`basic-info-section__input ${
                    state?.fieldErrors?.username
                      ? "basic-info-section__input--error"
                      : ""
                  }`}
                  autoComplete="username"
                  minLength="3"
                  maxLength="30"
                  pattern="^[a-zA-Z0-9_]+$"
                  aria-describedby={
                    state?.fieldErrors?.username
                      ? "username-error"
                      : "username-help"
                  }
                />
              ) : (
                <div className="basic-info-section__value">
                  {user.username || "Nezadané"}
                </div>
              )}

              {isEditing && !state?.fieldErrors?.username && (
                <div id="username-help" className="basic-info-section__help">
                  3-30 znakov, len písmená, číslice a podčiarkovník
                </div>
              )}

              {state?.fieldErrors?.username && (
                <div id="username-error" className="basic-info-section__error">
                  {state?.fieldErrors.username}
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="basic-info-section__field basic-info-section__field--full-width">
              <label htmlFor="bio" className="basic-info-section__label">
                <span className="basic-info-section__label-icon">📝</span>O mne
              </label>

              {isEditing ? (
                <textarea
                  id="bio"
                  name="bio"
                  defaultValue={user.bio || ""}
                  placeholder="Napíšte niečo o sebe..."
                  disabled={isPending}
                  className={`basic-info-section__textarea ${
                    state?.fieldErrors?.bio
                      ? "basic-info-section__textarea--error"
                      : ""
                  }`}
                  maxLength="500"
                  rows="4"
                  aria-describedby={
                    state?.fieldErrors?.bio ? "bio-error" : "bio-help"
                  }
                />
              ) : (
                <div className="basic-info-section__value basic-info-section__value--multiline">
                  {user.bio || "Žiadny popis"}
                </div>
              )}

              {isEditing && !state?.fieldErrors?.bio && (
                <div id="bio-help" className="basic-info-section__help">
                  Maximálne 500 znakov
                </div>
              )}

              {state?.fieldErrors?.bio && (
                <div id="bio-error" className="basic-info-section__error">
                  {state?.fieldErrors.bio}
                </div>
              )}
            </div>
          </div>
          {/* Кнопка сохранения - показывается только в режиме редактирования */}
          {isEditing && (
            <div className="basic-info-section__save">
              <button
                type="submit"
                disabled={isPending}
                className="basic-info-section__save-button"
              >
                {isPending ? (
                  <>
                    <span className="basic-info-section__button-icon">⏳</span>
                    Ukladám...
                  </>
                ) : (
                  <>
                    <span className="basic-info-section__button-icon">💾</span>
                    Uložiť zmeny
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
