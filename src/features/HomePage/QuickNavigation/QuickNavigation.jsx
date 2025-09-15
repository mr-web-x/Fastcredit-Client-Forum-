import Link from "next/link";
import "./QuickNavigation.scss";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import GavelIcon from "@mui/icons-material/Gavel";
import SchoolIcon from "@mui/icons-material/School";

export default async function QuickNavigation() {
  // Статические фильтры (всегда показываем)
  const navigationItems = [
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
      href: `/forum/questions?sortBy=views&sortOrder=-1`,
      icon: <StarIcon />,
      type: "filter",
    },
    {
      title: "Otázka expertovi",
      description: "Finančné otázky pre odborníkov a expertov",
      icon: <SchoolIcon />,
      href: `/forum/questions?category=expert`,
      type: "filter",
    },
    {
      title: "Otázka právnikovi",
      description: "Právne otázky a právne poradenstvo",
      icon: <GavelIcon />,
      href: `/forum/questions?category=lawyer`,
      type: "filter",
    },
  ];

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
