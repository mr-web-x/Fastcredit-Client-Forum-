"use client";
import "./Pagination.scss";

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const prev = () => page > 1 && onChange(page - 1);
  const next = () => page < totalPages && onChange(page + 1);

  const btn = (p) => (
    <button
      key={p}
      className={`pg__btn ${p === page ? "active" : ""}`}
      onClick={() => onChange(p)}
    >
      {p}
    </button>
  );

  // компактный диапазон
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  if (start > 1) pages.push(btn(1));
  if (start > 2)
    pages.push(
      <span key="l-ellipsis" className="pg__dots">
        …
      </span>
    );
  for (let p = start; p <= end; p++) pages.push(btn(p));
  if (end < totalPages - 1)
    pages.push(
      <span key="r-ellipsis" className="pg__dots">
        …
      </span>
    );
  if (end < totalPages) pages.push(btn(totalPages));

  return (
    <div className="pagination">
      <button className="pg__btn" disabled={page <= 1} onClick={prev}>
        Назад
      </button>
      <div className="pg__list">{pages}</div>
      <button className="pg__btn" disabled={page >= totalPages} onClick={next}>
        Вперёд
      </button>
    </div>
  );
}
