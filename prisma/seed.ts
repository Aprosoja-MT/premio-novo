/* eslint-disable no-console */
import 'dotenv/config';
import { createHmac } from 'node:crypto';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  AdminUpdateUserAttributesCommand,
  AdminDeleteUserCommand,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../app/generated/prisma/index.js';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL']! });
const prisma = new PrismaClient({ adapter });

const cognito = new CognitoIdentityProviderClient({
  region: process.env['AWS_REGION']!,
  credentials: {
    accessKeyId: process.env['AWS_ACCESS_KEY']!,
    secretAccessKey: process.env['AWS_ACCESS_SECRET_KEY']!,
  },
});

const USER_POOL_ID = process.env['COGNITO_USER_POOL_ID']!;

// ---------------------------------------------------------------------------
// Seed users — logins reais no Cognito
// ---------------------------------------------------------------------------

const SEED_STAFF = [
  { email: 'admin@aprosoja.com.br',           password: 'Admin@123456',         role: 'ADMIN'           as const },
  { email: 'ian.martins@aprosoja.com.br',     password: 'Aprosoja2025@',        role: 'ADMIN'           as const },
  { email: 'habilitacao@aprosoja.com.br',      password: 'Habilita@123456',      role: 'PHASE1_REVIEWER' as const },
  { email: 'tecnico1@aprosoja.com.br',         password: 'Tecnico1@123456',      role: 'PHASE2_JUDGE'    as const },
  { email: 'tecnico2@aprosoja.com.br',         password: 'Tecnico2@123456',      role: 'PHASE2_JUDGE'    as const },
  { email: 'tecnico3@aprosoja.com.br',         password: 'Tecnico3@123456',      role: 'PHASE2_JUDGE'    as const },
  { email: 'institucional1@aprosoja.com.br',   password: 'Instit1@123456',       role: 'PHASE3_JUDGE'    as const },
  { email: 'institucional2@aprosoja.com.br',   password: 'Instit2@123456',       role: 'PHASE3_JUDGE'    as const },
];

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const STATES = ['MT', 'SP', 'RJ', 'RS', 'BA', 'PR', 'MG', 'PE', 'GO', 'SC'];
const CITIES: Record<string, string[]> = {
  MT: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra'],
  SP: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'Sorocaba'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Nova Iguaçu', 'Campos'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Santa Maria', 'Canoas'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Ilhéus', 'Itabuna'],
  PR: ['Curitiba', 'Londrina', 'Maringá', 'Foz do Iguaçu', 'Cascavel'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Montes Claros'],
  PE: ['Recife', 'Caruaru', 'Petrolina', 'Olinda', 'Paulista'],
  GO: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia'],
  SC: ['Florianópolis', 'Joinville', 'Blumenau', 'Chapecó', 'Criciúma'],
};

const FIRST_NAMES = [
  'Ana', 'Carlos', 'Fernanda', 'João', 'Mariana',
  'Pedro', 'Juliana', 'Rafael', 'Beatriz', 'Lucas',
  'Camila', 'Thiago', 'Larissa', 'Gustavo', 'Patrícia',
  'Eduardo', 'Amanda', 'Felipe', 'Renata', 'Marcelo',
  'Sofia', 'Bruno', 'Isabela', 'Diego', 'Natalia',
  'Rodrigo', 'Vanessa', 'Leandro', 'Priscila', 'André',
];
const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Lima',
  'Pereira', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida',
  'Nascimento', 'Carvalho', 'Melo', 'Ribeiro', 'Araújo',
  'Gomes', 'Martins', 'Barbosa', 'Rocha', 'Cardoso',
];

