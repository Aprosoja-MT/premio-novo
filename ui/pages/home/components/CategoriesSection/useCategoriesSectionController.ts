import { useRef } from 'react';
import type { SwiperRef } from 'swiper/react';

export const CATEGORY_CARDS = [
  {
    title: 'Reportagem\nem Vídeo',
    text: 'Matéria jornalística veiculada em canais de televisão (rede aberta, por assinatura ou streaming) ou em canais da plataforma Youtube ou de "Podcasts" na Internet, em língua portuguesa, produzidos e publicados no Brasil, com pertinência temática ao concurso, e com duração igual ou inferior a 10 (dez) minutos, não computado o tempo de cabeça, introdução ou chamada do apresentador.',
  },
  {
    title: 'Reportagem\nem Texto',
    text: 'Matéria jornalística veiculada em jornais impressos, em revistas, em sites ou portais de notícias ou "Blogs" de conteúdos na Internet, em língua portuguesa, produzidos e publicados no Estado de Mato Grosso, e com pertinência temática ao concurso.',
  },
  {
    title: 'Reportagem\nem Áudio',
    text: 'Matéria jornalística veiculada em emissoras de rádio ou em canais ou plataformas de "Streaming" ou "Podcasts" na Internet, em língua portuguesa, produzidos e publicados no Estado de Mato Grosso, com pertinência temática ao concurso, com duração igual ou inferior a 10 (dez) minutos, não computado o tempo de cabeça, introdução ou chamada do apresentador.',
  },
  {
    title: 'Foto-\njornalismo',
    text: 'Foto ou sequência de fotos publicadas em matéria de veículos de imprensa ou de comunicação (jornais, revistas, portais de notícias ou de conteúdo na internet), sediados no Brasil, com pertinência temática ao concurso, e que não possuam caráter meramente artístico ou ainda efeitos especiais de edição e nem sejam produtos de ensaios de imagens ou de realização por cinegrafistas ou fotógrafos amadores (que não tenha registro profissional).',
  },
  {
    title: 'Jornalismo\nUniversitário',
    text: 'Conteúdo jornalístico (nas modalidades Texto, Áudio, Vídeo ou Foto), produzidos e publicados por alunos regularmente matriculados em curso de graduação em Comunicação Social, com habilitação em Jornalismo, de Instituições de Ensino Superior públicas ou privadas sediadas no Brasil, com pertinência temática ao concurso e observados parâmetros de forma e duração tratados nas categorias anteriores.',
  },
  {
    title: 'Destaques\nMato-grossenses',
    text: 'Matéria jornalística em vídeo, texto, áudio ou foto, ainda que por autor sem registro profissional em jornalismo, publicada em veículos de imprensa e de comunicação já descritos nas categorias anteriores, produzidos e veiculados em âmbito regional estadual, ou seja, nas regiões Norte, Sul, Leste, Oeste e da Baixada Cuiabana do Estado de Mato Grosso; e com pertinência temática ao concurso.',
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
