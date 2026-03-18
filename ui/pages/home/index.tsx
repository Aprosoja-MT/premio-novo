import { CategoriesSection } from './components/CategoriesSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ThemeSection } from './components/ThemeSection';
import { WhatIsPremioSection } from './components/WhatIsPremioSection';

export function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <ThemeSection />
      <WhatIsPremioSection />
      <CategoriesSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
