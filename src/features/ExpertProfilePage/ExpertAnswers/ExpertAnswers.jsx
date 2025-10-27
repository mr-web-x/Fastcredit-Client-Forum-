// Файл: src/features/ExpertProfilePage/ExpertAnswers/ExpertAnswers.jsx

"use client";

import LatestQuestionCard from "@/src/components/LatestQuestionCard/LatestQuestionCard";
import "./ExpertAnswers.scss";

// Icons
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

export default function ExpertAnswers({ answers = [], expertName = "" }) {
    return (
        <section className="expert-answers">
            <div className="expert-answers__container">
                <div className="expert-answers__header">
                    <h2 className="expert-answers__title">
                        Otázky ({answers.length})
                    </h2>
                    <p className="expert-answers__subtitle">
                        Všetky otázky, na ktoré {expertName} odpovedal
                    </p>
                </div>

                {answers.length === 0 ? (
                    <div className="expert-answers__empty">
                        <QuestionAnswerIcon
                            className="expert-answers__empty-icon"
                            sx={{ fontSize: 64 }}
                        />
                        <h3 className="expert-answers__empty-title">
                            Zatiaľ žiadne otázky
                        </h3>
                        <p className="expert-answers__empty-text">
                            {expertName} zatiaľ neodpovedal na žiadne otázky.
                        </p>
                    </div>
                ) : (
                    <div className="expert-answers__list">
                        {answers.map((question) => (
                            <LatestQuestionCard
                                key={question._id || question.id}
                                question={question}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}



