// Файл: src/features/QuestionDetailPage/QuestionDetailPage.jsx

"use client";

import AuthorInfo from "./AuthorInfo/AuthorInfo";
import QuestionContent from "./QuestionContent/QuestionContent";
import QuestionMeta from "./QuestionMeta/QuestionMeta";
import AnswersSection from "./AnswersSection/AnswersSection";
import "./QuestionDetailPage.scss";
import Link from "next/link";

export default function QuestionDetailPage({
  question,
  answers = [],
  user,
  permissions,
}) {
  return (
    <div className="question-detail-page">
      {/* Breadcrumbs */}
      <div className="container">
        <nav
          className="question-detail-page__breadcrumbs"
          aria-label="Breadcrumb"
        >
          <Link
            href={`/forum/`}
            className="question-detail-page__breadcrumb-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Domov
          </Link>
          <span className="question-detail-page__breadcrumb-separator">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6z" />
            </svg>
          </span>
          <Link
            href={`/forum/questions`}
            className="question-detail-page__breadcrumb-link"
          >
            Otázky
          </Link>
          <span className="question-detail-page__breadcrumb-separator">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6z" />
            </svg>
          </span>
          <span className="question-detail-page__breadcrumb-current">
            {question ? question.title : "Otázka"}
          </span>
        </nav>
      </div>
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
