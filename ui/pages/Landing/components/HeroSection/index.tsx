export function HeroSection() {
  return (
    <>
      <section className="relative flex flex-col items-center px-5 md:px-8 pb-0">
        <img
          src="/images/logo-premio.png"
          alt="Selo 3D Prêmio Aprosoja MT de Jornalismo 2026"
          className="relative z-10 w-full max-w-[800px] md:max-w-[900px] mt-6"
        />
      </section>
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-80 md:-mt-96">
        <img
          src="/images/hero-illustration.svg"
          alt="Landscape illustration"
          className="relative z-10 w-full"
        />
      </div>
    </>
  );
}
