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
            <nav className="footer-sitemap" aria-label="Mapa stránky">
              <h2>Mapa stránky</h2>
              <ul className="footer-sitemap-ul">
                <li>
                  <a href="https://fastcredit.sk">Domov</a>
                  <ul>
                    <li>
                      <a href="https://fastcredit.sk/#list">Získať pôžičku</a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/#about">O nás</a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/#policy">
                        Podmienky používania
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/kontakty.html">Kontakty</a>
                    </li>
                    <li>
                      <Link href="/forum/">Fórum</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="https://fastcredit.sk/typy-poziciek.html">
                    Typy pôžičiek
                  </a>
                  <ul>
                    <li>
                      <a href="https://fastcredit.sk/rychla-pozicka.html">
                        Rýchla pôžička
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/typy-poziciek/pozicka-do-vyplaty.html">
                        Pôžička do výplaty
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/typy-poziciek/online-pozicka-na-kartu.html">
                        Na kartu
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/typy-poziciek/pozicka-pre-studentov-a-mladez-online.html">
                        Pre študentov
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/typy-poziciek/pozicka-so-zaznamom-v-registri.html">
                        So záznamom v registri
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="https://fastcredit.sk/blog.html">Blog</a>
                  <ul>
                    <li>
                      <a href="https://fastcredit.sk/blog/ako-ziskat-auto-uver-na-slovensku.html">
                        Auto úver
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/blog/mikropozicky-na-slovensku.html">
                        Mikropôžičky
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/blog/kontrola-uverovej-historie.html">
                        Úverová história
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/blog/banka-vs-mikropozicky.html">
                        Banka vs. Mikropôžičky
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/blog/studentske-pozicky-na-vzdelanie.html">
                        Študentské pôžičky
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="https://fastcredit.sk/slovnik.html">
                    Slovník pojmov
                  </a>
                  <ul className="slovnik-pojmov">
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-a">
                        A
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-b">
                        B
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-c">
                        C
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-d">
                        D
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-e">
                        E
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-f">
                        F
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-g">
                        G
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-h">
                        H
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-i">
                        I
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-j">
                        J
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-k">
                        K
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-l">
                        L
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-m">
                        M
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-n">
                        N
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-o">
                        O
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-p">
                        P
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-q">
                        Q
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-r">
                        R
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-s">
                        S
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-t">
                        T
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-u">
                        U
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-v">
                        V
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-w">
                        W
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-x">
                        X
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-y">
                        Y
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/slovnik.html/#pismeno-z">
                        Z
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="https://fastcredit.sk/caste-otazky.html">
                    Časté otázky
                  </a>
                  <ul>
                    <li>
                      <a href="https://fastcredit.sk/caste-otazky.html#o-sluzbe-fastcredit">
                        O službe FastCredit.sk
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/caste-otazky.html#pozicky-a-uvery">
                        Pôžičky a úvery
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/caste-otazky.html#podmienky-a-poziadavky">
                        Podmienky a požiadavky
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/caste-otazky.html#schvalovaci-proces">
                        Schvaľovací proces
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/caste-otazky.html#splacanie-a-predcasne-splatenie">
                        Splácanie a predčasné splatenie
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/caste-otazky.html#refinancovanie-a-konsolidacia">
                        Refinancovanie a konsolidácia
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/caste-otazky.html#bezpecnost-a-ochrana">
                        Bezpečnosť a ochrana
                      </a>
                    </li>
                    <li>
                      <a href="https://fastcredit.sk/caste-otazky.html#specificke-situacie">
                        Špecifické situácie
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
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
