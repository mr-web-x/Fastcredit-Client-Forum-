import "./LatestQuestions.scss";

export default async function LatestQuestions() {
  // тут позже подключим questionsService.getLatest()
  return (
    <section className="latest-questions">
      <div className="container">
        <h2>Najnovšie otázky</h2>
        <div className="latest-questions__list">
          {/* Вставим QuestionItem[] */}
          <p>Здесь будет список последних вопросов</p>
        </div>
      </div>
    </section>
  );
}
