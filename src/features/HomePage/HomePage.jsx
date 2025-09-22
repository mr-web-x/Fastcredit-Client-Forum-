import Hero from "./Hero/Hero";
import QuickNavigation from "./QuickNavigation/QuickNavigation";
import LatestQuestions from "./LatestQuestions/LatestQuestions";
import FAQ from "./FAQ/FAQ";

export default function HomePage({ questions }) {
  return (
    <>
      <Hero />
      <QuickNavigation />
      <LatestQuestions questions={questions} />
      <FAQ />
    </>
  );
}
