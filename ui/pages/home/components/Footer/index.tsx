import { FadeIn } from '~/components/ui/FadeIn';
import { LINKS, SOCIAL_ICONS } from './useFooterController';

export function Footer() {
  return (
    <footer className="bg-[#0B4B49] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      <FadeIn>
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center sm:items-start lg:items-center justify-between gap-6 sm:gap-8">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <span className="font-sans font-medium text-[16px] text-[#FDF7ED]">
              Redes sociais
            </span>
            <div className="flex items-center gap-3">
              {SOCIAL_ICONS.map((icon) => (
                <a
                  key={icon.alt}
                  href={icon.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 hover:opacity-100 transition-opacity"
                >
                  <img src={icon.src} alt={icon.alt} className="w-[29px] h-[29px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start gap-3">
            <span className="font-sans font-medium text-[16px] text-[#FDF7ED]">
              Links úteis
            </span>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-3">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-[29px] px-4 border-[1.5px] border-[#94D2B9] rounded-[30px] font-sans font-bold text-[11px] text-white whitespace-nowrap hover:bg-[#94D2B9]/10 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <img
            src="/assets/logo-aprosoja-branca.svg"
            alt="Aprosoja Mato Grosso"
            className="h-[60px] sm:h-[76px] w-auto select-none"
            draggable={false}
          />
        </div>
      </FadeIn>
    </footer>
  );
}
