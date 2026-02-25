import type { LandingProps } from "~/routes/home";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";

export function Landing({ loaderData }: LandingProps) {
  return (
    <main className="flex flex-col overflow-hidden min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 px-5 md:px-8">
        <Header />
      </div>

      <div
        className="relative w-full pt-14 overflow-hidden"
        style={{ background: "#F1F1EE" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 50% 40% at 50% 30%, #F1F1EE 0%, transparent 100%),
              linear-gradient(to bottom, #94D2B9 0%, #DFEBE4 55%, #F1F1EE 80%)
            `,
          }}
        />
        <HeroSection />
      </div>
    </main>
  );
}