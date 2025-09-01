"use client";

import { useEffect, useMemo, useState } from "react";
import "./QuestionsTabs.scss";
import questionsService from "@/src/services/questions";
import QuestionItem from "@/src/components/Question/QuestionItem";
import Pagination from "@/src/components/UI/Pagination";

const TABS = [
  { key: "latest", label: "Najnovšie otázky" },
  { key: "top", label: "Top otázky" },
];

export default function QuestionsTabs() {
  // čítame tab/page z URL, aby sa stav zachoval pri navigácii
  const [tab, setTab] = useState(() => {
    if (typeof window === "undefined") return "latest";
    const u = new URL(window.location.href);
    return u.searchParams.get("tab") || "latest";
  });

  const [page, setPage] = useState(() => {
    if (typeof window === "undefined") return 1;
    const u = new URL(window.location.href);
    return Number(u.searchParams.get("page") || 1);
  });

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(undefined); // ak backend vráti total
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  // synchronizácia URL (tab/page)
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "/forum";
    const u = new URL(window.location.href);
    u.pathname = `${base}`;
    u.searchParams.set("tab", tab);
    u.searchParams.set("page", String(page));
    window.history.replaceState({}, "", u.toString());
  }, [tab, page]);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    const load = async () => {
      try {
        let result;
        if (tab === "latest") {
          result = await questionsService.getLatest({ page, limit });
        } else {
          result = await questionsService.getTop({ limit });
        }

        if (!alive) return;

        console.log(result);
        setItems(result.items);
        setTotal(result.pagination?.totalItems);
      } catch (e) {
        if (!alive) return;
        setItems([]);
        setTotal(undefined);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [tab, page, limit]);

  // koľko je strán (ak backend vrátil total)
  const totalPages = useMemo(() => {
    if (!total) return undefined;
    return Math.max(1, Math.ceil(total / limit));
  }, [total, limit]);

  return (
    <section className="questions-tabs">
      <div className="container">
        {/* Prepínač záložiek */}
        <div className="qt__tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`qt__tab ${tab === t.key ? "active" : ""}`}
              onClick={() => {
                setTab(t.key);
                setPage(1);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Obsah */}
        <div className="qt__panel">
          {loading ? (
            <div className="qt__loading">Načítava sa…</div>
          ) : items?.length ? (
            <>
              <ul className="qt__list">
                {items.map((q) => (
                  <li key={q._id}>
                    <QuestionItem question={q} />
                  </li>
                ))}
              </ul>

              {/* Stránkovanie: zobrazíme ak máme totalPages; pri latest sa dá listovať ďalej */}
              {tab === "latest" &&
                (totalPages ? (
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={(p) => setPage(p)}
                  />
                ) : (
                  <div className="qt__note">Zobrazené sú najnovšie otázky.</div>
                ))}

              {tab === "top" && (
                <div className="qt__note">
                  Top sa počíta za 30 dní podľa lajkov.
                </div>
              )}
            </>
          ) : (
            <div className="qt__empty">Zatiaľ žiadne údaje.</div>
          )}
        </div>
      </div>
    </section>
  );
}
