import nodemailer from 'nodemailer';
import { env } from '../config/env';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }: MailOptions): Promise<void> => {
  if (!env.SMTP_USER || env.SMTP_USER === 'your@email.com') {
    console.warn(`⚠️ Email simulé (SMTP non configuré) pour : ${to}`);
    return;
  }
  
  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
  }
};

export const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const link = `${env.APP_URL}/verify-email?token=${token}`;
  console.log(`\n🔗 [DEV] Lien de vérification pour ${to} : ${link}\n`);
  
  await sendEmail({
    to,
    subject: '✅ Vérifiez votre compte DebaFoot',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #fff; padding: 40px; border-radius: 12px;">
        <h1 style="color: #16D554;">⚽ Bienvenue sur DebaFoot !</h1>
        <p>Merci de vous être inscrit. Cliquez sur le bouton ci-dessous pour vérifier votre compte :</p>
        <a href="${link}" style="display: inline-block; background: #16D554; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
          Vérifier mon compte
        </a>
        <p style="color: #666; font-size: 14px;">Ce lien expire dans 24h. Si vous n'avez pas créé de compte, ignorez cet email.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (to: string, token: string): Promise<void> => {
  const link = `${env.APP_URL}/reset-password?token=${token}`;
  await sendEmail({
    to,
    subject: '🔒 Réinitialisation de votre mot de passe DebaFoot',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #fff; padding: 40px; border-radius: 12px;">
        <h1 style="color: #16D554;">🔒 Réinitialisation du mot de passe</h1>
        <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${link}" style="display: inline-block; background: #16D554; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
          Réinitialiser mon mot de passe
        </a>
        <p style="color: #666; font-size: 14px;">Ce lien expire dans 1h. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      </div>
    `,
  });
};
