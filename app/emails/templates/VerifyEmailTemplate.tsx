import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { logoAprosoja } from '../assets/logoAprosoja';

interface VerifyEmailTemplateProps {
  code: string;
}

export function VerifyEmailTemplate({ code }: VerifyEmailTemplateProps) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>Seu código de verificação do Prêmio Aprosoja MT 2026</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Img
              src={logoAprosoja}
              alt="Aprosoja Mato Grosso"
              width="200"
              style={styles.logo}
            />
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.eyebrow}>Verificação de e-mail</Text>
            <Heading style={styles.heading}>
              Confirme o seu e-mail para concluir o cadastro.
            </Heading>
            <Text style={styles.body2}>
              Use o código abaixo para verificar seu endereço de e-mail. Ele é
              válido por 24 horas.
            </Text>

            {/* Code box */}
            <Section style={styles.codeBox}>
              <Text style={styles.code}>{code}</Text>
            </Section>

            <Text style={styles.disclaimer}>
              Não solicitou este e-mail? Ignore esta mensagem. Nenhuma ação será
              tomada.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Aprosoja MT — Associação dos Produtores de Soja e Milho do Estado
              do Mato Grosso
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

VerifyEmailTemplate.PreviewProps = {
  code: '144833',
} satisfies VerifyEmailTemplateProps;

export default VerifyEmailTemplate;

const styles = {
  body: {
    backgroundColor: '#f5f5f0',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    margin: 0,
    padding: '32px 0',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    maxWidth: '480px',
    margin: '0 auto',
    overflow: 'hidden' as const,
  },

  // Header
  header: {
    backgroundColor: '#ffffff',
    padding: '32px 40px 24px',
    textAlign: 'center' as const,
    borderBottom: '1px solid #e8f0ea',
  },
  logo: {
    display: 'block' as const,
    margin: '0 auto',
  },

  // Content
  content: {
    padding: '40px 40px 32px',
  },
  eyebrow: {
    color: '#1a6e34',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
    margin: '0 0 12px',
  },
  heading: {
    color: '#111111',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '1.4',
    margin: '0 0 16px',
  },
  body2: {
    color: '#555555',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0 0 28px',
  },

  // Code box
  codeBox: {
    backgroundColor: '#f0f7f3',
    borderRadius: '6px',
    border: '1px solid #c8e3d0',
    margin: '0 0 24px',
    padding: '4px 0',
    textAlign: 'center' as const,
  },
  code: {
    color: '#1a6e34',
    fontSize: '36px',
    fontWeight: '800',
    letterSpacing: '8px',
    lineHeight: '1',
    margin: '16px 0',
  },

  disclaimer: {
    color: '#999999',
    fontSize: '13px',
    lineHeight: '1.5',
    margin: 0,
  },

  // Footer
  footer: {
    borderTop: '1px solid #eeeeee',
    padding: '20px 40px',
  },
  footerText: {
    color: '#aaaaaa',
    fontSize: '11px',
    lineHeight: '1.5',
    margin: 0,
    textAlign: 'center' as const,
  },
};
