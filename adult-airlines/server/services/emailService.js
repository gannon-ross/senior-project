import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  /**
   * Send verification email with code
   * @param {string} to - Recipient email
   * @param {string} firstName - Recipient's first name
   * @param {string} verificationCode - Email verification code
   * @returns {Promise<boolean>} - True if email sent successfully
   */
  async sendVerificationEmail(to, firstName, verificationCode) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: 'Adult Airlines - Verify Your Email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">Welcome to Adult Airlines!</h2>
            <p>Hello ${firstName},</p>
            <p>Thank you for registering with Adult Airlines. To complete your registration, please verify your email address by entering the verification code below:</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
              <strong>${verificationCode}</strong>
            </div>
            <p>This code will expire in 24 hours.</p>
            <p>If you did not request this verification, please ignore this email.</p>
            <p>Best regards,<br>The Adult Airlines Team</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }
  }
}

export default new EmailService();
