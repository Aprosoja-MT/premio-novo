import { User } from "lucide-react";
import { NAV_LINKS } from "./useHeaderController";

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center">
      <div
        className="w-full max-w-[1280px] h-[71px] rounded-b-[20px] flex items-center px-6 lg:px-8 gap-3 lg:gap-6"
        style={{
          backdropFilter: "blur(4.5px)",
          backgroundColor: "rgba(255,255,255,0.74)",
        }}
      >
        <a href="#" className="shrink-0">
          <img
            src="/assets/logo-aprosoja.png"
            alt="Aprosoja MT"
            className="h-[34px] lg:h-[42px] w-auto"
          />
        </a>

        <nav className="flex items-center gap-1 lg:gap-2 flex-1 lg:ml-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-2 lg:px-3 py-1 text-[10px] lg:text-[11px] font-semibold font-sans text-[#024240] uppercase tracking-wide whitespace-nowrap hover:opacity-70 transition-opacity"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">
          <a
            href="#regulamento"
            className="flex items-center gap-1.5 lg:gap-2 h-[27px] lg:h-[29px] px-3 lg:px-4 border-[1.5px] border-[#94d2b9] rounded-[30px] text-[10px] lg:text-[11px] font-bold font-sans text-[#024240] uppercase whitespace-nowrap hover:bg-[#94d2b9]/10 transition-colors"
          >
            BAIXE O REGULAMENTO
            <img src="/assets/icon-arrow.svg" alt="" className="w-[14px] h-[8px]" />
          </a>

          <a
            href="#inscricao"
            className="flex items-center justify-center h-[27px] lg:h-[29px] px-3 lg:px-4 border-[1.5px] border-[#94d2b9] rounded-[30px] text-[10px] lg:text-[11px] font-bold font-sans text-[#024240] uppercase whitespace-nowrap hover:bg-[#94d2b9]/10 transition-colors"
          >
            INSCRIÇÃO
          </a>

          <a
            href="#entrar"
            className="flex items-center gap-1.5 h-[27px] lg:h-[29px] px-3 lg:px-4 border-[1.5px] border-[#94d2b9] rounded-[30px] text-[10px] lg:text-[11px] font-bold font-sans text-[#024240] uppercase whitespace-nowrap hover:bg-[#94d2b9]/10 transition-colors"
          >
            <User size={13} strokeWidth={1.5} />
            ENTRAR
          </a>
        </div>
      </div>
    </header>
  );
}
