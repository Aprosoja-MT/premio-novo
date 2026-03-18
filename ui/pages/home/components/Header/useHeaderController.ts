import { useState } from "react";

export const NAV_LINKS = [
  { label: "O QUE É?", href: "#o-que-e" },
  { label: "PREMIAÇÃO", href: "#categoria" },
  { label: "CATEGORIA", href: "#carrossel-categorias" },
  { label: "PERGUNTAS FREQUENTES", href: "#faq" },
];

export function useHeaderController() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    closeMenu();
    setTimeout(() => {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (!el) return;
      const offset = id === "carrossel-categorias" ? -300 : 0;
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: "smooth" });
    }, 300);
  }

  return { menuOpen, toggleMenu, closeMenu, handleNavClick };
}
