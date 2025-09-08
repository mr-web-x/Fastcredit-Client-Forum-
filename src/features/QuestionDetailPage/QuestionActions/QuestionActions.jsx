// Файл: src/features/QuestionDetailPage/QuestionActions/QuestionActions.jsx

"use client";

import { useState, useEffect } from "react";
import { basePath } from "@/src/constants/config";
import "./QuestionActions.scss";

export default function QuestionActions({
  question,
  stats,
  user,
  permissions,
  onLike,
  isMobile = false,
}) {
  const [isLiking, setIsLiking] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Обработчик лайка с защитой от спама
  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    try {
      await onLike();
    } finally {
      setIsLiking(false);
    }
  };

  // Обработчик поделиться
  const handleShare = () => {
    setShowShareModal(true);
  };

  // Копирование ссылки
  const handleCopyLink = async () => {
    const url = `${window.location.origin}${basePath}/questions/${
      question.slug || question._id
    }`;

    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      // Fallback для старых браузеров
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Поделиться в соцсетях
  const handleSocialShare = (platform) => {
    const url = `${window.location.origin}${basePath}/questions/${
      question.slug || question._id
    }`;
    const title = question.title;

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          title + " " + url
        )}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    setShowShareModal(false);
  };

  // Обработчик жалобы
  const handleReport = () => {
    setShowReportModal(true);
  };

  // Отправка жалобы
  const handleSubmitReport = async (reason) => {
    try {
      // Здесь будет API вызов для отправки жалобы
      // await reportsService.reportQuestion(question._id, { reason });

      console.log("Report submitted:", reason);
      setShowReportModal(false);

      // Показать уведомление об успехе
      // toast.success("Vaša sťažnosť bola odoslaná");
    } catch (error) {
      console.error("Failed to submit report:", error);
      // toast.error("Chyba pri odosielaní sťažnosti");
    }
  };

  // Закрытие модалов по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowShareModal(false);
        setShowReportModal(false);
      }
    };

    if (showShareModal || showReportModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showShareModal, showReportModal]);

  const containerClass = isMobile
    ? "question-actions question-actions--mobile"
    : "question-actions question-actions--desktop";

  return (
    <>
      <div className={containerClass}>
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={!user || isLiking}
          className={`question-actions__button question-actions__like ${
            stats.isLiked ? "question-actions__like--active" : ""
          } ${isLiking ? "question-actions__like--loading" : ""}`}
          title={
            user
              ? stats.isLiked
                ? "Zrušiť páči sa mi"
                : "Páči sa mi"
              : "Prihláste sa pre lajkovanie"
          }
        >
          <div className="question-actions__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="question-actions__text">
            {isMobile ? stats.likes : `Páči sa (${stats.likes})`}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="question-actions__button question-actions__share"
          title="Zdieľať otázku"
        >
          <div className="question-actions__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
            </svg>
          </div>
          <span className="question-actions__text">
            {isMobile ? "Zdieľať" : "Zdieľať"}
          </span>
        </button>

        {/* Report Button */}
        <button
          onClick={handleReport}
          className="question-actions__button question-actions__report"
          title="Nahlásiť nevhodný obsah"
        >
          <div className="question-actions__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
            </svg>
          </div>
          {!isMobile && (
            <span className="question-actions__text">Nahlásiť</span>
          )}
        </button>

        {/* Edit Button (for author/admin) */}
        {permissions.canEdit && (
          <button
            onClick={() => {
              // Здесь будет логика редактирования
              console.log("Edit question");
            }}
            className="question-actions__button question-actions__edit"
            title="Upraviť otázku"
          >
            <div className="question-actions__icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </div>
            {!isMobile && (
              <span className="question-actions__text">Upraviť</span>
            )}
          </button>
        )}

        {/* Delete Button (for author/admin) */}
        {permissions.canDelete && (
          <button
            onClick={() => {
              // Здесь будет логика удаления с подтверждением
              if (confirm("Naozaj chcete vymazať túto otázku?")) {
                console.log("Delete question");
              }
            }}
            className="question-actions__button question-actions__delete"
            title="Vymazať otázku"
          >
            <div className="question-actions__icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </div>
            {!isMobile && (
              <span className="question-actions__text">Vymazať</span>
            )}
          </button>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="question-actions__modal-overlay"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="question-actions__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="question-actions__modal-header">
              <h3>Zdieľať otázku</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="question-actions__modal-close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div className="question-actions__modal-content">
              {/* Copy Link */}
              <div className="question-actions__share-section">
                <label>Odkaz na otázku:</label>
                <div className="question-actions__copy-container">
                  <input
                    type="text"
                    value={
                      typeof window !== "undefined"
                        ? `${window.location.origin}${basePath}/questions/${
                            question.slug || question._id
                          }`
                        : ""
                    }
                    readOnly
                    className="question-actions__copy-input"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`question-actions__copy-button ${
                      copySuccess
                        ? "question-actions__copy-button--success"
                        : ""
                    }`}
                  >
                    {copySuccess ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                      </svg>
                    )}
                    {copySuccess ? "Skopírované!" : "Kopírovať"}
                  </button>
                </div>
              </div>

              {/* Social Share */}
              <div className="question-actions__share-section">
                <label>Zdieľať na sociálnych sieťach:</label>
                <div className="question-actions__social-buttons">
                  <button
                    onClick={() => handleSocialShare("facebook")}
                    className="question-actions__social-button question-actions__social-button--facebook"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>

                  <button
                    onClick={() => handleSocialShare("twitter")}
                    className="question-actions__social-button question-actions__social-button--twitter"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Twitter
                  </button>

                  <button
                    onClick={() => handleSocialShare("linkedin")}
                    className="question-actions__social-button question-actions__social-button--linkedin"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </button>

                  <button
                    onClick={() => handleSocialShare("whatsapp")}
                    className="question-actions__social-button question-actions__social-button--whatsapp"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div
          className="question-actions__modal-overlay"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="question-actions__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="question-actions__modal-header">
              <h3>Nahlásiť otázku</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="question-actions__modal-close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div className="question-actions__modal-content">
              <p>Prečo nahlasujete túto otázku?</p>

              <div className="question-actions__report-reasons">
                {[
                  { value: "spam", label: "Spam alebo reklama" },
                  { value: "inappropriate", label: "Nevhodný obsah" },
                  { value: "offensive", label: "Urážlivé výrazy" },
                  { value: "duplicate", label: "Duplicitná otázka" },
                  { value: "wrong_category", label: "Nesprávna kategória" },
                  { value: "other", label: "Iný dôvod" },
                ].map((reason) => (
                  <button
                    key={reason.value}
                    onClick={() => handleSubmitReport(reason.value)}
                    className="question-actions__report-reason"
                  >
                    {reason.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
