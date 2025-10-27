import Link from "next/link";
import "./LatestQuestions.scss";
import LatestQuestionCard from "@/src/components/LatestQuestionCard/LatestQuestionCard";

export default async function LatestQuestions({ questions }) {

  return (
    <section className="latest-questions">
      <div className="container latest-questions__container">
        <div className="latest-questions__header">
          <h2 className="latest-questions__title">Najnovšie otázky</h2>
          <p className="latest-questions__subtitle">
            Posledné otázky od našej komunity
          </p>
        </div>

        {questions.length === 0 ? (
          <div className="latest-questions__empty">
            <p>Zatiaľ nie sú žiadne otázky.</p>
            <Link href="/forum/ask" className="btn">
              Položiť prvú otázku
            </Link>
          </div>
        ) : (
          <>
            <div className="latest-questions__list">
              {questions.map((question) => <LatestQuestionCard key={question._id} question={question} />)}
            </div>

            <div className="latest-questions__footer">
              <Link href="/forum/questions" className="btn btn--secondary">
                Zobraziť všetky otázky
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
