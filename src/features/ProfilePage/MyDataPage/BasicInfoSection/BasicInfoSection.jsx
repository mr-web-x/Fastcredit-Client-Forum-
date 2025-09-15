// Файл: src/features/ProfilePage/MyDataPage/BasicInfoSection/BasicInfoSection.jsx

"use client";

import "./BasicInfoSection.scss";

import { useState, useEffect, useActionState } from "react";
import { updateMyDataAction } from "@/app/actions/profile";
import EditIcon from "@mui/icons-material/Edit";
import ReportIcon from "@mui/icons-material/Report";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import InfoIcon from "@mui/icons-material/Info";

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
          <h2 className="basic-info-section__title">Základné informácie</h2>
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
              <span className="basic-info-section__button-icon">
                <EditIcon />
              </span>
              Upraviť profil
            </button>
          ) : (
            <button
              type="button"
              onClick={handleToggleEdit}
              className="basic-info-section__cancel-button"
            >
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
                <span className="basic-info-section__error-icon">
                  <ReportIcon sx={{ fontSize: "16px" }} />
                </span>
                <div>
                  <strong>Chyba pri ukladaní údajov</strong>
                  <p>{state.error}</p>
                </div>
              </div>
            )}

            {/* Уведомление об успехе */}
            {state?.success && (
              <div className="basic-info-section__success-banner">
                <span className="basic-info-section__success-icon">
                  <CheckCircleIcon sx={{ fontSize: "16px" }} />
                </span>
                <div>
                  <strong>Údaje úspešne uložené</strong>
                  <p>Vaše osobné informácie boli aktualizované</p>
                </div>
              </div>
            )}

            {/* Информационное сообщение о неизменяемых полях - только в режиме редактирования */}
            {isEditing && (
              <div className="basic-info-section__info-banner">
                <span className="basic-info-section__info-icon">
                  <InfoIcon sx={{ fontSize: "16px" }} />
                </span>
                <div>
                  <strong>Dôležité upozornenie</strong>
                  <p>
                    Meno a priezvisko nie je možné zmeniť z bezpečnostných
                    dôvodov. Pre zmenu kontaktujte podporu.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="basic-info-section__grid">
            {/* Meno - NEZMĚNNÉ POLE */}
            <div className="basic-info-section__field">
              <label htmlFor="firstName" className="basic-info-section__label">
                Meno
                <span className="basic-info-section__lock-icon">
                  <LockIcon sx={{ fontSize: "14px" }} />
                </span>
              </label>

              {/* Vždy zobrazujeme jako hodnotu, nikdy jako input */}
              <div
                className={`basic-info-section__value ${
                  isEditing ? "basic-info-section__value--locked" : ""
                }`}
              >
                {user.firstName || "Nezadané"}
              </div>

              {/* Pomocný text v režime úprav */}
              {isEditing && (
                <div className="basic-info-section__locked-help">
                  <LockIcon sx={{ fontSize: "12px" }} />
                  Toto pole nie je možné upraviť
                </div>
              )}
            </div>

            {/* Priezvisko - NEZMĚNNÉ POLE */}
            <div className="basic-info-section__field">
              <label htmlFor="lastName" className="basic-info-section__label">
                Priezvisko
                <span className="basic-info-section__lock-icon">
                  <LockIcon sx={{ fontSize: "14px" }} />
                </span>
              </label>

              {/* Vždy zobrazujeme ako hodnotu, nikdy ako input */}
              <div
                className={`basic-info-section__value ${
                  isEditing ? "basic-info-section__value--locked" : ""
                }`}
              >
                {user.lastName || "Nezadané"}
              </div>

              {/* Pomocný text v režime úprav */}
              {isEditing && (
                <div className="basic-info-section__locked-help">
                  <LockIcon sx={{ fontSize: "12px" }} />
                  Toto pole nie je možné upraviť
                </div>
              )}
            </div>

            {/* Používateľské meno - NORMÁLNE EDITOVATEĽNÉ POLE */}
            <div className="basic-info-section__field basic-info-section__field--full-width">
              <label htmlFor="username" className="basic-info-section__label">
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

            {/* Bio - NORMÁLNE EDITOVATEĽNÉ POLE */}
            <div className="basic-info-section__field basic-info-section__field--full-width">
              <label htmlFor="bio" className="basic-info-section__label">
                O mne
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
                {isPending ? <>Ukladám...</> : <>Uložiť zmeny</>}
              </button>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
