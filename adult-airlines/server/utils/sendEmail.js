import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: { user: process.env.MAILTRAP_USER, pass: process.env.MAILTRAP_PASS },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: '"Adult Airlines" <noreply@adultairlines.com>',
      to,
      subject,
      html,
    });
    console.log("✅ Email sent to", to);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
};
