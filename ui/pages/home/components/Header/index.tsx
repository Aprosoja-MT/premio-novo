import { AnimatePresence, motion } from 'framer-motion';
import { Menu, User, X } from 'lucide-react';
import { NAV_LINKS, useHeaderController } from './useHeaderController';

export function Header() {
  const { menuOpen, toggleMenu, closeMenu, handleNavClick } = useHeaderController();

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center">
      <div
        className="w-full max-w-[1280px] rounded-b-[20px] px-4 sm:px-6 lg:px-8"
        style={{
          backdropFilter: 'blur(4.5px)',
          backgroundColor: 'rgba(255,255,255,0.74)',
        }}
      >
        <div className="h-[71px] flex items-center gap-3 lg:gap-6">
          <a href="#" className="shrink-0" onClick={closeMenu}>
            <img
              src="/assets/logo-aprosoja.png"
              alt="Aprosoja MT"
              className="h-[34px] lg:h-[42px] w-auto"
            />
          </a>

          <nav className="hidden lg:flex items-center gap-1 lg:gap-2 flex-1 lg:ml-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-2 lg:px-3 py-1 text-[10px] lg:text-[11px] font-semibold font-sans text-[#024240] uppercase tracking-wide whitespace-nowrap hover:opacity-70 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-1.5 lg:gap-2 shrink-0 ml-auto">
            <a
              href="/documents/Regulamento Oficial.docx" download
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
              href="/auth/sign-in"
              className="flex items-center gap-1.5 h-[27px] lg:h-[29px] px-3 lg:px-4 border-[1.5px] border-[#94d2b9] rounded-[30px] text-[10px] lg:text-[11px] font-bold font-sans text-[#024240] uppercase whitespace-nowrap hover:bg-[#94d2b9]/10 transition-colors"
            >
              <User size={13} strokeWidth={1.5} />
              ENTRAR
            </a>
          </div>

          <button
            onClick={toggleMenu}
            className="lg:hidden ml-auto flex items-center justify-center w-[40px] h-[40px] text-[#024240]"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="lg:hidden pb-4 flex flex-col gap-1 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-2 py-3 text-[13px] font-semibold font-sans text-[#024240] uppercase tracking-wide border-b border-[#94d2b9]/30 last:border-0 hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-3">
                <a
                  href="/documents/Regulamento Oficial.docx" download
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 h-[40px] px-4 border-[1.5px] border-[#94d2b9] rounded-[30px] text-[12px] font-bold font-sans text-[#024240] uppercase hover:bg-[#94d2b9]/10 transition-colors"
                >
                  BAIXE O REGULAMENTO
                  <img src="/assets/icon-arrow.svg" alt="" className="w-[14px] h-[8px]" />
                </a>
                <div className="flex gap-2">
                  <a
                    href="#inscricao"
                    onClick={closeMenu}
                    className="flex-1 flex items-center justify-center h-[40px] px-4 border-[1.5px] border-[#94d2b9] rounded-[30px] text-[12px] font-bold font-sans text-[#024240] uppercase hover:bg-[#94d2b9]/10 transition-colors"
                  >
                    INSCRIÇÃO
                  </a>
                  <a
                    href="/auth/sign-in"
                    onClick={closeMenu}
                    className="flex-1 flex items-center justify-center gap-1.5 h-[40px] px-4 border-[1.5px] border-[#94d2b9] rounded-[30px] text-[12px] font-bold font-sans text-[#024240] uppercase hover:bg-[#94d2b9]/10 transition-colors"
                  >
                    <User size={14} strokeWidth={1.5} />
                    ENTRAR
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
