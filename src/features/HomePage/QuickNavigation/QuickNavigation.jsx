import Link from "next/link";
import { categoriesService } from "@/src/services/server";
import "./QuickNavigation.scss";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";

export default async function QuickNavigation() {
  // Статические фильтры (всегда показываем)
  const staticFilters = [
    {
      title: "Nové otázky",
      description: "Najnovšie otázky od používateľov",
      href: `/forum/questions?sortBy=createdAt&sortOrder=-1`,
      icon: <AccessTimeIcon />,
      type: "filter",
    },
    {
      title: "Populárne otázky",
      description: "Najviac hodnotené otázky",
      href: `/forum/questions?sortBy=likes&sortOrder=-1`,
      icon: <StarIcon />,
      type: "filter",
    },
  ];

  // Получаем категории с сервера
  let categories = [];
  try {
    const categoriesData = await categoriesService.getAll(true); // with stats
    categories = categoriesData.map((category) => ({
      title: category.name,
      description: category.description,
      href: `/forum/questions?category=${category.slug}`,
      icon: category.icon,
      type: "category",
      questionsCount: category.questionsCount || 0,
    }));
  } catch (error) {
    console.error("Failed to load categories:", error);
    // Если не получилось загрузить - fallback на пустой массив
  }

  // Объединяем статические фильтры + динамические категории
  const navigationItems = [...staticFilters, ...categories];

  return (
    <section className="quick-navigation">
      <div className="container quick-navigation__container">
        <h2 className="quick-navigation__title">Čo vás zaujíma?</h2>
        <p className="quick-navigation__subtitle">
          Vyberte si kategóriu alebo typ otázok
        </p>

        <div className="quick-navigation__grid">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`quick-navigation__card quick-navigation__card--${item.type}`}
            >
              <div className="quick-navigation__card-icon">{item.icon}</div>
              <div className="quick-navigation__card-content">
                <h3 className="quick-navigation__card-title">{item.title}</h3>
                <p className="quick-navigation__card-description">
                  {item.description}
                </p>
                {item.type === "category" && item.questionsCount > 0 && (
                  <span className="quick-navigation__card-count">
                    {item.questionsCount} otázok
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="quick-navigation__footer">
          <Link
            href={`/forum/questions`}
            className="btn btn--secondary quick-navigation__view-all"
          >
            Zobraziť všetky otázky
          </Link>
        </div>
      </div>
    </section>
  );
}
