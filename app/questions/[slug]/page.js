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

    // Определяем нужно ли включать неподтвержденные ответы
    const includeUnapproved = shouldIncludeUnapproved(user, question);

    // Теперь получаем ответы и комментарии по ID вопроса
    const answers = await answersService.getAnswersForQuestion(
      question._id,
      includeUnapproved
    );

    // Вычисляем права доступа
    const permissions = calculatePermissions(user, question, answers);

    if (!permissions.canView) {
      console.error("Dont have permission");
      notFound();
    }

    return (
      <QuestionDetailPage
        question={question}
        answers={answers}
        user={user}
        permissions={permissions}
      />
    );
  } catch (error) {
    console.error("Error loading question page:", error);
    notFound();
  }
}

/**
 * Определяет должен ли пользователь видеть неподтвержденные ответы
 */
function shouldIncludeUnapproved(user, question) {
  if (!user) {
    // Гость - только подтвержденные
    return false;
  }

  // Админ всегда видит ВСЕ ответы
  if (user.role === "admin") {
    return true;
  }

  // Эксперт видит все подтвержденные + свои неподтвержденные
  if (user.role === "expert" || user.role === "lawyer") {
    return true; // Backend фильтрует: approved + own pending
  }

  // Обычный пользователь видит только подтвержденные
  return false;
}

// Функция вычисления прав доступа
function calculatePermissions(user, question, answers) {
  const isAuthor = user && user.id === question.author?._id;
  const isExpert = user && ["expert", "admin"].includes(user.role);
  const isAdmin = user && ["admin"].includes(user.role);
  const hasExpertAnswers = answers.some(
    (answer) =>
      (answer.expert?.role === "expert" || answer.expert?.role === "admin") &&
      answer.isApproved
  );

  return {
    canView: isAdmin || isExpert || isAuthor || hasExpertAnswers,
    canAnswer: isExpert,
    canEdit: isAuthor || isAdmin,
    canDelete: isAuthor || isAdmin,
    canLike: !!user,
    canShare: true,
    canReport: !!user,
    canAcceptAnswer: isAuthor,
    canModerate: user && user.role === "admin",
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
