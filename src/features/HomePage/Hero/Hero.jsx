import "./Hero.scss";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__container">
        <div className="hero__content">
          <h1>Fórum o pôžičkách a financiách</h1>
          <p>
            Spýtaj sa komunitu a expertov, nájdi odpoveď rýchlo a bez zbytočných
            slov.
          </p>
          <div className="hero__actions">
            <a className="btn btn--main" href={`/forum/ask`}>
              Zadať otázku
            </a>
            <a className="btn btn--secondary" href={`/forum/questions`}>
              Prejsť na otázky
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
