export function InfoSection() {
  return (
    <section className="relative w-full" style={{ background: "#f0eded" }}>
      <div
        className="absolute left-0 right-0 w-full z-0"
        style={{
          height: "8vw",
          top: "-4vw",
          background: "#F0F0ED",
          borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
        }}
      />

      <img
        src="/images/ilustracao-curvada.png"
        alt="Ilustração agro sustentável"
        className="relative w-full z-10"
        style={{ display: "block", marginTop: "clamp(-340px, -24vw, -100px)", marginBottom: "clamp(-60px, -5vw, -20px)" }}
      />

      <div className="relative z-10 w-full px-[8%]">
        <div className="flex flex-row items-stretch justify-between gap-8">

          <div className="flex items-center overflow-hidden">
            <div
              className="shrink-0 font-heading-now text-white flex items-center justify-center whitespace-nowrap rounded-tag"
              style={{ background: "#024240", fontSize: "clamp(14px, 1.6vw, 20px)", minWidth: "clamp(80px, 9vw, 118px)", height: "clamp(50px, 5.6vw, 76px)", padding: "0 1.5vw" }}
            >
              TEMA
            </div>
            <p
              className="font-heading-now uppercase leading-tight px-6 flex items-center"
              style={{ color: "#024240", fontSize: "clamp(16px, 2vw, 24px)" }}
            >
              O agro sustentável que transforma<br />a cidade a partir do campo
            </p>
          </div>

          <div className="flex items-center overflow-hidden">
            <div
              className="shrink-0 font-heading-now text-white flex items-center justify-center whitespace-nowrap rounded-tag"
              style={{ background: "#024240", fontSize: "clamp(14px, 1.6vw, 20px)", minWidth: "clamp(130px, 14.5vw, 194px)", height: "clamp(50px, 5.6vw, 76px)", padding: "0 1.5vw" }}
            >
              INSCRIÇÕES
            </div>
            <p
              className="font-heading uppercase leading-tight px-6 flex items-center"
              style={{ color: "#024240", fontSize: "clamp(16px, 2vw, 24px)" }}
            >
              07 de Abril<br />07 de Agosto<br />de 2026
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}