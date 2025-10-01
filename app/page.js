import Script from "next/script";
import HomePage from "@/src/features/HomePage/HomePage";
import { questionsService } from "@/src/services/server";
import {
  getForumHomepageStructuredData,
  getForumFAQStructuredData,
} from "@/src/lib/seo/structured-data";

export const metadata = {
  title:
    "FastCredit Forum - Bezplatné finančné poradenstvo od expertov na Slovensku",
  description:
    "ZDARMA finančné poradenstvo od certifikovaných expertov! ✅ Spýtajte sa na pôžičky, banky, poistenie, investície ✅ Odpovede do 24 hodín ✅ 1000+ spokojných používateľov ✅ Slovensko",

  alternates: {
    canonical: "https://fastcredit.sk/forum/",
  },
};

export default async function Home() {
  let questions = [];

  try {
    const result = await questionsService.getLatest({
      limit: 15,
      status: "answered",
    });
    questions = result.items || [];
  } catch (error) {
    console.error("Failed to load latest questions:", error);
  }

  return (
    <>
      <Script
        id="forum-homepage-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getForumHomepageStructuredData(questions)),
        }}
      />
      {/* <Script
        id="forum-faq-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getForumFAQStructuredData()),
        }}
      /> */}
      <HomePage questions={questions} />
    </>
  );
}
