import { LINKS, SOCIAL_ICONS } from "./useFooterController";

export function Footer() {
  return (
    <footer className="bg-[#0B4B49] px-6 lg:px-8 py-10 lg:py-12">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8">
        <div className="flex flex-col gap-3">
          <span className="font-sans font-medium text-[16px] text-[#FDF7ED]">
            Redes sociais
          </span>
          <div className="flex items-center gap-3">
            {SOCIAL_ICONS.map((icon) => (
              <a key={icon.alt} href="#" className="opacity-90 hover:opacity-100 transition-opacity">
                <img src={icon.src} alt={icon.alt} className="w-[29px] h-[29px]" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-sans font-medium text-[16px] text-[#FDF7ED]">
            Links úteis
          </span>
          <div className="flex items-center gap-3">
            {LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="flex items-center justify-center h-[29px] px-4 border-[1.5px] border-[#94D2B9] rounded-[30px] font-sans font-bold text-[11px] text-white whitespace-nowrap hover:bg-[#94D2B9]/10 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <img
          src="/assets/logo-aprosoja-branca.svg"
          alt="Aprosoja Mato Grosso"
          className="h-[76px] select-none"
          draggable={false}
        />
      </div>
    </footer>
  );
}
