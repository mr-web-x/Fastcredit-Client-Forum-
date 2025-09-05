// Файл: src/features/QuestionDetailPage/CommentsSection/CommentsSection.jsx

"use client";

import { useState, useEffect } from "react";
import CommentsList from "./CommentsList";
import CommentForm from "./CommentForm";
import CommentPermissionGate from "./CommentPermissionGate";
import "./CommentsSection.scss";

export default function CommentsSection({
  comments = [],
  question,
  answers = [],
  user,
  permissions,
  onCommentSubmit,
}) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  // Проверяем права на комментирование
  const canComment = checkDetailedCommentPermissions(user, question, answers);
  const shouldShowComments = canComment.show;

  // Группируем комментарии (родительские и ответы)
  const parentComments = comments.filter(comment => !comment.parentComment);
  const replyComments = comments.filter(comment => comment.parentComment);

  // Ограничиваем количество показываемых комментариев
  const visibleComments = showAllComments 
    ? parentComments 
    : parentComments.slice(0, 3);

  const hasMoreComments = parentComments.length > 3;

  // Обработчик отправки комментария
  const handleCommentSubmit = async (content, parentId = null) => {
    if (!canComment.canComment) return;

    const commentData = {
      content,
      parentComment: parentId,
    };

    try {
      await onCommentSubmit(commentData);
      setReplyingTo(null); // Закрываем форму ответа
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  // Получаем ответы на конкретный комментарий
  const getRepliesForComment = (commentId) => {
    return replyComments.filter(reply => reply.parentComment === commentId);
  };

  return (
    <section className="comments-section">
      <div className="comments-section__header">
        <h3 className="comments-section__title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
          Komentáre ({comments.length})
        </h3>
      </div>

      {/* Permission Gate - показывает состояние доступности комментариев */}
      <CommentPermissionGate
        canComment={canComment}
        user={user}
        question={question}
        answers={answers}
      />

      {/* Comments Content - показываем только если доступно */}
      {shouldShowComments && (
        <div className="comments-section__content">
          {/* Comments List */}
          {parentComments.length > 0 ? (
            <div className="comments-section__list">
              <CommentsList
                comments={visibleComments}
                replyComments={replyComments}
                user={user}
                canComment={canComment.canComment}
                replyingTo={replyingTo}
                onReply={setReplyingTo}
                onCommentSubmit={handleCommentSubmit}
                getRepliesForComment={getRepliesForComment}
              />

              {/* Show More Button */}
              {hasMoreComments && !showAllComments && (
                <button
                  className="comments-section__show-more"
                  onClick={() => setShowAllComments(true)}
                >
                  Zobraziť všetkých {parentComments.length - 3} komentárov
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                  </svg>
                </button>
              )}

              {showAllComments && hasMoreComments && (
                <button
                  className="comments-section__show-less"
                  onClick={() => setShowAllComments(false)}
                >
                  Zobraziť menej komentárov
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <div className="comments-section__empty">
              <div className="comments-section__empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
                </svg>
              </div>
              <p>Zatiaľ žiadne komentáre. Buďte prvý kto komentuje!</p>
            </div>
          )}

          {/* Comment Form */}
          {canComment.canComment && (
            <div className="comments-section__form">
              <CommentForm
                user={user}
                placeholder="Napíšte komentár k tejto otázke..."
                onSubmit={(content) => handleCommentSubmit(content)}
                submitText="Pridať komentár"
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// === UTILITY FUNCTIONS ===

/**
 * Детальная проверка прав на комментирование
 * КЛЮЧЕВАЯ БИЗНЕС-ЛОГИКА
 */
function checkDetailedCommentPermissions(user, question, answers) {
  // Базовая проверка
  if (!user) {
    return {
      canComment: false,
      show: false,
      reason: 'not_authenticated',
      message: 'Pre komentovanie sa musíte prihlásiť'
    };
  }

  // Эксперты и админы всегда могут комментировать
  if (user.role === 'expert' || user.role === 'admin') {
    return {
      canComment: true,
      show: true,
      reason: 'expert_or_admin',
      message: null
    };
  }

  // Автор вопроса всегда может комментировать
  if (user._id === question.author?._id || user._id === question.author) {
    return {
      canComment: true,
      show: true,
      reason: 'question_author',
      message: null
    };
  }

  // Проверяем наличие ответов экспертов
  const expertAnswers = answers.filter(answer => 
    answer.author?.role === 'expert' && 
    answer.status === 'approved'
  );

  if (expertAnswers.length === 0) {
    // Обычные пользователи НЕ МОГУТ комментировать до ответа эксперта
    return {
      canComment: false,
      show: true, // Показываем секцию с объяснением
      reason: 'no_expert_answers',
      message: 'Komentáre budú dostupné po odpovedi experta',
      expertAnswersCount: 0
    };
  }

  // Есть ответы экспертов - обычные пользователи могут комментировать
  return {
    canComment: true,
    show: true,
    reason: 'expert_answered',
    message: null,
    expertAnswersCount: expertAnswers.length
  };
}

// ================================================================
// Файл: src/features/QuestionDetailPage/CommentsSection/CommentPermissionGate.jsx

export default function CommentPermissionGate({ canComment, user, question, answers }) {
  // Если можно комментировать - не показываем gate
  if (canComment.canComment) {
    return null;
  }

  // Если не показываем секцию вообще - не рендерим
  if (!canComment.show) {
    return null;
  }

  // Рендерим соответствующий gate в зависимости от причины
  switch (canComment.reason) {
    case 'not_authenticated':
      return <AuthRequiredGate />;
    
    case 'no_expert_answers':
      return <ExpertAnswerRequiredGate answers={answers} />;
    
    default:
      return null;
  }
}

// Компонент для неавторизованных пользователей
function AuthRequiredGate() {
  return (
    <div className="comment-permission-gate comment-permission-gate--auth">
      <div className="comment-permission-gate__content">
        <div className="comment-permission-gate__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div className="comment-permission-gate__text">
          <h4>Prihlásenie potrebné</h4>
          <p>Pre zapojenie sa do diskusie sa musíte prihlásiť do svojho účtu.</p>
        </div>
        <a href="/login" className="comment-permission-gate__action">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5z"/>
          </svg>
          Prihlásiť sa
        </a>
      </div>
    </div>
  );
}

// Компонент для блокировки до ответа эксперта  
function ExpertAnswerRequiredGate({ answers }) {
  const totalAnswers = answers.length;
  const expertAnswers = answers.filter(a => a.author?.role === 'expert').length;

  return (
    <div className="comment-permission-gate comment-permission-gate--expert">
      <div className="comment-permission-gate__content">
        <div className="comment-permission-gate__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>
        <div className="comment-permission-gate__text">
          <h4>Komentáre budú dostupné po odpovedi experta</h4>
          <p>
            {totalAnswers > 0 ? (
              <>Na túto otázku je {totalAnswers} {totalAnswers === 1 ? 'odpoveď' : 'odpovedí'}, ale žiadna nie je od experta. </>
            ) : (
              <>Na túto otázku zatiaľ nikto neodpovedal. </>
            )}
            Komentáre sa odomknú hneď ako expert poskytne svoju odpoveď.
          </p>
        </div>
        <div className="comment-permission-gate__progress">
          <div className="comment-permission-gate__progress-item">
            <div className="comment-permission-gate__progress-icon comment-permission-gate__progress-icon--done">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <span>Otázka položená</span>
          </div>
          <div className="comment-permission-gate__progress-item">
            <div className="comment-permission-gate__progress-icon comment-permission-gate__progress-icon--waiting">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
            </div>
            <span>Čaká sa na odpoveď experta</span>
          </div>
          <div className="comment-permission-gate__progress-item comment-permission-gate__progress-item--disabled">
            <div className="comment-permission-gate__progress-icon comment-permission-gate__progress-icon--disabled">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
              </svg>
            </div>
            <span>Diskusia dostupná</span>
          </div>
        </div>
      </div>
    </div>
  );
}