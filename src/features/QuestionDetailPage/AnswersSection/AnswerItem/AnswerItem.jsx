// Файл: src/features/QuestionDetailPage/AnswersSection/AnswerItem/AnswerItem.jsx

"use client";

import { useState } from "react";
import { useActionState } from "react";
import "./AnswerItem.scss";
import { formatDate } from "@/src/utils/formatDate";
import {
  getUserInitials,
  getDisplayName,
  getRoleBadge,
} from "@/src/utils/user";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Error as ErrorIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  updateApprovedAnswerAction,
  deleteAnswerAction,
  updateAnswerAction,
} from "@/app/actions/answers";

export default function AnswerItem({ answer, user, permissions }) {
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [isRejectConfirm, setIsRejectConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(answer.content);

  const roleInfo = getRoleBadge(answer.expert?.role);
  const displayName = getDisplayName(answer.expert);
  const userInitials = getUserInitials(answer.expert);

  // Константы для проверки прав
  const isAdmin = permissions.canModerate;
  const isAnswerAuthor = user && user.id === answer.expert?._id;
  const isApproved = answer.isApproved;
  const canEdit = isAdmin || isAnswerAuthor;

  // Action для модерации
  const [moderateState, moderateAction, isModeratePending] = useActionState(
    async (prevState, formData) => {
      const isApproved = formData.get("isApproved") === "true";
      const result = await updateApprovedAnswerAction(
        answer._id,
        isApproved,
        isApproved ? "Approved by admin" : "Rejected by admin"
      );
      if (result.success) setIsRejectConfirm(false);
      return result;
    },
    { success: false, message: null, error: null }
  );

  // Action для удаления
  const [deleteState, deleteAction, isDeletePending] = useActionState(
    async (prevState, formData) => {
      const result = await deleteAnswerAction(answer._id);
      if (result.success) setIsDeleteConfirm(false);
      return result;
    },
    { success: false, message: null, error: null }
  );

  // Action для редактирования
  const [editState, editAction, isEditPending] = useActionState(
    async (prevState, formData) => {
      const result = await updateAnswerAction(answer._id, {
        content: formData.get("content"),
      });
      if (result.success) {
        setIsEditing(false);
        setEditContent(answer.content); // Обновляем локальный state
      }
      return result;
    },
    { success: false, message: null, error: null }
  );

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent(answer.content); // Возвращаем оригинальный текст
  };

  return (
    <div className={`answer-item ${!isApproved ? "answer-item--pending" : ""}`}>
      {/* Заголовок ответа */}
      <header className="answer-item__header">
        {/* Информация об авторе */}
        <div className="answer-item__author">
          <div className="answer-item__avatar">
            {answer.expert?.avatar ? (
              <img
                src={answer.expert.avatar}
                alt={displayName}
                className="answer-item__avatar-image"
              />
            ) : (
              <div className="answer-item__avatar-initials">{userInitials}</div>
            )}
          </div>

          <div className="answer-item__author-info">
            <div className="answer-item__author-name-section">
              <span className="answer-item__author-name">{displayName}</span>
              {roleInfo && (
                <span
                  className={`answer-item__role answer-item__role--${roleInfo.class}`}
                >
                  {roleInfo.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Бейджи статуса */}
        <div className="answer-item__header-actions">
          {!isApproved && (
            <span className="answer-item__status answer-item__status--pending">
              🔸 Na moderácii
            </span>
          )}
        </div>
      </header>

      {/* Контент ответа */}
      <div className="answer-item__content">
        {isEditing ? (
          // Режим редактирования
          <form action={editAction} className="answer-item__edit-form">
            <textarea
              name="content"
              className="answer-item__edit-textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={6}
              disabled={isEditPending}
              placeholder="Upravte svoju odpoveď..."
            />
            <div className="answer-item__character-count">
              {editContent.length}/5000
              {editContent.length < 50 && (
                <span className="answer-item__character-help">
                  Potrebných ešte {50 - editContent.length} znakov
                </span>
              )}
            </div>
          </form>
        ) : (
          // Обычный режим
          <div className="answer-item__text">
            {answer.content ? (
              answer.content
                .split("\n")
                .map((paragraph, index) =>
                  paragraph.trim() ? (
                    <p key={index}>{paragraph}</p>
                  ) : (
                    <br key={index} />
                  )
                )
            ) : (
              <p className="answer-item__text--empty">
                Obsah odpovede nebol zadaný.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Футер с датой и действиями */}
      <footer className="answer-item__footer">
        <div className="answer-item__footer-content">
          {/* Левая часть - дата */}
          <div className="answer-item__date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
            </svg>
            {formatDate(answer.createdAt)}
          </div>

          {/* Правая часть - действия */}
          <div className="answer-item__actions">
            {isEditing ? (
              // Кнопки редактирования
              <div className="answer-item__edit-actions">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="answer-item__btn answer-item__btn--secondary"
                  disabled={isEditPending}
                >
                  <CloseIcon fontSize="small" />
                  Zrušiť
                </button>
                <button
                  type="submit"
                  form="edit-form"
                  onClick={(e) => {
                    e.preventDefault();
                    const formData = new FormData();
                    formData.set("content", editContent);
                    editAction(formData);
                  }}
                  className="answer-item__btn answer-item__btn--success"
                  disabled={
                    isEditPending ||
                    editContent.length < 50 ||
                    editContent.length > 5000
                  }
                >
                  <SaveIcon fontSize="small" />
                  {isEditPending ? "Ukladá sa..." : "Uložiť"}
                </button>
              </div>
            ) : (
              // Обычные действия
              <>
                {/* Действия АДМИНА */}
                {isAdmin && (
                  <div className="answer-item__admin-actions">
                    {!isApproved ? (
                      <form action={moderateAction}>
                        <input type="hidden" name="isApproved" value="true" />
                        <button
                          type="submit"
                          disabled={isModeratePending}
                          className="answer-item__btn answer-item__btn--success"
                          title="Schváliť odpoveď"
                        >
                          <CheckCircleIcon fontSize="small" />
                          {isModeratePending ? "..." : "Schváliť"}
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => setIsRejectConfirm(true)}
                        className="answer-item__btn answer-item__btn--warning"
                        title="Zamietnuť odpoveď"
                      >
                        <CancelIcon fontSize="small" />
                        Zamietnuť
                      </button>
                    )}

                    {canEdit && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="answer-item__btn"
                      >
                        <EditIcon fontSize="small" />
                        Upraviť
                      </button>
                    )}

                    <button
                      onClick={() => setIsDeleteConfirm(true)}
                      className="answer-item__btn answer-item__btn--danger"
                      title="Zmazať odpoveď"
                    >
                      <DeleteIcon fontSize="small" />
                      Zmazať
                    </button>
                  </div>
                )}

                {/* Действия АВТОРА ОТВЕТА (если не админ) */}
                {!isAdmin && isAnswerAuthor && (
                  <div className="answer-item__answer-author-actions">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="answer-item__btn"
                    >
                      <EditIcon fontSize="small" />
                      Upraviť
                    </button>

                    {!answer.wasApproved && (
                      <button
                        onClick={() => setIsDeleteConfirm(true)}
                        className="answer-item__btn answer-item__btn--danger"
                      >
                        <DeleteIcon fontSize="small" />
                        Zmazať
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Диалоги подтверждения */}
        {isRejectConfirm && (
          <div className="answer-item__confirm-dialog">
            <span>Naozaj zamietnuť odpoveď?</span>
            <form action={moderateAction}>
              <input type="hidden" name="isApproved" value="false" />
              <button
                type="submit"
                disabled={isModeratePending}
                className="answer-item__confirm-btn"
              >
                {isModeratePending ? "..." : "Áno"}
              </button>
            </form>
            <button
              onClick={() => setIsRejectConfirm(false)}
              className="answer-item__confirm-btn"
            >
              Zrušiť
            </button>
          </div>
        )}

        {isDeleteConfirm && (
          <div className="answer-item__confirm-dialog">
            <span>Naozaj zmazať odpoveď?</span>
            <form action={deleteAction}>
              <button
                type="submit"
                disabled={isDeletePending}
                className="answer-item__confirm-btn"
              >
                {isDeletePending ? "..." : "Áno"}
              </button>
            </form>
            <button
              onClick={() => setIsDeleteConfirm(false)}
              className="answer-item__confirm-btn"
            >
              Zrušiť
            </button>
          </div>
        )}

        {/* Сообщения об ошибках */}
        {moderateState.error && (
          <div className="answer-item__error">
            <ErrorIcon fontSize="small" />
            {moderateState.error}
          </div>
        )}
        {deleteState.error && (
          <div className="answer-item__error">
            <ErrorIcon fontSize="small" />
            {deleteState.error}
          </div>
        )}
        {editState.error && (
          <div className="answer-item__error">
            <ErrorIcon fontSize="small" />
            {editState.error}
          </div>
        )}
      </footer>
    </div>
  );
}
