// Файл: src/features/QuestionDetailPage/CommentsSection/CommentPermissionGate.jsx

import Link from "next/link";
import { basePath } from "@/src/constants/config";

export default function CommentPermissionGate({
  canComment,
  user,
  question,
  answers,
}) {
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
    case "not_authenticated":
      return <AuthRequiredGate />;

    case "no_expert_answers":
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
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div className="comment-permission-gate__text">
          <h4>Prihlásenie potrebné</h4>
          <p>
            Pre zapojenie sa do diskusie sa musíte prihlásiť do svojho účtu.
          </p>
        </div>
        <Link
          href={`${basePath}/login`}
          className="comment-permission-gate__action"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5z" />
          </svg>
          Prihlásiť sa
        </Link>
      </div>
    </div>
  );
}

// Компонент для блокировки до ответа эксперта
function ExpertAnswerRequiredGate({ answers }) {
  const totalAnswers = answers.length;
  const expertAnswers = answers.filter(
    (a) => a.author?.role === "expert"
  ).length;

  return (
    <div className="comment-permission-gate comment-permission-gate--expert">
      <div className="comment-permission-gate__content">
        <div className="comment-permission-gate__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
        <div className="comment-permission-gate__text">
          <h4>Komentáre budú dostupné po odpovedi experta</h4>
          <p>
            {totalAnswers > 0 ? (
              <>
                Na túto otázku je {totalAnswers}{" "}
                {totalAnswers === 1 ? "odpoveď" : "odpovedí"}, ale žiadna nie je
                od experta.{" "}
              </>
            ) : (
              <>Na túto otázku zatiaľ nikto neodpovedal. </>
            )}
            Komentáre sa odomknú hneď ako expert poskytne svoju odpoveď.
          </p>
        </div>
        <div className="comment-permission-gate__progress">
          <div className="comment-permission-gate__progress-item">
            <div className="comment-permission-gate__progress-icon comment-permission-gate__progress-icon--done">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <span>Otázka položená</span>
          </div>
          <div className="comment-permission-gate__progress-item">
            <div className="comment-permission-gate__progress-icon comment-permission-gate__progress-icon--waiting">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <span>Čaká sa na odpoveď experta</span>
          </div>
          <div className="comment-permission-gate__progress-item comment-permission-gate__progress-item--disabled">
            <div className="comment-permission-gate__progress-icon comment-permission-gate__progress-icon--disabled">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
              </svg>
            </div>
            <span>Diskusia dostupná</span>
          </div>
        </div>

        {/* Expert Call-to-Action */}
        <div className="comment-permission-gate__expert-cta">
          <p className="comment-permission-gate__expert-cta-text">
            <strong>Ste expert?</strong> Pomôžte používateľom a odpovedajte na
            ich otázky!
          </p>
          <Link
            href={`${basePath}/experts/apply`}
            className="comment-permission-gate__expert-action"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Stať sa expertom
          </Link>
        </div>
      </div>
    </div>
  );
}