const WORK_TITLES = {
  VIDEO: [
    'A soja que alimenta o mundo: por dentro das lavouras do Cerrado',
    'Colheita recorde em Mato Grosso e o impacto no mercado global',
    'Jovens agricultores e o futuro do agronegócio brasileiro',
    'Tecnologia e campo: como drones estão revolucionando plantações',
    'Da terra ao prato: o caminho da soja até a mesa dos brasileiros',
    'Irrigação inteligente: o desafio da agricultura no semiárido',
    'O milho safrinha e a resiliência do produtor mato-grossense',
    'Rastreabilidade: como o Brasil exporta com mais segurança',
    'Desafios ambientais e a busca por uma agricultura sustentável',
    'O papel das cooperativas no fortalecimento do produtor rural',
  ],
  TEXT: [
    'Fronteira agrícola: o avanço da soja sobre o Cerrado e seus efeitos',
    'Crédito rural em crise: o que está por trás das dificuldades do campo',
    'Como a Aprosoja representa os produtores em Brasília',
    'Agro tech: startups transformando o setor com inovação',
    'Seguro agrícola: por que tantos produtores ainda ficam descobertos',
    'O boom do algodão em Mato Grosso e sua cadeia produtiva',
    'Mudanças climáticas e os desafios para o planejamento da safra',
    'A logística do escoamento de grãos e o custo Brasil',
    'Biotecnologia e transgênicos: avanços e controvérsias no campo',
    'Sucessão familiar na agricultura: como garantir o futuro das propriedades',
  ],
  AUDIO: [
    'Rádio do campo: como os podcasts chegaram ao produtor rural',
    'Vozes do agro: entrevistas com produtores de diversas regiões',
    'O som da roça: tradição e modernidade no interior do Brasil',
    'Chuvas e previsão: como o clima afeta o planejamento do produtor',
    'Feiras agropecuárias: ponto de encontro e negócios no campo',
    'O papel da mulher no agronegócio brasileiro',
    'Financiamento agrícola: decifrando o Plano Safra',
    'Segurança alimentar: a responsabilidade do produtor brasileiro',
    'Agricultura familiar versus agronegócio: há espaço para os dois',
    'O futuro da cafeicultura no Brasil e no mundo',
  ],
  PHOTO: [
    'Retratos da colheita: imagens que capturam o trabalho no campo',
    'Geometria do agro: as lavouras vistas de cima',
    'Faces do cerrado: pessoas e paisagens do interior de Mato Grosso',
    'Entre safras: o intervalo que prepara a próxima temporada',
    'Máquinas e gente: a modernização do campo em imagens',
    'Água e terra: fotojornalismo das bacias hidrográficas do Cerrado',
    'Noites de colheita: o trabalho ininterrupto das máquinas',
    'O silo que não para: o armazenamento de grãos em imagens',
    'Mãos que plantam: retratos de trabalhadores rurais do Brasil Central',
    'Assentamentos e grandes propriedades: contrastes do campo brasileiro',
  ],
  UNIVERSITY: [
    'Agro nas redes: como o setor construiu sua narrativa nas mídias sociais',
    'Comunicação rural e identidade: um estudo sobre o jornalismo do campo',
    'Fake news e o agronegócio: análise da desinformação no setor',
    'A pauta ambiental na cobertura do agronegócio na imprensa nacional',
    'Jornalismo de dados aplicado ao setor agrícola brasileiro',
    'Cobertura midiática dos conflitos fundiários no Centro-Oeste',
    'O agricultor como fonte: legitimidade e visibilidade na mídia',
    'Redes sociais e mobilização rural: o caso da bancada ruralista',
    'Narrativas fotográficas sobre o trabalho feminino no campo',
    'A representação do Cerrado no jornalismo ambiental brasileiro',
  ],
  DESTAQUES_MT: [
    'Soja em Mato Grosso: a história do estado que lidera a produção nacional',
    'Cuiabá e o papel logístico no escoamento da produção mato-grossense',
    'Produtores do Norte do estado enfrentam desafios de infraestrutura',
    'A pecuária extensiva e intensiva no sul de Mato Grosso',
    'Destaques da safra de algodão no Leste mato-grossense',
    'O agro da Baixada Cuiabana e sua importância para a economia local',
    'Oeste do estado: fronteira agrícola e desafios ambientais',
    'Diversificação produtiva: além da soja no interior de MT',
    'Assentamentos rurais e produção familiar em Mato Grosso',
    'Tecnologia de precisão nas fazendas do Centro-Norte de MT',
  ],
};

