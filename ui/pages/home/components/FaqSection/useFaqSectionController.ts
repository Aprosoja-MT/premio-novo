import { useState } from "react";

export const FAQS = [
  {
    question: "Qual é o objetivo do Prêmio Aprosoja MT de Jornalismo?",
    answer:
      "O Prêmio Aprosoja MT de Jornalismo 2026 é uma iniciativa da Associação dos Produtores de Soja e Milho de Mato Grosso (Aprosoja MT) que visa valorizar o jornalismo como instrumento de informação qualificada. Seu objetivo é ampliar a compreensão da sociedade sobre a cadeia produtiva da soja e do milho, seus métodos produtivos e as práticas sustentáveis adotadas no campo, que conciliam produção, preservação ambiental, responsabilidade social e relevância econômica, com reflexos diretos na vida urbana, na segurança alimentar, na geração de renda, no desenvolvimento regional e na qualidade de vida da sociedade como um todo. A premiação reconhece o trabalho da imprensa na cobertura técnica, crítica e contextualizada desse segmento estratégico para o desenvolvimento do Brasil.",
  },
  {
    question: "Quem pode participar do Prêmio?",
    answer:
      "Podem participar obras jornalísticas produzidas e publicadas por veículos de imprensa e canais de internet sediados no Brasil, relacionadas à produção de soja e milho, desde que abordem de forma direta e identificável a cadeia produtiva da soja e/ou do milho e sejam pertinentes ao tema do concurso. Os profissionais devem ter registro profissional ativo nos órgãos competentes, com exceção para a categoria Destaques Mato-grossenses e Jornalismo Universitário.",
  },
  {
    question: "Profissionais de veículos institucionais podem se inscrever?",
    answer:
      "Não podem participar obras jornalísticas publicadas ou veiculadas em meios ou canais de comunicação de titularidade de entidades sindicais, entidades de classe profissional ou setorial, e de entidades ou órgãos vinculados às pessoas jurídicas de direito público dos Poderes da República ou dos seus Entes Federativos. A exceção é para a categoria Jornalismo Universitário, onde é permitida a inscrição de obras publicadas em sites, portais ou veículos institucionais da instituição de ensino na qual o autor esteja regularmente matriculado.",
  },
  {
    question: "Profissionais de blogs ou redes sociais podem participar?",
    answer:
      "Matérias jornalísticas veiculadas em sites ou portais de notícias ou \"Blogs\" de conteúdos na Internet são aceitas na categoria Reportagem em Texto. No entanto, não são aceitos conteúdos publicados exclusivamente em redes sociais pessoais.",
  },
  {
    question: "Qual é o tema desta edição?",
    answer: "O tema do Prêmio Aprosoja MT de Jornalismo 2026 é: \"O agro sustentável que transforma a cidade a partir do campo\".",
  },
  {
    question: "Quais são as categorias do concurso?",
    answer:
      "O Prêmio possui as seguintes categorias:\n\n• Reportagem em Vídeo: Matéria jornalística veiculada em canais de televisão (rede aberta, por assinatura ou streaming) ou em canais do YouTube ou de Podcasts na Internet, com duração igual ou inferior a 10 minutos.\n\n• Reportagem em Texto: Matéria jornalística veiculada em jornais impressos, revistas, sites ou portais de notícias ou Blogs de conteúdos na Internet, produzidos e publicados no Estado de Mato Grosso.\n\n• Reportagem em Áudio: Matéria jornalística veiculada em emissoras de rádio ou em canais ou plataformas de Streaming ou Podcasts na Internet, com duração igual ou inferior a 10 minutos.\n\n• Fotojornalismo: Foto ou sequência de fotos publicadas em matéria de veículos de imprensa ou de comunicação, que não possuam caráter meramente artístico ou efeitos especiais de edição.\n\n• Destaques Mato-grossenses: Matéria jornalística em vídeo, texto, áudio ou foto, publicada em veículos de imprensa e de comunicação, produzidos e veiculados em âmbito regional estadual (Norte, Sul, Leste, Oeste e Baixada Cuiabana do Estado de Mato Grosso).\n\n• Jornalismo Universitário: Conteúdo jornalístico produzido e publicado por alunos regularmente matriculados em curso de graduação em Comunicação Social, com habilitação em Jornalismo, de Instituições de Ensino Superior públicas ou privadas sediadas no Brasil.",
  },
  {
    question: "Quais são os critérios de avaliação?",
    answer:
      "Os critérios de avaliação incluem:\n\n• Pertinência temática: Assertividade da matéria em abordar o tema do concurso.\n\n• Conteúdo da notícia: Valor noticioso, interesse e relevância pública, riqueza de detalhes e informações, observância de estilos, técnicas e estética do jornalismo e fotografia.\n\n• Qualidade de texto: Qualidade final de texto e gramática, clareza, coesão, coerência e uso de dados corretos.\n\n• Qualidade da narrativa: Capacidade da reportagem de contar uma história de maneira coerente e agradável, com narrativa bem desenvolvida e concatenada com o tema.\n\n• Qualidade estética: Estética visual do vídeo e potencial de impacto nos telespectadores.\n\n• Relevância da fotografia: Contribuição informativa da(s) fotografia(s) para a matéria, alinhada ao tema do concurso.\n\n• Benefício público: Prestação de serviço e impacto na vida dos cidadãos.\n\n• Fontes de informações: Depoimentos de produtores rurais, instituições ligadas ao agronegócio e inclusão de dados de pesquisas.\n\n• Originalidade, inovação e criatividade: Maneira e forma como os conteúdos são apresentados, valorizando abordagens originais e criativas.",
  },
  {
    question: "Qual é o período de veiculação das matérias que podem ser inscritas?",
    answer:
      "As obras e trabalhos inscritos devem ter sido publicados, em língua portuguesa, entre o período de 12 de setembro de 2025 a 07 de agosto de 2026, em veículos de comunicação ou imprensa (impressa, televisiva, radiofônica ou digital).",
  },
  {
    question: "Quantas matérias podem ser inscritas por participante?",
    answer:
      "Cada participante poderá inscrever no máximo 02 (duas) trabalhos jornalísticos, sendo todos exclusivamente na mesma categoria de premiação. Não é permitido participar de categorias diferentes, à exceção da categoria Destaques Mato-grossenses, desde que a inscrição naquela categoria ocorra em uma única região de disputa. Para a categoria de Fotojornalismo, podem ser inscritas até 02 (duas) imagens.",
  },
  {
    question: "Como faço para me inscrever?",
    answer:
      "As inscrições são gratuitas e devem ser realizadas no período das 08:00 horas (horário de Brasília) do dia 07 de abril de 2026 até às 17:00 horas (horário de Brasília) do dia 07 de agosto de 2026, exclusivamente pela página de internet da Aprosoja MT no endereço eletrônico: https://premio.aprosoja.com.br/. É necessário preencher um formulário de inscrição e anexar o arquivo digital correspondente ao trabalho.",
  },
  {
    question: "Qual é o prazo final para a inscrição?",
    answer: "O prazo final para a inscrição é 07 de agosto de 2026, às 17:00 horas (horário de Brasília).",
  },
  {
    question: "É possível inscrever trabalhos realizados em equipe?",
    answer:
      "Sim, é permitida a inscrição de matéria jornalística produzida em equipe. Contudo, apenas um dos autores ou responsáveis poderá figurar como sujeito da inscrição e participação em todas as etapas do certame, incluindo a cerimônia de premiação. Os demais coautores deverão ser informados e identificados em campo específico do formulário de inscrição.",
  },
  {
    question: "Como devem ser enviados os trabalhos?",
    answer:
      "Os trabalhos devem ser enviados por meio do formulário de inscrição na página do Prêmio, anexando o arquivo digital nos seguintes formatos e tamanhos máximos:\n\n• PDF (matérias em texto): até 25 MB.\n• MP4/MPEG (matérias em vídeo): até 50 MB, resolução Full HD em codec H.264.\n• MP3 (matérias em áudio): até 15 MB, bitrate mínimo de 192 kbps.\n• JPG/JPEG (material fotográfico): até 15 MB, resolução de 300 DPI.\n\nAlém disso, deverá ser informado um link válido de acesso ao conteúdo da obra inscrita, que comprove a autenticidade e veracidade da publicação.",
  },
  {
    question: "Como será feita a divulgação dos finalistas e vencedores?",
    answer:
      "A divulgação dos finalistas e vencedores será realizada exclusivamente pelos canais oficiais de comunicação da Aprosoja MT, incluindo a página de internet e redes sociais. Os participantes também poderão acompanhar por meio do login cadastrado no site oficial do prêmio. A relação de finalistas de cada categoria será divulgada até 15 dias antes da cerimônia de premiação.",
  },
  {
    question: "Quais são os valores dos prêmios?",
    answer:
      "Os valores dos prêmios para cada categoria são:\n\n• Reportagem em Vídeo: 1º lugar R$ 20.000 | 2º lugar R$ 15.000 | 3º lugar R$ 5.000\n• Reportagem em Texto: 1º lugar R$ 20.000 | 2º lugar R$ 15.000 | 3º lugar R$ 5.000\n• Reportagem em Áudio: 1º lugar R$ 20.000 | 2º lugar R$ 15.000 | 3º lugar R$ 5.000\n• Fotojornalismo: 1º lugar R$ 20.000 | 2º lugar R$ 15.000 | 3º lugar R$ 5.000\n• Jornalismo Universitário: 1º lugar R$ 15.000 | 2º lugar R$ 10.000 | 3º lugar R$ 5.000\n• Destaques Mato-grossenses: 1º e 2º lugar de cada região (Norte, Sul, Leste, Oeste e Baixada Cuiabana) com R$ 7.000 cada.\n\nAlém disso, há o Prêmio Master: uma Viagem Missão EUA com a Aprosoja MT para um finalista sorteado entre os habilitados.",
  },
  {
    question: "O que é o Prêmio Master e como posso participar?",
    answer:
      "O Prêmio Master é uma viagem Missão EUA com a Aprosoja MT, prevista para 2027. Os 10 finalistas de cada categoria e os 5 finalistas das regiões da categoria Destaques Mato-grossenses, após avaliação e homologação, estarão automaticamente habilitados para esta categoria, desde que tenham informado, obrigatoriamente no ato da inscrição, número de passaporte válido e visto válido para ingresso nos Estados Unidos da América, com validade mínima até dezembro de 2027. O vencedor será definido por sorteio e terá todas as despesas custeadas pela Aprosoja MT durante a missão.",
  },
  {
    question: "Quais são os requisitos para a categoria Jornalismo Universitário?",
    answer:
      "Para a categoria Jornalismo Universitário, é dispensada a exigência de registro profissional. É obrigatória a apresentação de comprovante de matrícula ativa, no período de publicação da obra, em curso de graduação em Jornalismo ou Comunicação Social. As obras podem ser publicadas em veículos universitários, laboratórios acadêmicos ou plataformas institucionais das instituições de ensino.",
  },
  {
    question: "Há alguma restrição para quem não pode participar?",
    answer:
      "Não podem participar do Prêmio Aprosoja MT de Jornalismo 2026:\n\n• Membros das Comissões do Prêmio.\n• Profissionais que tenham prestado serviço à Aprosoja MT nos últimos 12 meses, contados da data de publicação do concurso.\n• Integrantes da Diretoria e Conselhos ou funcionários da Aprosoja MT, bem como seus familiares (cônjuge, companheiro ou parente em linha reta ou colateral, por consanguinidade ou afinidade, até o terceiro grau de parentesco).\n• Obras jornalísticas publicadas ou veiculadas em meios ou canais de comunicação de titularidade de entidades sindicais, entidades de classe profissional ou setorial, e de entidades ou órgãos vinculados às pessoas jurídicas de direito público dos Poderes da República ou dos seus Entes Federativos (exceto para a categoria Jornalismo Universitário).",
  },
  {
    question: "O que acontece em caso de empate na avaliação?",
    answer:
      "Em caso de empate, serão adotados, sucessivamente, os seguintes critérios: maior nota em Pertinência temática; Conteúdo da notícia; Benefício público; Originalidade e, persistindo o empate, voto de qualidade dos membros da comissão.",
  },
  {
    question: "É necessário ter registro profissional para participar?",
    answer:
      "Sim, é necessário ter registro profissional ativo nos órgãos competentes, com exceção para a categoria Destaques Mato-grossenses e Jornalismo Universitário.",
  },
  {
    question: "A Aprosoja MT terá direitos autorais sobre os trabalhos inscritos?",
    answer:
      "A participação no Prêmio não implica na transferência dos direitos autorais e intelectuais sobre as obras jornalísticas inscritas para a Aprosoja MT, permanecendo tais direitos com os respectivos autores. No entanto, a inscrição autoriza a Aprosoja MT a utilizar e reproduzir, parcial ou integralmente, o conteúdo para veiculações referentes à divulgação e promoção do Prêmio, pelo prazo de até 01 (um) ano após a data de encerramento do concurso.",
  },
  {
    question: "Quando será a cerimônia de premiação?",
    answer:
      "A Solenidade de Premiação será realizada em 19 de novembro de 2026, em local a ser oportunamente divulgado pela Aprosoja MT.",
  },
  {
    question: "Qual o prazo para o pagamento dos prêmios?",
    answer:
      "Os prêmios serão pagos aos vencedores em até 180 (cento e oitenta) dias, contados a partir da data oficial de divulgação do resultado e de premiação, mediante o cumprimento das exigências documentais previstas no regulamento.",
  },
];

export function useFaqSectionController() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }

  return { openIndex, toggle };
}
