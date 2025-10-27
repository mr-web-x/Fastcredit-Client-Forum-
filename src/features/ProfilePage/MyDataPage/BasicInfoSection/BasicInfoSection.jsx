// Файл: src/features/ProfilePage/MyDataPage/BasicInfoSection/BasicInfoSection.jsx

"use client";

import "./BasicInfoSection.scss";

import { useState, useEffect, useCallback } from "react";
import { useActionState } from "react";
import { updateMyDataAction } from "@/app/actions/profile";
import EditIcon from "@mui/icons-material/Edit";
import ReportIcon from "@mui/icons-material/Report";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BasicInfoSection({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updateMyDataAction, null);

  // ---------------------------
  // ЛОКАЛЬНЫЙ СТЕЙТ (CONTROLLED)
  // ---------------------------
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [website, setWebsite] = useState(user?.contacts?.website || "");
  const [email, setEmail] = useState(user?.contacts?.email || "");
  const [phone, setPhone] = useState(user?.contacts?.phone || "");
  const [socials, setSocials] = useState(user?.contacts?.socials || []);

  // Хелпер: инициализация формы из user
  const initFromUser = useCallback(() => {
    setUsername(user?.username || "");
    setBio(user?.bio || "");
    setWebsite(user?.contacts?.website || "");
    setEmail(user?.contacts?.email || "");
    setPhone(user?.contacts?.phone || "");
    setSocials(user?.contacts?.socials || []);
  }, [user]);

  // При открытии режима редактирования подхватываем актуальные данные пользователя
  useEffect(() => {
    if (isEditing) {
      initFromUser();
    }
  }, [isEditing, initFromUser]);

  // Если проп user обновился извне (например, после перезагрузки профиля) — синхронизируем в режиме просмотра
  useEffect(() => {
    if (!isEditing) {
      initFromUser();
    }
  }, [user, isEditing, initFromUser]);

  // После успешного сохранения закрываем режим редактирования
  useEffect(() => {
    if (state?.success) {
      setIsEditing(false);
    }
  }, [state?.success]);

  // ---------------------------
  // СОЦСЕТИ (CONTROLLED)
  // ---------------------------
  const handleAddSocial = () => {
    if (socials.length < 5 && !isPending) {
      setSocials((prev) => [...prev, ""]);
    }
  };

  const handleRemoveSocial = (index) => {
    if (isPending) return;
    setSocials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSocialChange = (index, value) => {
    setSocials((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  // ---------------------------
  // ПЕРЕКЛЮЧЕНИЕ РЕЖИМА
  // ---------------------------
  const handleToggleEdit = () => {
    if (isPending) return;
    setIsEditing((v) => !v);
  };

  // ---------------------------
  // SUBMIT ЧЕРЕЗ useActionState (no-hidden)
  // ---------------------------
  const handleSubmit = async (formData) => {
    // Централизованно формируем payload
    formData.set("action", "update_profile");
    formData.set("username", username);
    formData.set("bio", bio);
    formData.set("website", website);
    formData.set("email", email);
    formData.set("phone", phone);

    // Соцсети как social_0..N и счётчик (сохраняем контракт бекенда)
    socials.forEach((s, i) => formData.set(`social_${i}`, s));
    formData.set("socials_count", String(socials.length));

    // Отправляем на серверный экшен
    await formAction(formData);
  };

  return (
    <section className="basic-info-section">
      <div className="basic-info-section__header">
        <div className="basic-info-section__header-text">
          <h2 className="basic-info-section__title">Základné informácie</h2>
          <p className="basic-info-section__description">
            {isEditing ? "Upravte svoje osobné údaje" : "Vaše základné osobné informácie"}
          </p>
        </div>

        <div className="basic-info-section__actions">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleToggleEdit}
              className="basic-info-section__edit-button"
              disabled={isPending}
            >
              <span className="basic-info-section__button-icon">
                <EditIcon />
              </span>
              <span className="basic-info-section__button-text">Upraviť profil</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleToggleEdit}
              className="basic-info-section__cancel-button"
              disabled={isPending}
            >
              Zrušiť úpravy
            </button>
          )}
        </div>
      </div>

      {/* Ключевой момент: action принимает клиентский колбэк, который наполняет FormData и вызывает server action */}
      <form action={handleSubmit} className="basic-info-section__form">
        <div className="basic-info-section__content">
          <div className="basic-info-section__alerts">
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

            {isEditing && (
              <div className="basic-info-section__info-banner">
                <span className="basic-info-section__info-icon">
                  <InfoIcon sx={{ fontSize: "16px" }} />
                </span>
                <div>
                  <strong>Dôležité upozornenie</strong>
                  <p>
                    Meno a priezvisko nie je možné zmeniť z bezpečnostných dôvodov. Pre
                    zmenu kontaktujte podporu.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="basic-info-section__grid">
            {/* Meno - LOCKED */}
            <div className="basic-info-section__field">
              <label htmlFor="firstName" className="basic-info-section__label">
                Meno
                <span className="basic-info-section__lock-icon">
                  <LockIcon sx={{ fontSize: "14px" }} />
                </span>
              </label>

              <div
                className={`basic-info-section__value ${isEditing ? "basic-info-section__value--locked" : ""
                  }`}
              >
                {user?.firstName || "Nezadané"}
              </div>

              {isEditing && (
                <div className="basic-info-section__locked-help">
                  <LockIcon sx={{ fontSize: "12px" }} />
                  Toto pole nie je možné upraviť
                </div>
              )}
            </div>

            {/* Priezvisko - LOCKED */}
            <div className="basic-info-section__field">
              <label htmlFor="lastName" className="basic-info-section__label">
                Priezvisko
                <span className="basic-info-section__lock-icon">
                  <LockIcon sx={{ fontSize: "14px" }} />
                </span>
              </label>

              <div
                className={`basic-info-section__value ${isEditing ? "basic-info-section__value--locked" : ""
                  }`}
              >
                {user?.lastName || "Nezadané"}
              </div>

              {isEditing && (
                <div className="basic-info-section__locked-help">
                  <LockIcon sx={{ fontSize: "12px" }} />
                  Toto pole nie je možné upraviť
                </div>
              )}
            </div>

            {/* Username */}
            <div className="basic-info-section__field basic-info-section__field--full-width">
              <label htmlFor="username" className="basic-info-section__label">
                Používateľské meno
              </label>

              {isEditing ? (
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Zadajte používateľské meno"
                  disabled={isPending}
                  className={`basic-info-section__input ${state?.fieldErrors?.username ? "basic-info-section__input--error" : ""
                    }`}
                  autoComplete="username"
                  minLength={3}
                  maxLength={30}
                />
              ) : (
                <div className="basic-info-section__value">{user?.username || "Nezadané"}</div>
              )}

              {isEditing && !state?.fieldErrors?.username && (
                <div className="basic-info-section__help">
                  3-30 znakov, len písmená, číslice a podčiarkovník
                </div>
              )}

              {state?.fieldErrors?.username && (
                <div className="basic-info-section__error">{state.fieldErrors.username}</div>
              )}
            </div>

            {/* Bio */}
            <div className="basic-info-section__field basic-info-section__field--full-width">
              <label htmlFor="bio" className="basic-info-section__label">
                O mne
              </label>

              {isEditing ? (
                <textarea
                  id="bio"
                  name="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Napíšte niečo o sebe..."
                  disabled={isPending}
                  className={`basic-info-section__textarea ${state?.fieldErrors?.bio ? "basic-info-section__textarea--error" : ""
                    }`}
                  maxLength={8000}
                  rows={6}
                />
              ) : (
                <div className="basic-info-section__value basic-info-section__value--multiline">
                  {user?.bio || "Žiadny popis"}
                </div>
              )}

              {isEditing && !state?.fieldErrors?.bio && (
                <div className="basic-info-section__help">Maximálne 8000 znakov</div>
              )}

              {state?.fieldErrors?.bio && (
                <div className="basic-info-section__error">{state.fieldErrors.bio}</div>
              )}
            </div>

            {/* Website */}
            <div className="basic-info-section__field basic-info-section__field--full-width">
              <label htmlFor="website" className="basic-info-section__label">
                Kontaktná webstránka
              </label>

              {isEditing ? (
                <input
                  id="website"
                  type="url"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  disabled={isPending}
                  className={`basic-info-section__input ${state?.fieldErrors?.website ? "basic-info-section__input--error" : ""
                    }`}
                />
              ) : (
                <div className="basic-info-section__value">
                  {user?.contacts?.website ? (
                    <a
                      href={user.contacts.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="basic-info-section__link"
                    >
                      {user.contacts.website}
                    </a>
                  ) : (
                    "Nezadané"
                  )}
                </div>
              )}

              {isEditing && !state?.fieldErrors?.website && (
                <div className="basic-info-section__help">URL musí začínať http:// alebo https://</div>
              )}

              {state?.fieldErrors?.website && (
                <div className="basic-info-section__error">{state.fieldErrors.website}</div>
              )}
            </div>

            {/* Email */}
            <div className="basic-info-section__field basic-info-section__field--full-width">
              <label htmlFor="email" className="basic-info-section__label">
                Kontaktný email
              </label>

              {isEditing ? (
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  disabled={isPending}
                  className={`basic-info-section__input ${state?.fieldErrors?.email ? "basic-info-section__input--error" : ""
                    }`}
                />
              ) : (
                <div className="basic-info-section__value">
                  {user?.contacts?.email ? (
                    <a href={`mailto:${user.contacts.email}`} className="basic-info-section__link">
                      {user.contacts.email}
                    </a>
                  ) : (
                    "Nezadané"
                  )}
                </div>
              )}

              {isEditing && !state?.fieldErrors?.email && (
                <div className="basic-info-section__help">
                  Zadajte platný email vo formáte: text@domain.com
                </div>
              )}

              {state?.fieldErrors?.email && (
                <div className="basic-info-section__error">{state.fieldErrors.email}</div>
              )}
            </div>

            {/* Phone */}
            <div className="basic-info-section__field basic-info-section__field--full-width">
              <label htmlFor="phone" className="basic-info-section__label">
                Kontaktný telefón
              </label>

              {isEditing ? (
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+421"
                  disabled={isPending}
                  onFocus={(e) => {
                    if (!e.target.value) setPhone("+421");
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "+421") setPhone("");
                  }}
                  className={`basic-info-section__input ${state?.fieldErrors?.phone ? "basic-info-section__input--error" : ""
                    }`}
                />
              ) : (
                <div className="basic-info-section__value">
                  {user?.contacts?.phone ? (
                    <a href={`tel:${user.contacts.phone}`} className="basic-info-section__link">
                      {user.contacts.phone}
                    </a>
                  ) : (
                    "Nezadané"
                  )}
                </div>
              )}

              {isEditing && !state?.fieldErrors?.phone && (
                <div className="basic-info-section__help">Slovenský formát: +421 XXX XXX XXX</div>
              )}

              {state?.fieldErrors?.phone && (
                <div className="basic-info-section__error">{state.fieldErrors.phone}</div>
              )}
            </div>

            {/* Sociálne siete */}
            <div className="basic-info-section__field basic-info-section__field--full-width">
              <label className="basic-info-section__label">Sociálne siete</label>

              {isEditing ? (
                <div className="basic-info-section__socials-editor">
                  {socials.map((social, index) => (
                    <div key={index} className="basic-info-section__social-input-group">
                      <input
                        type="url"
                        name={`social_${index}`}
                        className={`basic-info-section__input ${state?.fieldErrors?.[`social_${index}`]
                          ? "basic-info-section__input--error"
                          : ""
                          }`}
                        placeholder="https://instagram.com/username"
                        value={social}
                        onChange={(e) => handleSocialChange(index, e.target.value)}
                        disabled={isPending}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSocial(index)}
                        className="basic-info-section__social-remove-btn"
                        disabled={isPending}
                        title="Odstrániť"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </div>
                  ))}

                  {socials.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddSocial}
                      className="basic-info-section__add-social-btn"
                      disabled={isPending}
                    >
                      <AddIcon fontSize="small" />
                      Pridať sociálnu sieť
                    </button>
                  )}

                  {socials.length === 0 && (
                    <p className="basic-info-section__help">
                      Pridajte odkazy na vaše sociálne siete (max 5)
                    </p>
                  )}

                  {socials.length >= 5 && (
                    <p className="basic-info-section__help">
                      Dosiahli ste maximum 5 sociálnych sietí
                    </p>
                  )}

                  {state?.fieldErrors?.socials && (
                    <div className="basic-info-section__error">{state.fieldErrors.socials}</div>
                  )}
                </div>
              ) : (
                <div className="basic-info-section__socials-display">
                  {Array.isArray(user?.contacts?.socials) &&
                    user.contacts.socials.length > 0 ? (
                    user.contacts.socials.map((social, index) => (
                      <a
                        key={index}
                        href={social}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="basic-info-section__social-link"
                      >
                        {social}
                      </a>
                    ))
                  ) : (
                    <div className="basic-info-section__value">Žiadne sociálne siete</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="basic-info-section__save">
              <button
                type="submit"
                disabled={isPending}
                className="basic-info-section__save-button"
              >
                {isPending ? "Ukladám..." : "Uložiť zmeny"}
              </button>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
