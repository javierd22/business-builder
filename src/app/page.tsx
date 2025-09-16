import HomePageClient from "./_components/HomePageClient";
import OnboardingPrompt from "./_components/OnboardingPrompt";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <HomePageClient />
      <OnboardingPrompt className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8" />
    </>
  );
}