"use client";

import { useEffect } from "react";
import "./FAQ.scss";

const faqs = [
  {
    question: "Ako môžem zadať finančnú otázku?",
    answer: (
      <>
        <p>
          Registrujte sa zadarmo a kliknite na <strong>„Zadať otázku“</strong>.
          Opíšte svoj finančný problém a expert vám odpovie do 24 hodín.
        </p>
        <p>
          Fórum FastCredit.sk je otvorené pre všetkých – otázky môžete položiť
          kedykoľvek, odpovede sú poskytované certifikovanými finančnými
          poradcami a právnikmi.
        </p>
      </>
    ),
  },
  {
    question: "Je poradenstvo naozaj zadarmo?",
    answer: (
      <>
        <p>
          Áno, všetko finančné poradenstvo na našom fóre je úplne bezplatné.
          Neúčtujeme žiadne poplatky za otázky ani odpovede.
        </p>
        <p>
          Naši experti poskytujú rady ako verejnú službu, aby pomohli ľuďom
          lepšie sa orientovať vo financiách na Slovensku.
        </p>
      </>
    ),
  },
  {
    question: "Kto mi bude odpovedať na otázky?",
    answer: (
      <>
        <p>
          Odpovedajú <strong>certifikovaní finanční experti</strong> a{" "}
          <strong>právni poradcovia</strong> s dlhoročnými praktickými
          skúsenosťami.
        </p>
        <p>
          Každý odborník je overený a má znalosti v oblastiach ako pôžičky,
          úvery, bankové služby, poistenie a investície.
        </p>
      </>
    ),
  },
  {
    question: "Ako rýchlo dostanem odpoveď?",
    answer: (
      <>
        <p>
          Experti odpovedajú zvyčajne do <strong>24 hodín</strong>. Na urgentné
          otázky môžete dostať odpoveď aj skôr.
        </p>
        <p>
          Všetko závisí od náročnosti otázky – jednoduché témy sú riešené
          rýchlejšie, zložité prípady (napr. hypotéky, právne spory) si môžu
          vyžadovať viac času.
        </p>
      </>
    ),
  },
];

const FAQ = () => {
  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    const dateElement = document.getElementById("update-faq-date");
    if (dateElement) {
      dateElement.textContent = formattedDate;
    }
  }, []);

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <h2 className="faq-section__title">Časté otázky</h2>
        <p className="faq-section__subtitle">
          Nájdite odpovede na najčastejšie otázky o pôžičkách, úveroch a
          finančných službách na Slovensku
        </p>
        <div className="faq__wrapper">
          {faqs.map((item, idx) => (
            <details key={idx} open={idx === 0}>
              <summary>
                <strong>{item.question}</strong>
              </summary>
              <div className="faq__details">{item.answer}</div>
            </details>
          ))}

          <p className="faq__date">
            <strong>Posledná aktualizácia FAQ:</strong>{" "}
            <span id="update-faq-date"></span>
          </p>
          <br />
          <p>
            <em>
              Nenašli ste odpoveď na svoju otázku?{" "}
              <a href="https://fastcredit.sk/kontakty.html">Kontaktujte nás</a>{" "}
              a radi vám pomôžeme.
            </em>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
