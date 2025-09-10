// Файл: src/features/QuestionDetailPage/QuestionDetailPage.jsx

"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useOptimisticUpdates,
  useLike,
} from "@/src/hooks/useOptimisticUpdates";
import {
  likeQuestionAction,
  reportQuestionAction,
} from "@/app/actions/questions";
import {
  createAnswerAction,
  likeAnswerAction,
  acceptAnswerAction,
} from "@/app/actions/answers";
import { createCommentAction, likeCommentAction } from "@/app/actions/comments";
import AuthorInfo from "./AuthorInfo/AuthorInfo";
import QuestionContent from "./QuestionContent/QuestionContent";
import QuestionMeta from "./QuestionMeta/QuestionMeta";
import AnswersSection from "./AnswersSection/AnswersSection";
import "./QuestionDetailPage.scss";

export default function QuestionDetailPage({
  question,
  answers = [],
  comments = [],
  user,
  permissions,
  hasExpertAnswers: initialHasExpertAnswers = false,
}) {
  const router = useRouter();

  // Optimistic updates для всех данных
  const [optimisticAnswers, answersActions] = useOptimisticUpdates(answers);
  const [optimisticComments, commentsActions] = useOptimisticUpdates(comments);

  // Используем useRef для сохранения начального состояния лайков
  const initialLikeState = useRef({
    likes: question.likes || 0,
    isLiked: question.isLiked || false,
  });

  // Лайки вопроса с оптимистичным обновлением
  const questionLike = useLike(initialLikeState.current);

  // Проверяем есть ли экспертные ответы (может измениться)
  const hasExpertAnswers = optimisticAnswers.some(
    (answer) =>
      (answer.author?.role === "expert" || answer.author?.role === "admin") &&
      answer.status === "approved"
  );

  // ===============================================
  // ОБРАБОТЧИКИ ДЕЙСТВИЙ С ВОПРОСОМ
  // ===============================================

  // Обработчик лайка вопроса
  const handleQuestionLike = useCallback(async () => {
    if (!permissions.canLike) return;
    try {
      await questionLike.toggleLike(() => likeQuestionAction(question._id));
    } catch (error) {
      console.error("Failed to like question:", error);
    }
  }, [permissions.canLike, question._id, questionLike.toggleLike]);

  // Обработчик share
  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/questions/${question.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: question.title,
          text: question.content?.substring(0, 160) || question.title,
          url: url,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        console.log("Link copied to clipboard");
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  }, [question.slug, question.title, question.content]);

  // Обработчик report
  const handleReport = useCallback(
    async (reportData) => {
      if (!permissions.canReport) return;

      try {
        const result = await reportQuestionAction(question._id, reportData);

        if (result.success) {
          console.log("Question reported successfully");
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Failed to report question:", error);
      }
    },
    [permissions.canReport, question._id]
  );

  // ===============================================
  // ОБРАБОТЧИКИ ДЕЙСТВИЙ С ОТВЕТАМИ
  // ===============================================

  // Обработчик отправки ответа
  const handleAnswerSubmit = useCallback(
    async (answerData) => {
      if (!permissions.canAnswer) return;

      const tempAnswer = {
        _id: `temp-${Date.now()}`,
        content: answerData.content,
        author: user,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        isBest: false,
        status: "pending",
      };

      // Оптимистичное добавление
      answersActions.add(tempAnswer);

      try {
        const result = await createAnswerAction(question._id, answerData);

        if (result.success) {
          answersActions.update(tempAnswer._id, result.data);
        } else {
          answersActions.remove(tempAnswer._id);
          throw new Error(result.error);
        }
      } catch (error) {
        answersActions.remove(tempAnswer._id);
        console.error("Failed to submit answer:", error);
        throw error;
      }
    },
    [permissions.canAnswer, user, question._id, answersActions]
  );

  // Обработчик лайка ответа
  const handleAnswerLike = useCallback(
    async (answerId) => {
      if (!permissions.canLike) return;

      const answer = optimisticAnswers.find((a) => a._id === answerId);
      if (!answer) return;

      // Оптимистичное обновление
      const newIsLiked = !answer.isLiked;
      const newLikes = answer.likes + (newIsLiked ? 1 : -1);

      answersActions.update(answerId, {
        likes: newLikes,
        isLiked: newIsLiked,
      });

      try {
        const result = await likeAnswerAction(answerId);

        if (result.success) {
          answersActions.update(answerId, {
            likes: result.data.likes,
            isLiked: result.data.isLiked,
          });
        } else {
          // Откат при ошибке
          answersActions.update(answerId, {
            likes: answer.likes,
            isLiked: answer.isLiked,
          });
          throw new Error(result.error);
        }
      } catch (error) {
        // Откат при ошибке
        answersActions.update(answerId, {
          likes: answer.likes,
          isLiked: answer.isLiked,
        });
        console.error("Failed to like answer:", error);
      }
    },
    [permissions.canLike, optimisticAnswers, answersActions]
  );

  // Обработчик принятия ответа
  const handleAcceptAnswer = useCallback(
    async (answerId) => {
      if (!permissions.canAcceptAnswer) return;

      // Оптимистичное обновление - делаем все ответы не лучшими, кроме выбранного
      const previousAnswers = [...optimisticAnswers];
      answersActions.updateMany((answers) =>
        answers.map((answer) => ({
          ...answer,
          isBest: answer._id === answerId,
        }))
      );

      try {
        const result = await acceptAnswerAction(question._id, answerId);

        if (!result.success) {
          // Откат при ошибке
          answersActions.updateMany(() => previousAnswers);
          throw new Error(result.error);
        }
      } catch (error) {
        // Откат при ошибке
        answersActions.updateMany(() => previousAnswers);
        console.error("Failed to accept answer:", error);
      }
    },
    [
      permissions.canAcceptAnswer,
      question._id,
      optimisticAnswers,
      answersActions,
    ]
  );

  // ===============================================
  // ОБРАБОТЧИКИ ДЕЙСТВИЙ С КОММЕНТАРИЯМИ
  // ===============================================

  // Обработчик отправки комментария
  const handleCommentSubmit = useCallback(
    async (commentData) => {
      if (!permissions.canComment) return;

      const tempComment = {
        _id: `temp-${Date.now()}`,
        content: commentData.content,
        author: user,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        parentComment: commentData.parentComment || null,
      };

      // Оптимистичное добавление
      commentsActions.add(tempComment);

      try {
        const result = await createCommentAction(question._id, commentData);

        if (result.success) {
          commentsActions.update(tempComment._id, result.data);
        } else {
          commentsActions.remove(tempComment._id);
          throw new Error(result.error);
        }
      } catch (error) {
        commentsActions.remove(tempComment._id);
        console.error("Failed to submit comment:", error);
        throw error;
      }
    },
    [permissions.canComment, user, question._id, commentsActions]
  );

  // Обработчик лайка комментария
  const handleCommentLike = useCallback(
    async (commentId) => {
      if (!permissions.canLike) return;

      const comment = optimisticComments.find((c) => c._id === commentId);
      if (!comment) return;

      // Оптимистичное обновление
      const newIsLiked = !comment.isLiked;
      const newLikes = comment.likes + (newIsLiked ? 1 : -1);

      commentsActions.update(commentId, {
        likes: newLikes,
        isLiked: newIsLiked,
      });

      try {
        const result = await likeCommentAction(commentId);

        if (result.success) {
          commentsActions.update(commentId, {
            likes: result.data.likes,
            isLiked: result.data.isLiked,
          });
        } else {
          // Откат при ошибке
          commentsActions.update(commentId, {
            likes: comment.likes,
            isLiked: comment.isLiked,
          });
          throw new Error(result.error);
        }
      } catch (error) {
        // Откат при ошибке
        commentsActions.update(commentId, {
          likes: comment.likes,
          isLiked: comment.isLiked,
        });
        console.error("Failed to like comment:", error);
      }
    },
    [permissions.canLike, optimisticComments, commentsActions]
  );

  // ===============================================
  // РЕНДЕР
  // ===============================================

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
            <QuestionContent
              question={question}
              user={user}
              permissions={permissions}
            />

            {/* Метаданные: категория, приоритет, лайки, действия, дата */}
            <QuestionMeta
              question={question}
              stats={{
                likes: questionLike.likes,
                views: question.views || 0,
                isLiked: questionLike.isLiked,
              }}
              user={user}
              permissions={permissions}
              onLike={handleQuestionLike}
              onShare={handleShare}
              onReport={handleReport}
              isLiking={questionLike.isLoading}
            />

            {/* Divider */}
            <div className="question-divider" />

            {/* Секция ответов */}
            <AnswersSection
              answers={optimisticAnswers}
              question={question}
              user={user}
              permissions={permissions}
              onAnswerSubmit={handleAnswerSubmit}
              onAnswerLike={handleAnswerLike}
              onAcceptAnswer={handleAcceptAnswer}
            />
          </div>
        </div>
      </section>

      {/* БЛОК 2: Комментарии (показывается только если есть экспертные ответы) */}
      {hasExpertAnswers && (
        <section className="comments-block">
          {/* <CommentsSection
            comments={optimisticComments}
            question={question}
            user={user}
            permissions={permissions}
            onCommentSubmit={handleCommentSubmit}
            onCommentLike={handleCommentLike}
          /> */}
        </section>
      )}
    </div>
  );
}
