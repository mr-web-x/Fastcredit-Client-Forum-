// Файл: src/features/QuestionsListPage/QuestionsEmpty/QuestionsEmpty.jsx

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { basePath } from "@/src/constants/config";
import "./QuestionsEmpty.scss";

export default function QuestionsEmpty() {
  const searchParams = useSearchParams();

  // Проверяем активные фильтры
  const hasFilters =
    searchParams.get("category") ||
    searchParams.get("status") ||
    searchParams.get("period");

  // Получаем информацию о текущих фильтрах для персонализированного сообщения
  const getFilterInfo = () => {
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const period = searchParams.get("period");

    const categoryNames = {
      expert: "kategórii Expert",
      lawyer: "kategórii Právnik",
    };

    const statusNames = {
      answered: "so stavom Zodpovedané",
      unanswered: "bez odpovedí",
      closed: "so stavom Uzavreté",
    };

    const periodNames = {
      day: "za posledný deň",
      week: "za posledný týždeň",
      month: "za posledný mesiac",
    };

    let filterDescription = "";

    if (category) {
      filterDescription += `v ${categoryNames[category] || category}`;
    }

    if (status) {
      if (filterDescription) filterDescription += " ";
      filterDescription += statusNames[status] || status;
    }

    if (period) {
      if (filterDescription) filterDescription += " ";
      filterDescription += periodNames[period] || period;
    }

    return filterDescription;
  };

  const clearFiltersUrl = "/questions";
  const filterInfo = getFilterInfo();

  return (
    <div className="questions-empty">
      <div className="questions-empty__content">
        {/* Ikona */}
        <div className="questions-empty__icon">{hasFilters ? "🔍" : "❓"}</div>

        {/* Hlavný text */}
        <h3 className="questions-empty__title">
          {hasFilters
            ? "Žiadne otázky nenájdené"
            : "Zatiaľ tu nie sú žiadne otázky"}
        </h3>

        <p className="questions-empty__description">
          {hasFilters ? (
            <>
              Nenašli sme žiadne otázky {filterInfo && `${filterInfo}`}.
              <br />
              Skúste zmeniť filtre alebo položiť novú otázku.
            </>
          ) : (
            <>
              Staňte sa prvým, kto položí otázku v našom fóre.
              <br />
              Naši experti vám radi pomôžu s finančnými otázkami.
            </>
          )}
        </p>

        {/* Akcie */}
        <div className="questions-empty__actions">
          <Link href={`/ask`} className="btn questions-empty__ask-btn">
            ➕ Položiť otázku
          </Link>

          {hasFilters && (
            <Link
              href={clearFiltersUrl}
              className="questions-empty__clear-filters"
            >
              Vymazať filtre
            </Link>
          )}
        </div>

        {/* Dodatočné návrhy */}
        {hasFilters && (
          <div className="questions-empty__suggestions">
            <h4 className="questions-empty__suggestions-title">Môžete tiež:</h4>
            <ul className="questions-empty__suggestions-list">
              <li>
                <Link href={`/questions`}>Prehliadnuť všetky otázky</Link>
              </li>
              <li>
                <Link href={`/experts`}>Pozrieť si našich expertov</Link>
              </li>
              <li>
                <Link href={`/`}>Návrat na hlavnú stránku fóra</Link>
              </li>
            </ul>
          </div>
        )}

        {/* Pre úplne prázdne fórum - motivačné odkazy */}
        {!hasFilters && (
          <div className="questions-empty__motivation">
            <h4 className="questions-empty__motivation-title">
              O čom môžete sa opýtať:
            </h4>
            <div className="questions-empty__topics">
              <span className="questions-empty__topic">💳 Kreditné karty</span>
              <span className="questions-empty__topic">🏠 Hypotéky</span>
              <span className="questions-empty__topic">💰 Pôžičky</span>
              <span className="questions-empty__topic">📈 Investície</span>
              <span className="questions-empty__topic">🛡️ Poistenie</span>
              <span className="questions-empty__topic">⚖️ Právne otázky</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
