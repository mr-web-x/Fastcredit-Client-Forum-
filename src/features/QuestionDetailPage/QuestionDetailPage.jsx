// Файл: src/features/QuestionDetailPage/QuestionDetailPage.jsx

"use client";

import AuthorInfo from "./AuthorInfo/AuthorInfo";
import QuestionContent from "./QuestionContent/QuestionContent";
import QuestionMeta from "./QuestionMeta/QuestionMeta";
import AnswersSection from "./AnswersSection/AnswersSection";
import "./QuestionDetailPage.scss";

export default function QuestionDetailPage({
  question,
  answers = [],
  user,
  permissions,
}) {
  console.dir(question);
  return (
    <div className="question-detail-page">
      {/* БЛОК 1: Вопрос + Ответы */}
      <section className="question-block">
        <div className="container">
          <div className="question-block-box">
            {/* Информация об авторе */}
            <AuthorInfo
              author={question.author}
              createdAt={question.createdAt}
            />

            {/* Контент вопроса */}
            <QuestionContent question={question} />

            {/* Метаданные: категория, приоритет, лайки, действия, дата */}
            <QuestionMeta question={question} />

            {/* Секция ответов */}
            <AnswersSection
              answers={answers}
              question={question}
              user={user}
              permissions={permissions}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
