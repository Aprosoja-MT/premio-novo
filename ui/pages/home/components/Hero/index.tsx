import { CityIllustration } from "../CityIllustration";
import { HERO_GRADIENT } from "./useHeroController";

export function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: HERO_GRADIENT }}
    >
      <div className="relative z-10 flex items-center justify-center pt-20 pb-4">
        <img
          src="/assets/logo-premio-aprosoja.png"
          alt="Prêmio Aprosoja MT de Jornalismo 2026"
          className="w-full max-w-[680px] px-6 select-none"
          draggable={false}
        />
      </div>

      <div className="-mt-[19%]">
        <CityIllustration />
      </div>
    </section>
  );
}
