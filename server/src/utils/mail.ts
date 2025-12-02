import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.warn(
    "Warning: SMTP config missing. OTP emails will fail until SMTP env vars are set."
  );
}

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}
