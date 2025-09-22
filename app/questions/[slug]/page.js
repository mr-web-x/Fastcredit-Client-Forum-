// Файл: app/questions/[slug]/page.js

import { notFound } from "next/navigation";
import { questionsService, answersService } from "@/src/services/server";
import { getServerUser } from "@/src/lib/auth-server";
import QuestionDetailPage from "@/src/features/QuestionDetailPage/QuestionDetailPage";
import { getQuestionDetailStructuredData } from "@/src/lib/seo/structured-data";
import Script from "next/script";

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

      // Максимальный OpenGraph
      openGraph: {
        type: "website",
        locale: "sk_SK",
        url: `https://fastcredit.sk/forum/questions/${question.slug}`,
        siteName: "FastCredit Forum - Finančné poradenstvo na Slovensku",
        title: `${question.title} | FastCredit Forum`,
        description: description,
        images: [
          {
            url: "https://fastcredit.sk/forum/og.jpg",
            width: 1200,
            height: 630,
            alt: "FastCredit Forum - Finančné poradenstvo na Slovensku",
            type: "image/jpeg",
          },
          {
            url: "https://fastcredit.sk/forum/og-square.jpg",
            width: 1200,
            height: 1200,
            alt: "FastCredit Forum",
            type: "image/jpeg",
          },
          {
            url: "https://fastcredit.sk/forum/og-vertical.jpg",
            width: 600,
            height: 900,
            alt: "FastCredit Forum - Mobilná verzia",
            type: "image/jpeg",
          },
        ],
        determiner: "the",
        ttl: 604800,
        emails: ["admin@fastcredit.sk"],
        faxNumbers: [],
        streetAddress: "Bratislava, Slovenská republika",
        locality: "Bratislava",
        region: "Bratislavský kraj",
        postalCode: "831 52",
        countryName: "Slovakia",
      },

      // Максимальные Twitter Cards
      twitter: {
        card: "summary_large_image",
        site: "@Fastcreditsk",
        creator: "@Fastcreditsk",
        title: `${question.title} | FastCredit Forum`,
        description: description,
        images: {
          url: "https://fastcredit.sk/forum/og.jpg",
          alt: "FastCredit Forum - Finančné poradenstvo",
          width: 1200,
          height: 630,
        },
      },

      alternates: {
        canonical: `https://fastcredit.sk/forum/questions/${question.slug}`,
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
    let answers = await answersService.getAnswersForQuestion(
      question._id,
      includeUnapproved
    );

    // Фильтруем ТОЛЬКО для экспертов (не для админов и остальных)
    if (
      user &&
      (user.role === "expert" || user.role === "lawyer") &&
      includeUnapproved
    ) {
      answers = answers.filter(
        (answer) =>
          answer.expert?._id === user.id || // Все свои ответы (любой статус)
          answer.isApproved === true // Чужие только одобренные
      );
    }

    // Вычисляем права доступа
    const permissions = calculatePermissions(user, question, answers);

    if (!permissions.canView) {
      console.error("Dont have permission");
      notFound();
    }

    return (
      <>
        <Script
          id="forum-question-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              getQuestionDetailStructuredData(question, answers)
            ),
          }}
        />
        <QuestionDetailPage
          question={question}
          answers={answers}
          user={user}
          permissions={permissions}
        />
      </>
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
    canComment: user && (isExpert || isAuthor || hasExpertAnswers),
  };
}
