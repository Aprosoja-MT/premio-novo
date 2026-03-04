import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import drawFotografa from "./images/draw-fotografa.svg";
import premiacaoVideo from "./images/premiacao-categoria-video.png";

const categorias = [
  {
    id: "video",
    label: "Reportagem em Vídeo",
    draw: drawFotografa,
    premiacao: premiacaoVideo,
  },
  {
    id: "foto",
    label: "Reportagem em Foto",
    draw: drawFotografa,
    premiacao: premiacaoVideo,
  },
  {
    id: "texto",
    label: "Reportagem em Texto",
    draw: drawFotografa,
    premiacao: premiacaoVideo,
  },
  {
    id: "radio",
    label: "Reportagem em Rádio",
    draw: drawFotografa,
    premiacao: premiacaoVideo,
  },
  {
    id: "tv",
    label: "Reportagem em TV",
    draw: drawFotografa,
    premiacao: premiacaoVideo,
  },
];

export function CategoriasSection() {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function goTo(index: number) {
    const next = Math.max(0, Math.min(index, categorias.length - 1));
    setCurrent(next);
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[next] as HTMLElement;
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  return (
    <section
      className="relative w-full"
      style={{ marginTop: "clamp(-196px, -20vw, -88px)" }}
    >
      <img
        src="/images/fundo-branco-curva.svg"
        aria-hidden="true"
        alt=""
        className="w-full pointer-events-none"
        style={{ display: "block" }}
      />

      <div
        className="absolute inset-0 z-10 w-full px-[8%] flex flex-row items-center justify-center gap-[6vw]"
        style={{ paddingTop: "12%" }}
      >
        {/* Lado esquerdo — título + ilustração */}
        <div className="flex flex-col justify-center shrink-0" style={{ width: "clamp(180px, 28vw, 420px)" }}>
          <h2
            className="font-heading-now"
            style={{
              color: "#024240",
              fontSize: "clamp(22px, 3.33vw, 64px)",
              lineHeight: "clamp(24px, 3.49vw, 67px)",
            }}
          >
            CONFIRA AS<br />
            PREMIAÇÕES<br />
            POR CATEGORIA
          </h2>
          <img
            src={drawFotografa}
            alt="Ilustração jornalista"
            style={{ width: "clamp(180px, 28vw, 420px)", height: "auto", marginTop: "1vw" }}
          />
        </div>

        {/* Lado direito — carrossel */}
        <div className="flex flex-col flex-1 min-w-0 gap-[1.5vw] pb-[3vw]">
          {/* Pill da categoria */}
          <div className="flex justify-center">
            <span
              className="font-heading-now text-center whitespace-nowrap"
              style={{
                background: "#94D2B9",
                color: "#024240",
                fontSize: "clamp(14px, 2.08vw, 40px)",
                lineHeight: "clamp(18px, 3.49vw, 67px)",
                borderRadius: "clamp(24px, 4.27vw, 82px)",
                padding: "0 clamp(14px, 1.8vw, 32px)",
                height: "clamp(28px, 3.125vw, 60px)",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {categorias[current].label.toUpperCase()}
            </span>
          </div>

          {/* Track (scroll-snap) */}
          <div
            ref={trackRef}
            className="flex overflow-x-hidden"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {categorias.map((cat) => (
              <div
                key={cat.id}
                className="shrink-0 w-full flex items-center justify-center"
                style={{ scrollSnapAlign: "start" }}
              >
                <img
                  src={cat.premiacao}
                  alt={`Premiação ${cat.label}`}
                  style={{ width: "clamp(240px, 46vw, 760px)", height: "auto" }}
                />
              </div>
            ))}
          </div>

          {/* Controles */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-[1vw]">
              <button
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
                aria-label="Anterior"
                className="text-[#024240] disabled:opacity-30 transition-opacity"
              >
                <ChevronLeft size={20} />
              </button>

              {categorias.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Ir para ${categorias[i].label}`}
                  className="rounded-full transition-all"
                  style={{
                    width: i === current ? "clamp(10px, 1vw, 14px)" : "clamp(8px, 0.8vw, 12px)",
                    height: i === current ? "clamp(10px, 1vw, 14px)" : "clamp(8px, 0.8vw, 12px)",
                    background: i === current ? colors.dark.primary : "#024240",
                    opacity: i === current ? 1 : 0.3,
                  }}
                />
              ))}

              <button
                onClick={() => goTo(current + 1)}
                disabled={current === categorias.length - 1}
                aria-label="Próximo"
                className="text-[#024240] disabled:opacity-30 transition-opacity"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <span
              className="font-heading uppercase tracking-widest"
              style={{ color: colors.dark.primary, fontSize: "clamp(9px, 0.8vw, 12px)", opacity: 0.6 }}
            >
              ARRASTE PARA O LADO
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

const colors = {
  dark: { primary: "#0B4B49" },
  light: { primary: "#ADD9C5" },
};
