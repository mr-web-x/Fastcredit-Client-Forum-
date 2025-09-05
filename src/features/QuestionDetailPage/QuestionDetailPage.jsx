// Файл: src/features/QuestionDetailPage/QuestionDetailPage.jsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { basePath } from "@/src/constants/config";
import QuestionHeader from "./QuestionHeader/QuestionHeader";
import QuestionContent from "./QuestionContent/QuestionContent";
import QuestionStats from "./QuestionStats/QuestionStats";
import AnswersList from "./AnswersList/AnswersList";
import AnswerForm from "./AnswerForm/AnswerForm";
import CommentsSection from "./CommentsSection/CommentsSection";
import SimilarQuestions from "./SimilarQuestions/SimilarQuestions";
import QuestionActions from "./QuestionActions/QuestionActions";
import "./QuestionDetailPage.scss";

export default function QuestionDetailPage({
  question,
  answers = [],
  comments = [],
  similarQuestions = [],
  user,
  permissions,
  error,
}) {
  const [optimisticAnswers, setOptimisticAnswers] = useState(answers);
  const [optimisticComments, setOptimisticComments] = useState(comments);
  const [isAnswerFormOpen, setIsAnswerFormOpen] = useState(false);

  // State для управления лайками и действиями
  const [questionStats, setQuestionStats] = useState({
    likes: question.likes || 0,
    views: question.views || 0,
    isLiked: question.isLiked || false,
  });

  // Обновляем состояние при изменении данных
  useEffect(() => {
    setOptimisticAnswers(answers);
  }, [answers]);

  useEffect(() => {
    setOptimisticComments(comments);
  }, [comments]);

  // Обработчики для оптимистичных обновлений
  const handleQuestionLike = async () => {
    // Оптимистичное обновление UI
    setQuestionStats((prev) => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked,
    }));

    try {
      // Здесь будет реальный API вызов
      // await questionsService.likeQuestion(question._id);
    } catch (error) {
      // Откат изменений при ошибке
      setQuestionStats((prev) => ({
        ...prev,
        likes: prev.isLiked ? prev.likes + 1 : prev.likes - 1,
        isLiked: !prev.isLiked,
      }));
      console.error("Failed to like question:", error);
    }
  };

  const handleAnswerSubmit = async (answerData) => {
    try {
      // Оптимистичное добавление ответа
      const optimisticAnswer = {
        _id: `temp-${Date.now()}`,
        content: answerData.content,
        author: user,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        status: "pending",
        isBest: false,
      };

      setOptimisticAnswers((prev) => [...prev, optimisticAnswer]);
      setIsAnswerFormOpen(false);

      // Здесь будет реальный API вызов
      // const newAnswer = await answersService.createAnswer(question._id, answerData);
      // Заменяем временный ответ на реальный
    } catch (error) {
      // Удаляем оптимистичный ответ при ошибке
      setOptimisticAnswers((prev) =>
        prev.filter((answer) => !answer._id.startsWith("temp-"))
      );
      console.error("Failed to submit answer:", error);
    }
  };

  const handleCommentSubmit = async (commentData) => {
    try {
      // Оптимистичное добавление комментария
      const optimisticComment = {
        _id: `temp-${Date.now()}`,
        content: commentData.content,
        author: user,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        parentComment: commentData.parentComment || null,
      };

      setOptimisticComments((prev) => [...prev, optimisticComment]);

      // Здесь будет реальный API вызов
      // const newComment = await commentsService.createComment(question._id, commentData);
    } catch (error) {
      // Удаляем оптимистичный комментарий при ошибке
      setOptimisticComments((prev) =>
        prev.filter((comment) => !comment._id.startsWith("temp-"))
      );
      console.error("Failed to submit comment:", error);
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    try {
      // Оптимистичное обновление
      setOptimisticAnswers((prev) =>
        prev.map((answer) => ({
          ...answer,
          isBest: answer._id === answerId,
        }))
      );

      // Здесь будет реальный API вызов
      // await answersService.acceptAnswer(answerId);
    } catch (error) {
      // Откат изменений
      setOptimisticAnswers(answers);
      console.error("Failed to accept answer:", error);
    }
  };

  // Показываем ошибку если есть
  if (error) {
    return (
      <div className="question-detail-page">
        <div className="container">
          <div className="question-detail-page__error">
            <div className="question-detail-page__error-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <h2>Chyba pri načítaní otázky</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="question-detail-page__error-retry"
            >
              Skúsiť znovu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="question-detail-page">
      <div className="container">
        {/* Breadcrumbs */}
        <nav
          className="question-detail-page__breadcrumbs"
          aria-label="Breadcrumb"
        >
          <Link
            href={`${basePath}/`}
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
            href={`${basePath}/questions`}
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
            {question.title?.length > 50
              ? `${question.title.substring(0, 50)}...`
              : question.title}
          </span>
        </nav>

        {/* Question Header */}
        <QuestionHeader
          question={question}
          stats={questionStats}
          user={user}
          permissions={permissions}
          onLike={handleQuestionLike}
        />

        {/* Main Content Layout */}
        <div className="question-detail-page__content">
          {/* Main Column */}
          <main className="question-detail-page__main">
            {/* Question Content */}
            <QuestionContent
              question={question}
              user={user}
              permissions={permissions}
            />

            {/* Question Actions (Mobile) */}
            <div className="question-detail-page__actions-mobile">
              <QuestionActions
                question={question}
                stats={questionStats}
                user={user}
                permissions={permissions}
                onLike={handleQuestionLike}
                isMobile={true}
              />
            </div>

            {/* Answer Form (Experts Only) */}
            {permissions.canAnswer && (
              <section className="question-detail-page__answer-form">
                <div className="question-detail-page__section-header">
                  <h2 className="question-detail-page__section-title">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Vaša odpoveď
                  </h2>
                  {!isAnswerFormOpen && (
                    <button
                      onClick={() => setIsAnswerFormOpen(true)}
                      className="question-detail-page__answer-toggle"
                    >
                      Odpovedať
                    </button>
                  )}
                </div>

                {isAnswerFormOpen && (
                  <AnswerForm
                    question={question}
                    user={user}
                    onSubmit={handleAnswerSubmit}
                    onCancel={() => setIsAnswerFormOpen(false)}
                  />
                )}
              </section>
            )}

            {/* Answers List */}
            <section className="question-detail-page__answers">
              <div className="question-detail-page__section-header">
                <h2 className="question-detail-page__section-title">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
                  </svg>
                  Odpovede ({optimisticAnswers.length})
                </h2>
              </div>

              <AnswersList
                answers={optimisticAnswers}
                question={question}
                user={user}
                permissions={permissions}
                onAcceptAnswer={handleAcceptAnswer}
              />
            </section>

            {/* Comments Section */}
            <section className="question-detail-page__comments">
              <CommentsSection
                comments={optimisticComments}
                question={question}
                answers={optimisticAnswers}
                user={user}
                permissions={permissions}
                onCommentSubmit={handleCommentSubmit}
              />
            </section>
          </main>

          {/* Sidebar */}
          <aside className="question-detail-page__sidebar">
            {/* Question Stats */}
            <QuestionStats
              question={question}
              stats={questionStats}
              answers={optimisticAnswers}
              user={user}
            />

            {/* Question Actions (Desktop) */}
            <div className="question-detail-page__actions-desktop">
              <QuestionActions
                question={question}
                stats={questionStats}
                user={user}
                permissions={permissions}
                onLike={handleQuestionLike}
                isMobile={false}
              />
            </div>

            {/* Similar Questions */}
            {similarQuestions.length > 0 && (
              <SimilarQuestions
                questions={similarQuestions}
                currentQuestion={question}
              />
            )}

            {/* Expert CTA (for non-experts) */}
            {!permissions.canAnswer && user && (
              <div className="question-detail-page__expert-cta">
                <div className="question-detail-page__expert-cta-content">
                  <div className="question-detail-page__expert-cta-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h3>Chcete sa stať expertom?</h3>
                  <p>
                    Pomáhajte ostatným a zdieľajte svoje znalosti v oblasti
                    financií.
                  </p>
                  <Link
                    href={`${basePath}/experts/apply`}
                    className="question-detail-page__expert-apply"
                  >
                    Žiadosť o expertnú rolu
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
