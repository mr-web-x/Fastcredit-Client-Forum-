// Файл: app/questions/[slug]/page.js

import { notFound } from "next/navigation";
import {
  questionsService,
  answersService,
  commentsService,
} from "@/src/services/server";
import { getServerUser } from "@/src/lib/auth-server";
import QuestionDetailPage from "@/src/features/QuestionDetailPage/QuestionDetailPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const question = await questionsService.getById(slug);

    if (!question) {
      return {
        title: "Otázka nenájdená | FastCredit Forum",
        description: "Požadovaná otázka nebola nájdená.",
      };
    }

    // Первые 160 символов для description
    const description = question.content
      ? question.content.replace(/<[^>]*>/g, "").substring(0, 160) + "..."
      : "Finančná otázka na FastCredit fóre";

    return {
      title: `${question.title} | FastCredit Forum`,
      description,
      keywords: `${question.title}, finančné poradenstvo, ${question.category}, FastCredit`,
      openGraph: {
        title: question.title,
        description,
        type: "article",
        siteName: "FastCredit Forum",
        images: [
          {
            url: "/og-question.jpg", // Дефолтное изображение для вопросов
            width: 1200,
            height: 630,
            alt: question.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: question.title,
        description,
      },
      // Schema.org QAPage markup
      other: {
        "application/ld+json": JSON.stringify({
          "@context": "https://schema.org",
          "@type": "QAPage",
          mainEntity: {
            "@type": "Question",
            name: question.title,
            text: question.content,
            answerCount: question.answersCount || 0,
            author: {
              "@type": "Person",
              name:
                question.author?.firstName ||
                question.author?.username ||
                "Anonym",
            },
            dateCreated: question.createdAt,
            acceptedAnswer: question.bestAnswer
              ? {
                  "@type": "Answer",
                  text: question.bestAnswer.content,
                  author: {
                    "@type": "Person",
                    name: question.bestAnswer.author?.firstName || "Expert",
                  },
                }
              : undefined,
          },
        }),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "FastCredit Forum",
      description: "Finančné poradenstvo a odpovede od expertov",
    };
  }
}

export default async function QuestionPage({ params }) {
  const { slug } = await params; // ← ДОБАВИТЬ AWAIT ЗДЕСЬ

  try {
    // Получаем пользователя (может быть null)
    const user = await getServerUser();

    // Сначала получаем вопрос по slug
    const question = await questionsService.getById(slug);

    if (!question) {
      console.error("Question not found:", slug);
      notFound();
    }

    // Теперь получаем ответы и комментарии по ID вопроса
    const [answers, comments] = await Promise.allSettled([
      answersService.getAnswersForQuestion(question._id), // ← ПЕРЕДАЕМ ID, НЕ SLUG
      commentsService.getCommentsForQuestion(question._id), // ← ПЕРЕДАЕМ ID, НЕ SLUG
    ]);

    console.log("[REQ]", answers, comments);

    const answersData = answers.status === "fulfilled" ? answers.value : [];
    const commentsData = comments.status === "fulfilled" ? comments.value : [];

    // Проверяем есть ли экспертные ответы
    const hasExpertAnswers = answersData.some(
      (answer) =>
        (answer.author?.role === "expert" || answer.author?.role === "admin") &&
        answer.status === "approved"
    );

    // Вычисляем права доступа
    const permissions = calculatePermissions(user, question, answersData);

    return (
      <QuestionDetailPage
        question={question}
        answers={answersData}
        comments={commentsData}
        user={user}
        permissions={permissions}
        hasExpertAnswers={hasExpertAnswers}
      />
    );
  } catch (error) {
    console.error("Error loading question page:", error);
    notFound();
  }
}

// Функция вычисления прав доступа
function calculatePermissions(user, question, answers) {
  const isAuthor = user && user._id === question.author?._id;
  const isExpert = user && ["expert", "admin", "moderator"].includes(user.role);
  const isAdmin = user && ["admin", "moderator"].includes(user.role);

  return {
    canAnswer: isExpert,
    canEdit: isAuthor || isAdmin,
    canDelete: isAuthor || isAdmin,
    canLike: !!user,
    canShare: true,
    canReport: !!user,
    canAcceptAnswer: isAuthor,
    canComment:
      user &&
      (isExpert ||
        isAuthor ||
        answers.some(
          (a) =>
            (a.author?.role === "expert" || a.author?.role === "admin") &&
            a.status === "approved"
        )),
  };
}
