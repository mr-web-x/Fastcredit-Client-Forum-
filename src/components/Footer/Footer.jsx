"use client";

import Link from "next/link";
import "./Footer.scss";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  const isProfilePage =
    pathname === "/forum/profile" || pathname.startsWith("/forum/profile/");

  if (isProfilePage) return null;

  return (
    <footer className="FooterMain" id="contacts">
      <div className="container">
        <div className="footer__wrapper row">
          <div className="footer__item">
            <a className="logo" href="https://fastcredit.sk">
              <img alt="logo" src="/forum/logo.svg" />
            </a>
          </div>
          <div className="footer__item footer__item-second">
            <nav aria-label="Mapa stránky" class="footer-sitemap">
              <ul class="footer-sitemap-ul">
                <li><a href="https://fastcredit.sk/#list">Získať pôžičku</a></li>
                <li><a href="https://fastcredit.sk/#about">O nás</a></li>
                <li><a href="https://fastcredit.sk/#policy">Podmienky používania</a></li>
                <li><a href="/forum/">Fórum</a></li>
                <li>
                  <a href="https://fastcredit.sk/#clanky">Publikované články</a>
                </li>
                <li>
                  <a href="https://fastcredit.sk/caste-otazky.html">Časté otázky</a>
                </li>
                <li><a href="https://fastcredit.sk/kontakty.html">Kontakty</a></li>
                <li><a href="https://fastcredit.sk/game.html">Zľava</a></li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="footer__social-links">
          <a
            href="https://www.linkedin.com/company/fastcredit-sk"
            rel="nofollow noreferrer"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-linkedin"
              aria-hidden="true"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect width="4" height="12" x="2" y="9"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61581050981290"
            rel="nofollow noreferrer"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-facebook"
              aria-hidden="true"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
        </div>

        <div className="footer__under">
          <p>
            <span className="cookies-open-btn">Zmena nastavenia cookies</span>
            <span>© 2025 - Všetky práva vyhradené</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