const REGIONS = ['NORTE', 'SUL', 'LESTE', 'OESTE', 'BAIXADA_CUIABANA'] as const;
const CATEGORIES = ['VIDEO', 'TEXT', 'AUDIO', 'PHOTO', 'UNIVERSITY', 'DESTAQUES_MT'] as const;
const WORK_FORMATS = ['VIDEO', 'TEXT', 'AUDIO', 'PHOTO'] as const;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCpf() {
  const d = Array.from({ length: 9 }, () => rand(0, 9));
  const d10 = (d.reduce((s, v, i) => s + v * (10 - i), 0) * 10 % 11) % 10;
  const d11 = ([...d, d10].reduce((s, v, i) => s + v * (11 - i), 0) * 10 % 11) % 10;
  return [...d, d10, d11].join('');
}

function randomPhone() {
  return `(${rand(11, 99)}) 9${rand(1000, 9999)}-${rand(1000, 9999)}`;
}

function photoUrl(seed: number, size = 200) {
  return `https://picsum.photos/seed/pessoa${seed}/${size}/${size}`;
}

function mediaImageUrl(seed: number) {
  return `https://picsum.photos/seed/obra${seed}/1280/720`;
}

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// ---------------------------------------------------------------------------
// Cognito helpers
// ---------------------------------------------------------------------------

async function deleteExistingCognitoUsers(emails: string[]) {
  for (const email of emails) {
    try {
      const { Users } = await cognito.send(new ListUsersCommand({
        UserPoolId: USER_POOL_ID,
        Filter: `email = "${email}"`,
        Limit: 1,
      }));
      const username = Users?.[0]?.Username;
      if (username) {
        console.log(`  Removendo Cognito: ${email}`);
        await cognito.send(new AdminDeleteUserCommand({ UserPoolId: USER_POOL_ID, Username: username }));
      }
    } catch {
      // sem permissão ou usuário inexistente — ignora
    }
  }
}

const CLIENT_ID = process.env['COGNITO_CLIENT_ID']!;
const CLIENT_SECRET = process.env['COGNITO_CLIENT_SECRET']!;

function secretHash(email: string) {
  return createHmac('SHA256', CLIENT_SECRET).update(`${email}${CLIENT_ID}`).digest('base64');
}

async function createCognitoUser(email: string, password: string): Promise<string> {
  let sub: string;

  try {
    const result = await cognito.send(new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      SecretHash: secretHash(email),
      UserAttributes: [{ Name: 'email', Value: email }],
    }));
    if (!result.UserSub) { throw new Error(`Falha ao criar usuário Cognito: ${email}`); }
    sub = result.UserSub;

    await cognito.send(new AdminConfirmSignUpCommand({ UserPoolId: USER_POOL_ID, Username: sub }));
    await cognito.send(new AdminUpdateUserAttributesCommand({
      UserPoolId: USER_POOL_ID,
      Username: sub,
      UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
    }));
  } catch (err: any) {
    if (err.name !== 'UsernameExistsException') { throw err; }

    const { Users } = await cognito.send(new ListUsersCommand({
      UserPoolId: USER_POOL_ID,
      Filter: `email = "${email}"`,
      Limit: 1,
    }));
    const existing = Users?.[0]?.Attributes?.find(a => a.Name === 'sub')?.Value;
    if (!existing) { throw new Error(`Usuário existe no Cognito mas sub não encontrado: ${email}`, { cause: err }); }
    sub = existing;
    console.log(`  Já existia no Cognito, reutilizando: ${email}`);
  }

  return sub;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const PUBLISH_START = new Date('2025-09-12');
const PUBLISH_END = new Date('2026-08-07');

