// test-mail.js
const { sendEmail } = require('./AOmail');

sendEmail('youremail@example.com', 'Test Email from Adult Airlines', 'This is a test sent through Mailtrap!')
  .then(info => {
    console.log('✅ Email sent:', info.response);
  })
  .catch(err => {
    console.error('❌ Error sending email:', err);
  });
