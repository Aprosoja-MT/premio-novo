import { ChevronDown } from "lucide-react";
import { colors } from "~/lib/colors";
import mic from "./images/mic.png";

export function RegulamentoSection() {
  return (
    <section className="relative w-full">
      <img
        src="/images/fundo-verde-curva.svg"
        aria-hidden="true"
        alt=""
        className="w-full pointer-events-none"
        style={{ display: "block" }}
      />
      <div className="absolute inset-0 z-10 w-full px-[8%] pb-16 flex flex-row items-center justify-center gap-[4vw]">
        <div className="flex flex-col gap-[2vw] max-w-[38vw]">
          <h2
            className="font-heading leading-tight text-white"
            style={{ fontSize: "clamp(18px, 3vw, 64px)" }}
          >
            O QUE É O PRÊMIO{" "}
            <span style={{ color: colors.light.primary }}>APROSOJA MT</span>{" "}
            DE JORNALISMO
          </h2>

          <p
            className="font-sans leading-relaxed text-white"
            style={{ fontSize: "clamp(10px, 1.1vw, 16px)" }}
          >
            O Prêmio Aprosoja MT de Jornalismo 2026 consiste em concurso
            cultural, de caráter técnico-jornalístico, cujo tema é: "O Impacto
            do Agro Sustentável na Vida Urbana". Essa é uma iniciativa da
            Associação dos Produtores de Soja e Milho de Mato Grosso como
            estratégia para promover a difusão dos produtos e métodos produtivos
            da cadeia da soja e milho perante a sociedade em geral, inclusive em
            relação às práticas de sustentabilidade ambiental e a relevância
            econômica dessa cadeia produtiva, por intermédio da valorização do
            trabalho da imprensa mato-grossense na cobertura e acompanhamento
            desse segmento econômico e produtivo no Estado de Mato Grosso.
          </p>

          <a
            href="#"
            className="font-heading inline-flex items-center gap-2 self-start border-2 rounded-full transition-colors hover:bg-white/10 text-white whitespace-nowrap"
            style={{ borderColor: "#94D2B9", fontSize: "clamp(9px, 1vw, 14px)", padding: "clamp(6px, 0.6vw, 12px) clamp(10px, 1.2vw, 20px)" }}
          >
            BAIXE O REGULAMENTO
            <ChevronDown size={18} />
          </a>
        </div>

        <div className="shrink-0 flex items-center justify-end">
          <img
            src={mic}
            alt="Microfone Aprosoja"
            style={{ width: "clamp(120px, 32vw, 736px)", height: "auto" }}
          />
        </div>
      </div>

    </section>
  );
}
