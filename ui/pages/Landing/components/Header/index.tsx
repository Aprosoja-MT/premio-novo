import { User } from "lucide-react";
import { Link } from "react-router";

const navLinks = [
  { label: "O QUE É?", href: "#oquee" },
  { label: "PREMIAÇÃO", href: "#premiacao" },
  { label: "CATEGORIA", href: "#categoria" },
  { label: "PERGUNTAS FREQUENTES", href: "#faq" },
];

export function Header() {
  return (
    <header className="w-full bg-white/74 backdrop-blur-md rounded-b-[20px] px-5 md:px-10 py-4 flex flex-wrap items-center justify-between gap-4 mt-0">
      <div className="flex items-center gap-8 lg:gap-12">
        <Link to="/">
          <img
            src="/images/logo-aprosoja.png"
            alt="Aprosoja MT"
            className="w-[120px] md:w-[144px] object-contain"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-primary font-semibold text-xs tracking-wide hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <a
          href="#regulamento"
          className="border-2 border-accent rounded-full px-4 py-2 flex items-center gap-2 text-primary font-bold text-xs hover:bg-accent/20 transition-colors"
        >
          <span className="hidden sm:inline">BAIXE O REGULAMENTO</span>
          <span className="sm:hidden">REGULAMENTO</span>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="stroke-primary">
            <path d="M1 4H13M13 4L10 1M13 4L10 7" strokeWidth="1.5" />
          </svg>
        </a>
        <a
          href="#inscricao"
          className="border-2 border-accent rounded-full px-5 py-2 text-primary font-bold text-xs hover:bg-accent/20 transition-colors whitespace-nowrap"
        >
          INSCRIÇÃO
        </a>
        <a
          href="#entrar"
          className="bg-primary rounded-full px-5 py-2 flex items-center gap-1.5 text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity"
        >
          <User size={13} />
          ENTRAR
        </a>
      </div>
    </header>
  );
}
