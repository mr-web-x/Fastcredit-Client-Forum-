"use client"

import Link from "next/link";
import "./SimilarQuestions.scss";
import LatestQuestionCard from "@/src/components/LatestQuestionCard/LatestQuestionCard";

export default function SimilarQuestions({ similarQuestions = [] }) {
    // Если нет похожих вопросов
    if (similarQuestions.length === 0) {
        return (
            <div className="similar-questions">
                <div className="similar-questions__empty">
                    <p>Zatiaľ nie sú k dispozícii žiadne otázky. Zobraziť <Link href="/forum/questions">všetky otázky</Link></p>
                </div>
            </div>
        );
    }

    // Если только один похожий вопрос
    if (similarQuestions.length === 1) {
        return (
            <div className="similar-questions">
                <h3 className="similar-questions__title">Posledné otázky na fóre</h3>
                <div className="similar-questions__list">
                    <LatestQuestionCard question={similarQuestions[0]} />
                </div>
                <div className="similar-questions__footer">
                    <Link href="/forum/questions" className="btn btn--secondary">
                        Zobraziť všetky otázky
                    </Link>
                </div>
            </div>
        );
    }

    // Если два или больше похожих вопросов
    return (
        <div className="similar-questions">
            <h3 className="similar-questions__title">Posledné otázky na fóre</h3>
            <div className="similar-questions__list">
                {similarQuestions.map((question) => (
                    <LatestQuestionCard key={question._id} question={question} />
                ))}
            </div>
        </div>
    );
}