async function main() {
  console.log('=== Limpando base de dados ===');
  await prisma.phase3Score.deleteMany();
  await prisma.phase2Score.deleteMany();
  await prisma.phase1Review.deleteMany();
  await prisma.work.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.user.deleteMany();
  console.log('Base limpa.');

  console.log('\n=== Limpando usuários staff no Cognito ===');
  await deleteExistingCognitoUsers(SEED_STAFF.map(u => u.email));

  console.log('\n=== Criando usuários staff no Cognito e no banco ===');
  const staffUsers: Record<string, Awaited<ReturnType<typeof prisma.user.create>>> = {};

  for (const staff of SEED_STAFF) {
    console.log(`  Criando: ${staff.email}`);
    const externalId = await createCognitoUser(staff.email, staff.password);
    staffUsers[staff.email] = await prisma.user.create({
      data: { externalId, email: staff.email, role: staff.role },
    });
  }

  const phase1Reviewer = staffUsers['habilitacao@aprosoja.com.br'];
  const phase2Judges = [
    staffUsers['tecnico1@aprosoja.com.br'],
    staffUsers['tecnico2@aprosoja.com.br'],
    staffUsers['tecnico3@aprosoja.com.br'],
  ];
  const phase3Judges = [
    staffUsers['institucional1@aprosoja.com.br'],
    staffUsers['institucional2@aprosoja.com.br'],
  ];

  console.log('\n=== Criando candidatos e obras ===');
  const worksAll: Awaited<ReturnType<typeof prisma.work.create>>[] = [];
  const totalCandidates = 60;

  for (let i = 0; i < totalCandidates; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
    const state = STATES[i % STATES.length];
    const city = pick(CITIES[state]);
    const category = CATEGORIES[i % CATEGORIES.length];

    const user = await prisma.user.create({
      data: {
        externalId: `seed-candidate-${String(i + 1).padStart(3, '0')}`,
        email: `candidato${i + 1}@seed.local`,
        role: 'CANDIDATE',
      },
    });

    const candidate = await prisma.candidate.create({
      data: {
        userId: user.id,
        name: `${firstName} ${lastName}`,
        cpf: randomCpf(),
        phone: randomPhone(),
        state,
        city,
        category,
        profilePhoto: photoUrl(i + 1),
        wantsMaster: Math.random() > 0.7,
      },
    });

    const worksCount = rand(1, 3);
    for (let j = 0; j < worksCount; j++) {
      const workCategory = j === 0 ? category : pick(CATEGORIES);
      const titles = WORK_TITLES[workCategory];
      const titleIndex = (i * 3 + j) % titles.length;

      const work = await prisma.work.create({
        data: {
          candidateId: candidate.id,
          title: titles[titleIndex],
          category: workCategory,
          publishedAt: randomDate(PUBLISH_START, PUBLISH_END),
          description: 'Reportagem investigativa sobre temas relevantes para o agronegócio e a cadeia produtiva de Mato Grosso, abordando aspectos técnicos, ambientais e socioeconômicos do setor.',
          status: 'SUBMITTED',
          region: workCategory === 'DESTAQUES_MT' ? pick(REGIONS) : null,
          workFormat: workCategory === 'UNIVERSITY' ? pick(WORK_FORMATS) : null,
          mediaUrl: mediaImageUrl(i * 3 + j + 100),
          declarationAuthor: true,
          declarationVehicle: true,
          declarationRules: true,
        },
      });
      worksAll.push(work);
    }
  }

  console.log(`${totalCandidates} candidatos e ${worksAll.length} obras criados.`);

  console.log('\n=== Fase 1: habilitando obras ===');
  const qualifiedWorks: typeof worksAll = [];

  for (const work of worksAll) {
    const qualified = Math.random() > 0.15;
    await prisma.phase1Review.create({
      data: {
        workId: work.id,
        reviewerId: phase1Reviewer.id,
        qualified,
        justification: qualified
          ? null
          : 'Documentação incompleta ou trabalho fora do período de publicação exigido pelo regulamento.',
      },
    });
    await prisma.work.update({ where: { id: work.id }, data: { status: qualified ? 'QUALIFIED' : 'DISQUALIFIED' } });
    if (qualified) { qualifiedWorks.push(work); }
  }

  console.log(`${qualifiedWorks.length} habilitadas, ${worksAll.length - qualifiedWorks.length} inabilitadas.`);

  console.log('\n=== Fase 2: avaliando obras qualificadas ===');
  for (const work of qualifiedWorks) {
    const selected = [...phase2Judges].sort(() => Math.random() - 0.5).slice(0, rand(1, phase2Judges.length));
    for (const judge of selected) {
      await prisma.phase2Score.create({
        data: {
          workId: work.id,
          judgeId: judge.id,
          thematicRelevance: rand(2, 5),
          newsContent: rand(2, 5),
          textQuality: rand(2, 5),
          narrativeQuality: rand(2, 5),
          aestheticQuality: rand(2, 5),
          photoRelevance: rand(2, 5),
          publicBenefit: rand(2, 5),
          sources: rand(2, 5),
          originality: rand(2, 5),
        },
      });
    }
  }

  console.log(`${qualifiedWorks.length} obras avaliadas na Fase 2.`);
  console.log('\n=== Calculando finalistas (top 10/categoria, top 5/região) ===');

  const worksWithScores = await prisma.work.findMany({
    where: { status: 'QUALIFIED' },
    select: {
      id: true, category: true, region: true,
      phase2Scores: {
        select: {
          thematicRelevance: true, newsContent: true, textQuality: true,
          narrativeQuality: true, aestheticQuality: true, photoRelevance: true,
          publicBenefit: true, sources: true, originality: true,
        },
      },
    },
  });

  const byGroup: Record<string, typeof worksWithScores> = {};
  for (const w of worksWithScores) {
    const key = w.category === 'DESTAQUES_MT' && w.region ? w.region : w.category;
    if (!byGroup[key]) { byGroup[key] = []; }
    byGroup[key].push(w);
  }

  const finalistIds: string[] = [];
  for (const [key, group] of Object.entries(byGroup)) {
    const limit = REGIONS.includes(key as typeof REGIONS[number]) ? 5 : 10;
    const sorted = group
      .map(w => ({
        id: w.id,
        total: w.phase2Scores.reduce(
          (s, sc) => s + sc.thematicRelevance + sc.newsContent + sc.textQuality +
            sc.narrativeQuality + sc.aestheticQuality + sc.photoRelevance +
            sc.publicBenefit + sc.sources + sc.originality, 0,
        ),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
    finalistIds.push(...sorted.map(w => w.id));
  }

  await prisma.work.updateMany({ where: { id: { in: finalistIds } }, data: { status: 'FINALIST' } });
  console.log(`${finalistIds.length} obras promovidas a FINALIST.`);

  console.log('\n=== Fase 3: avaliando finalistas ===');
  const finalistWorks = await prisma.work.findMany({ where: { status: 'FINALIST' }, select: { id: true } });

  for (const work of finalistWorks) {
    const selected = [...phase3Judges].sort(() => Math.random() - 0.5).slice(0, rand(1, phase3Judges.length));
    for (const judge of selected) {
      await prisma.phase3Score.create({
        data: {
          workId: work.id,
          judgeId: judge.id,
          publicImpact: rand(2, 5),
          technicalAlignment: rand(2, 5),
          informationClarity: rand(2, 5),
          chainContribution: rand(2, 5),
        },
      });
    }
  }

  console.log(`${finalistWorks.length} finalistas avaliados na Fase 3.`);

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║              LOGINS CRIADOS NO COGNITO              ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  for (const { email, password, role } of SEED_STAFF) {
    const label = role.padEnd(16);
    console.log(`║  ${label}  ${email.padEnd(32)} ${password}  ║`);
  }
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('\nCandidatos: sem login Cognito (só dados no banco para simular obras).');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
