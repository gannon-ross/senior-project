import express from "express";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        await sendEmail({
            to: "your@email.com",
            subject: "Test Email from Adult Airlines",
            html: "<h2>This is a test email sent via Mailtrap and Nodemailer </h2>"
        });

        res.status(200).json({message: "Email sent successfully"});
    } catch (error) {
        console.error("Failed to send test email:", error);
        res.status(500).json({ error: "Failed to send test email"});
    }
    });

export default router;


   