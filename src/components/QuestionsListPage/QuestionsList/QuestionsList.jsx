// Файл: src/features/QuestionsListPage/QuestionsList/QuestionsList.jsx

import QuestionCard from "../QuestionCard/QuestionCard";
import QuestionsEmpty from "../QuestionsEmpty/QuestionsEmpty";
import "./QuestionsList.scss";

export default function QuestionsList({ questions = [], isLoading = false }) {
  // Loading state
  if (isLoading) {
    return (
      <div className="questions-list">
        <div className="questions-list__loading">
          <div className="questions-list__loading-spinner"></div>
          <p className="questions-list__loading-text">Načítava sa...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!questions || questions.length === 0) {
    return (
      <div className="questions-list">
        <QuestionsEmpty />
      </div>
    );
  }

  // Questions list
  return (
    <div className="questions-list">
      <div className="questions-list__container">
        {questions.map((question, index) => (
          <QuestionCard
            key={question._id || question.id || index}
            question={question}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
