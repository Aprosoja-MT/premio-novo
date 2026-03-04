import type { LandingProps } from "~/routes/home";
import { CategoriasSection } from "./components/CategoriasSection";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { InfoSection } from "./components/InfoSection";
import { RegulamentoSection } from "./components/RegulamentoSection";

export function Landing({ loaderData }: LandingProps) {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 px-5 md:px-8">
        <Header />
      </div>

      <div
        className="relative w-full pt-14"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 30%, #F1F1EE 0%, transparent 100%),
            linear-gradient(to bottom, #94D2B9 0%, #DFEBE4 55%, #F1F1EE 80%)
          `,
        }}
      >
        <HeroSection />
      </div>
      <InfoSection />
      <div style={{ background: "#F0EDED" }}>
        <img
          src="/images/city-draw.svg"
          alt=""
          aria-hidden="true"
          className="relative w-full pointer-events-none"
          style={{ marginTop: "clamp(-154px, -8vw, -40px)", marginBottom: "-13vw", zIndex: 5 }}
        />
      </div>
      <RegulamentoSection />
      <CategoriasSection />
    </main>
  );
}