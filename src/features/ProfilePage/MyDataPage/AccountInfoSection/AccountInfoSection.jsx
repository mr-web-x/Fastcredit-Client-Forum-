// Файл: src/features/ProfilePage/MyDataPage/AccountInfoSection/AccountInfoSection.jsx

"use client";

import "./AccountInfoSection.scss";

export default function AccountInfoSection({ user }) {
  // Форматирование даты регистрации
  const formatDate = (dateString) => {
    if (!dateString) return "Neznámy";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("sk-SK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Neznámy";
    }
  };

  // Форматирование последнего входа
  const formatLastLogin = (dateString) => {
    if (!dateString) return "Nikdy";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) {
        return "Dnes";
      } else if (diffInDays === 1) {
        return "Včera";
      } else if (diffInDays < 7) {
        return `Pred ${diffInDays} dňami`;
      } else {
        return date.toLocaleDateString("sk-SK");
      }
    } catch {
      return "Neznámy";
    }
  };

  // Получение текста роли
  const getRoleText = (role) => {
    const roleTexts = {
      user: "Používateľ",
      expert: "Expert",
      moderator: "Moderátor",
      admin: "Administrátor",
    };
    return roleTexts[role] || role;
  };

  // Получение цвета роли для бейджа
  const getRoleClass = (role) => {
    return `account-info-section__badge--${role}`;
  };

  // Получение текста провайдера
  const getProviderText = (provider) => {
    const providerTexts = {
      local: "Email a heslo",
      google: "Google účet",
    };
    return providerTexts[provider] || provider;
  };


  return (
    <section className="account-info-section">
      <div className="account-info-section__header">
        <h2 className="account-info-section__title">Informácie o účte</h2>
        <p className="account-info-section__description">
          Základné informácie o vašom účte a registrácii
        </p>
      </div>

      <div className="account-info-section__content">
        <div className="account-info-section__grid">
          {/* Email */}
          <div className="account-info-section__field">
            <div className="account-info-section__label">Email</div>
            <div className="account-info-section__value">{user.email}</div>
          </div>

          {/* Email verification status */}
          <div className="account-info-section__field">
            <div className="account-info-section__label">Stav overenia</div>
            <div className="account-info-section__value">
              {user.isEmailVerified ? (
                <span className="account-info-section__badge account-info-section__badge--verified">
                  Email overený
                </span>
              ) : (
                <span className="account-info-section__badge account-info-section__badge--unverified">
                  Email neoverený
                </span>
              )}
            </div>
          </div>

          {/* Registration date */}
          <div className="account-info-section__field">
            <div className="account-info-section__label">Registrovaný</div>
            <div className="account-info-section__value">
              {formatDate(user.createdAt)}
            </div>
          </div>

          {/* Last login */}
          <div className="account-info-section__field">
            <div className="account-info-section__label">
              Posledné prihlásenie
            </div>
            <div className="account-info-section__value">
              {formatLastLogin(user.lastLoginAt)}
            </div>
          </div>

          {/* User role */}
          <div className="account-info-section__field">
            <div className="account-info-section__label">Rola</div>
            <div className="account-info-section__value">
              <span
                className={`account-info-section__badge ${getRoleClass(
                  user.role
                )}`}
              >
                {getRoleText(user.role)}
              </span>
            </div>
          </div>

          {/* Registration method */}
          <div className="account-info-section__field">
            <div className="account-info-section__label">Registrácia cez</div>
            <div className="account-info-section__value">
              <span className="account-info-section__provider">
                {getProviderText(user.provider)}
              </span>
            </div>
          </div>

          {/* Account status */}
          <div className="account-info-section__field account-info-section__field--full-width">
            <div className="account-info-section__label">Stav účtu</div>
            <div className="account-info-section__value">
              <div className="account-info-section__status-grid">
                {/* Active status */}
                <span
                  className={`account-info-section__badge ${
                    user.isActive
                      ? "account-info-section__badge--active"
                      : "account-info-section__badge--inactive"
                  }`}
                >
                  {user.isActive ? "Aktívny" : "Neaktívny"}
                </span>

                {/* Ban status */}
                {user.isBanned && (
                  <span className="account-info-section__badge account-info-section__badge--banned">
                    Zablokovaný
                  </span>
                )}

                {/* Temporary ban info */}
                {user.isBanned && user.bannedUntil && (
                  <div className="account-info-section__ban-info">
                    <div className="account-info-section__ban-until">
                      Do: {formatDate(user.bannedUntil)}
                    </div>
                    {user.bannedReason && (
                      <div className="account-info-section__ban-reason">
                        Dôvod: {user.bannedReason}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
