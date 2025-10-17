// Файл: src/components/AnswerPreviewModal/AnswerPreviewModal.jsx

"use client";

import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import "./AnswerPreviewModal.scss";

export default function AnswerPreviewModal({ open, onClose, content }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                className: "answer-preview-modal"
            }}
        >
            <DialogTitle className="answer-preview-modal__title">
                Ukážka odpovede
                <IconButton
                    onClick={onClose}
                    className="answer-preview-modal__close-btn"
                    aria-label="Zavrieť"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className="answer-preview-modal__content">
                <div className="answer-preview-modal__text">
                    {content ? (
                        content.split("\n").map((paragraph, index) =>
                            paragraph.trim() ? (
                                <p key={index}>{paragraph}</p>
                            ) : (
                                <br key={index} />
                            )
                        )
                    ) : (
                        <p className="answer-preview-modal__text--empty">
                            Žiadny obsah na zobrazenie
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}