// Файл: src/components/NotFound/NotFound.jsx

"use client";

import "./NotFoundPage.scss";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import HelpIcon from "@mui/icons-material/Help";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const NotFoundPage = () => {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found__content">
          {/* Иконка 404 */}
          <div className="not-found__icon">
            <ErrorOutlineIcon />
          </div>

          {/* Основной контент */}
          <div className="not-found__text">
            <h1 className="not-found__title">404</h1>
            <h2 className="not-found__subtitle">Stránka nebola nájdená</h2>
            <p className="not-found__description">
              Požadovaná stránka neexistuje alebo bola presunutá. Skontrolujte
              správnosť URL adresy alebo sa vráťte na hlavnú stránku.
            </p>
          </div>

          {/* Кнопки навигации */}
          <div className="not-found__actions">
            <Link
              href="/forum"
              className="not-found__btn not-found__btn--primary"
            >
              <HomeIcon />
              <span>Späť na Forum</span>
            </Link>

            <Link
              href="/forum/questions"
              className="not-found__btn not-found__btn--secondary"
            >
              <HelpIcon />
              <span>Všetky otázky</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
