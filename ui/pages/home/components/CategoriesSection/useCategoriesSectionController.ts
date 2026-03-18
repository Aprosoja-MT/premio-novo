import { useRef } from 'react';
import type { SwiperRef } from 'swiper/react';

export const CATEGORY_CARDS = [
  {
    title: 'Reportagem\nem Vídeo',
    text: 'Matéria jornalística veiculada em canais de televisão (rede aberta, por assinatura ou streaming) ou em canais da plataforma Youtube ou de "Podcasts" na Internet, em língua portuguesa, produzidos e publicados no Estado de Mato Grosso, com pertinência temática ao concurso, e com duração igual ou menor seis minutos, fora o tempo de cabeça – chamada do apresentador.',
  },
  {
    title: 'Reportagem\nem Texto',
    text: 'Matéria jornalística veiculada em jornais impressos, em revistas, em sites ou portais de notícias ou "Blogs" de conteúdos na Internet, em língua portuguesa, produzidos e publicados no Estado de Mato Grosso, e com pertinência temática ao concurso.',
  },
  {
    title: 'Reportagem\nem Áudio',
    text: 'Matéria jornalística veiculada em emissoras de rádio ou em canais ou plataformas de "Streaming" ou "Podcasts" na Internet, em língua portuguesa, produzidos e publicados no Estado de Mato Grosso, com pertinência temática ao concurso, e com duração igual ou menor seis minutos, fora o tempo de cabeça – chamada do apresentador.',
  },
  {
    title: 'Foto-\njornalismo',
    text: 'Fotografia jornalística publicada em veículos impressos, digitais ou redes sociais de caráter jornalístico, em língua portuguesa, produzida e publicada no Estado de Mato Grosso, com pertinência temática ao concurso.',
  },
  {
    title: 'Jornalismo\nUniversitário',
    text: 'Produção jornalística realizada por estudantes de graduação em Jornalismo ou Comunicação Social de instituições de ensino superior do Estado de Mato Grosso, com pertinência temática ao concurso.',
  },
  {
    title: 'Destaques\nMato-grossenses',
    text: 'Categoria exclusiva para jornalistas que atuam no Estado de Mato Grosso, reconhecendo profissionais com trajetória de destaque na cobertura do agronegócio e da cadeia produtiva da soja e milho.',
  },
];

export const SLIDES = [
  { category: 'REPORTAGEM EM VÍDEO', podium: '/assets/awards-podium.png' },
  { category: 'REPORTAGEM EM TEXTO', podium: '/assets/awards-podium.png' },
  { category: 'REPORTAGEM EM ÁUDIO', podium: '/assets/awards-podium.png' },
  { category: 'FOTOJORNALISMO', podium: '/assets/awards-podium.png' },
  { category: 'JORNALISMO UNIVERSITÁRIO', podium: '/assets/podium-jornalismo-universitario.png' },
  { category: 'DESTAQUES MATO-GROSSENSES', podium: '/assets/awards-podium.png' },
];

export function useCategoriesSectionController() {
  const podiumSwiper = useRef<SwiperRef>(null);
  const cardsSwiper = useRef<SwiperRef>(null);

  function slidePodiumPrev() {
    podiumSwiper.current?.swiper.slidePrev();
  }

  function slidePodiumNext() {
    podiumSwiper.current?.swiper.slideNext();
  }

  function slideCardsPrev() {
    cardsSwiper.current?.swiper.slidePrev();
  }

  function slideCardsNext() {
    cardsSwiper.current?.swiper.slideNext();
  }

  return { podiumSwiper, cardsSwiper, slidePodiumPrev, slidePodiumNext, slideCardsPrev, slideCardsNext };
}
