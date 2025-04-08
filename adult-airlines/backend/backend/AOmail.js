require('dotenv').config();
const nodemailer = require('nodemailer');

//create transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});

//Function to send email
function sendEmail(to, subject, text) {
    const mailOptions = {
        from: '"Adult Airlines" <no-reply@adultairlines.com>',
        to: to, //recepient email
        subject: subject, // Subject line
        text: text //Body text
    };


    return transporter.sendMail(mailOptions);

}

module.exports = { sendEmail };