import { useState } from "react";

export const FAQS = [
  {
    question: "Qual é o objetivo do Prêmio Aprosoja MT de Jornalismo?",
    answer:
      "O Prêmio Aprosoja MT de Jornalismo 2026 é uma iniciativa da Associação dos Produtores de Soja e Milho de Mato Grosso (Aprosoja MT) que visa valorizar o jornalismo como instrumento de informação qualificada. Seu objetivo é ampliar a compreensão da sociedade sobre a cadeia produtiva da soja e do milho, seus métodos produtivos e as práticas sustentáveis adotadas no campo, que conciliam produção, preservação ambiental, responsabilidade social e relevância econômica, com reflexos diretos na vida urbana, na segurança alimentar, na geração de renda, no desenvolvimento regional e na qualidade de vida da sociedade como um todo. A premiação reconhece o trabalho da imprensa na cobertura técnica, crítica e contextualizada desse segmento estratégico para o desenvolvimento do Brasil.",
  },
  { question: "Quem pode participar do Prêmio?", answer: "" },
  { question: "Profissionais de veículos institucionais podem se inscrever?", answer: "" },
  { question: "Profissionais de blogs ou redes sociais podem participar?", answer: "" },
  { question: "Qual é o tema desta edição?", answer: "" },
  { question: "Quais são as categorias do concurso?", answer: "" },
  { question: "Quais são os critérios de avaliação?", answer: "" },
  { question: "Qual é o período de veiculação das matérias que podem ser inscritas?", answer: "" },
  { question: "Quantas matérias podem ser inscritas por participante?", answer: "" },
  { question: "Como faço para me inscrever?", answer: "" },
  { question: "Qual é o prazo final para a inscrição?", answer: "" },
  { question: "É possível inscrever trabalhos realizados em equipe?", answer: "" },
  { question: "Como devem ser enviados os trabalhos?", answer: "" },
  { question: "Como será feita a divulgação dos finalistas e vencedores?", answer: "" },
  { question: "Quais são os valores dos prêmios?", answer: "" },
];

export function useFaqSectionController() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }

  return { openIndex, toggle };
}
