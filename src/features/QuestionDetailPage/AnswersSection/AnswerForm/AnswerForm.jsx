"use client";
import { createAnswerAction } from "@/app/actions/answers";
import { useActionState, useState } from "react";
import { Visibility } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { toast } from "sonner";
import "./AnswerForm.scss";
import AnswerPreviewModal from "../AnswerPreviewModal/AnswerPreviewModal";

export default function AnswerForm({ question, onCancel }) {
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [formState, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await createAnswerAction(question._id, {
        content: formData.get("content"),
      });

      if (result.success) {
        toast.success(result.message); // зелений
        setContent("");
        onCancel();
      }

      return result;
    },
    { success: false, message: null, error: null, data: null }
  );

  const characterCount = content.length;
  const isValid = characterCount >= 50 && characterCount <= 5000;

  return (
    <div className="answer-form">
      <div className="answer-form__header">
        <h3>Vaša odpoveď</h3>
      </div>

      <form action={formAction} className="answer-form__form">
        <div className="answer-form__input-container">
          <textarea
            name="content"
            className={`answer-form__textarea ${formState.error ? "answer-form__textarea--error" : ""}`}
            value={content}
            onInput={(e) => setContent(e.target.value)} // ЗАМІНИТИ onChange на onInput
            placeholder="Napíšte svoju podrobnú odpoveď... (minimálne 50 znakov)"
            rows={18}
            disabled={isPending}
          />
          <div className={`answer-form__character-count ${!isValid ? "answer-form__character-count--invalid" : ""}`}>
            {characterCount}/5000
            {characterCount < 50 && (
              <span className="answer-form__character-help">
                Potrebných ešte {50 - characterCount} znakov
              </span>
            )}
          </div>
        </div>

        {formState.error && (
          <div className="answer-form__error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {formState.error}
          </div>
        )}

        <div className="answer-form__footer">
          <div className="answer-form__left-actions">
            <IconButton
              onClick={() => setShowPreview(true)}
              disabled={!content.trim() || isPending}
              className="answer-form__preview-btn"
              title="Ukážka odpovede"
            >
              <Visibility />
            </IconButton>
          </div>

          <div className="answer-form__right-actions">
            <button
              type="button"
              onClick={onCancel}
              className="answer-form__cancel-btn"
              disabled={isPending}
            >
              Zrušiť
            </button>

            <button
              type="submit"
              className="answer-form__submit-btn"
              disabled={!content.trim() || !isValid || isPending}
            >
              {isPending ? "Odosiela sa..." : "Odoslať odpoveď"}
            </button>
          </div>
        </div>
      </form>

      <AnswerPreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        content={content}
      />
    </div>
  );
}