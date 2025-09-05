// Файл: app/questions/[slug]/page.js

import { notFound } from "next/navigation";
import {
  questionsService,
  answersService,
  commentsService,
} from "@/src/services/server";
import { getServerUser } from "@/src/lib/serverUtils";
import QuestionDetailPage from "@/src/features/QuestionDetailPage/QuestionDetailPage";

// Генерация метаданных для SEO
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
  const { slug } = await params;

  console.log("🔍 Loading question:", slug);

  // Получаем текущего пользователя
  const user = await getServerUser();
  console.log("👤 Current user:", user ? `${user.role} (${user.id})` : "Guest");

  // Загружаем основные данные
  let question = null;
  let answers = [];
  let comments = [];
  let similarQuestions = [];
  let error = null;

  try {
    // 1. Загружаем основной вопрос
    console.log("📋 Loading question data...");
    question = await questionsService.getById(slug);

    if (!question) {
      console.log("❌ Question not found");
      notFound();
    }

    console.log("✅ Question loaded:", question.title);

    // 2. Параллельно загружаем ответы и похожие вопросы
    const TIMEOUT = 15000; // 15 секунд timeout

    const answersPromise = Promise.race([
      answersService.getAnswersForQuestion(question._id || question.id),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Answers timeout")), TIMEOUT)
      ),
    ]);

    const similarPromise = Promise.race([
      questionsService.getSimilar(question._id || question.id, 5),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Similar questions timeout")),
          TIMEOUT
        )
      ),
    ]);

    const [answersResult, similarResult] = await Promise.allSettled([
      answersPromise,
      similarPromise,
    ]);

    // Обработка результатов ответов
    if (answersResult.status === "fulfilled") {
      answers = Array.isArray(answersResult.value)
        ? answersResult.value
        : answersResult.value?.items || [];
      console.log("✅ Answers loaded:", answers.length, "items");
    } else {
      console.error(
        "❌ Failed to load answers:",
        answersResult.reason?.message
      );
      answers = [];
    }

    // Обработка похожих вопросов
    if (similarResult.status === "fulfilled") {
      similarQuestions = Array.isArray(similarResult.value)
        ? similarResult.value
        : similarResult.value?.items || [];
      console.log(
        "✅ Similar questions loaded:",
        similarQuestions.length,
        "items"
      );
    } else {
      console.error(
        "❌ Failed to load similar questions:",
        similarResult.reason?.message
      );
      similarQuestions = [];
    }

    // 3. Проверяем права на комментирование
    const canUserComment = checkCommentPermissions(user, question, answers);
    const shouldLoadComments = canUserComment || answers.length > 0;

    console.log("🔐 Comment permissions:", {
      canUserComment,
      shouldLoadComments,
      userRole: user?.role,
      answersCount: answers.length,
      hasExpertAnswers: answers.some((a) => a.author?.role === "expert"),
    });

    // 4. Загружаем комментарии если нужно
    if (shouldLoadComments) {
      try {
        console.log("💬 Loading comments...");
        const commentsPromise = Promise.race([
          commentsService.getComments(question._id || question.id),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Comments timeout")), TIMEOUT)
          ),
        ]);

        const commentsData = await commentsPromise;
        comments = Array.isArray(commentsData)
          ? commentsData
          : commentsData?.items || [];
        console.log("✅ Comments loaded:", comments.length, "items");
      } catch (commentsError) {
        console.error("❌ Failed to load comments:", commentsError.message);
        comments = [];
      }
    } else {
      console.log("🚫 Comments not loaded - no permission or no answers");
    }
  } catch (err) {
    console.error("💥 Critical error loading question:", err);

    if (err.message?.includes("404") || err.status === 404) {
      notFound();
    }

    error = "Chyba pri načítaní otázky. Skúste obnoviť stránku.";
  }

  // 5. Финальная проверка данных
  if (!question) {
    console.log("❌ No question data after processing");
    notFound();
  }

  // 6. Подготавливаем данные для компонента
  const pageData = {
    question,
    answers,
    comments,
    similarQuestions,
    user,
    permissions: {
      canComment: checkCommentPermissions(user, question, answers),
      canAnswer: canUserAnswer(user),
      canEdit: canUserEdit(user, question),
      canDelete: canUserDelete(user, question),
      canAcceptAnswer: canUserAcceptAnswer(user, question),
      canModerate: canUserModerate(user),
    },
    error,
  };

  console.log("📊 Final page data:", {
    questionId: question._id || question.id,
    answersCount: answers.length,
    commentsCount: comments.length,
    similarCount: similarQuestions.length,
    permissions: pageData.permissions,
    hasError: !!error,
  });

  return <QuestionDetailPage {...pageData} />;
}

// === UTILITY FUNCTIONS ===

/**
 * Проверяет может ли пользователь комментировать вопрос
 * КЛЮЧЕВАЯ БИЗНЕС-ЛОГИКА: обычные пользователи могут комментировать только после ответа эксперта
 */
function checkCommentPermissions(user, question, answers) {
  if (!user) return false;

  // Эксперты и админы всегда могут комментировать
  if (user.role === "expert" || user.role === "admin") {
    return true;
  }

  // Автор вопроса всегда может комментировать
  if (user._id === question.author?._id || user._id === question.author) {
    return true;
  }

  // Обычные пользователи могут комментировать только после ответа эксперта
  const hasExpertAnswer = answers.some(
    (answer) => answer.author?.role === "expert" && answer.status === "approved"
  );

  return hasExpertAnswer;
}

/**
 * Проверяет может ли пользователь отвечать на вопрос
 */
function canUserAnswer(user) {
  if (!user) return false;
  return user.role === "expert" || user.role === "admin";
}

/**
 * Проверяет может ли пользователь редактировать вопрос
 */
function canUserEdit(user, question) {
  if (!user || !question) return false;

  // Автор может редактировать в течение 24 часов
  const isAuthor =
    user._id === question.author?._id || user._id === question.author;
  if (isAuthor) {
    const createdAt = new Date(question.createdAt);
    const now = new Date();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  }

  // Админы всегда могут редактировать
  return user.role === "admin";
}

/**
 * Проверяет может ли пользователь удалить вопрос
 */
function canUserDelete(user, question) {
  if (!user || !question) return false;

  // Только автор (в течение 1 часа) или админ
  const isAuthor =
    user._id === question.author?._id || user._id === question.author;
  if (isAuthor) {
    const createdAt = new Date(question.createdAt);
    const now = new Date();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
    return hoursDiff <= 1 && !question.hasAnswers;
  }

  return user.role === "admin";
}

/**
 * Проверяет может ли пользователь принимать ответы как лучшие
 */
function canUserAcceptAnswer(user, question) {
  if (!user || !question) return false;

  // Только автор вопроса или админ
  const isAuthor =
    user._id === question.author?._id || user._id === question.author;
  return isAuthor || user.role === "admin";
}

/**
 * Проверяет может ли пользователь модерировать контент
 */
function canUserModerate(user) {
  if (!user) return false;
  return user.role === "admin" || user.role === "moderator";
}
