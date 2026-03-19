import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { render } from '@react-email/render';
import { env } from '~/config/env';
import { VerifyEmailTemplate } from '~/emails/templates/VerifyEmailTemplate';

const sesClient = new SESv2Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_ACCESS_SECRET_KEY,
  },
});

export class EmailGateway {
  async sendVerifyEmail({ to, code }: EmailGateway.SendVerifyEmailParams): Promise<void> {
    const html = await render(VerifyEmailTemplate({ code }));

    const command = new SendEmailCommand({
      FromEmailAddress: env.SES_EMAIL_FROM,
      Destination: { ToAddresses: [to] },
      Content: {
        Simple: {
          Subject: { Data: 'Verifique seu e-mail — Prêmio Aprosoja MT 2026' },
          Body: { Html: { Data: html } },
        },
      },
    });

    await sesClient.send(command);
  }
}

export namespace EmailGateway {
  export type SendVerifyEmailParams = { to: string; code: string };
}
