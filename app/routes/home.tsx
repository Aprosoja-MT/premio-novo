import type { MetaFunction } from 'react-router';
import { HomePage } from '@/pages/home';

export const meta: MetaFunction = () => {
  const title = 'Prêmio Aprosoja MT de Jornalismo 2026';
  const description =
    'Concurso cultural de caráter técnico-jornalístico promovido pela Aprosoja MT. Tema: O Agro Sustentável que Transforma a Cidade a Partir do Campo. Inscrições de 07 de abril a 07 de agosto de 2026.';
  const url = 'https://ctecno-hml.aprosoja.com.br';
  const image = `${url}/assets/og-image.png`;

  return [
    { title },
    { name: 'description', content: description },

    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '822' },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:locale', content: 'pt_BR' },
    { property: 'og:site_name', content: 'Prêmio Aprosoja MT de Jornalismo' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@aprosojamt' },
    { name: 'twitter:url', content: url },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:alt', content: 'Prêmio Aprosoja MT de Jornalismo 2026' },

    { name: 'theme-color', content: '#0B4B49' },
  ];
};

export default function HomeRoute() {
  return <HomePage />;
}
