// // utils/sendEmail.js
// const nodemailer = require('nodemailer');
// const sendEmail = async (to, subject, text) => {
//   let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });
//   await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
// };
// module.exports = sendEmail;

const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif;">
        <h3>${subject}</h3>
        <p>${text.replace(/\n/g, '<br>')}</p>
        <hr />
        <small>This is an automated email from the Logsheet System.</small>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: htmlTemplate
    });
  } catch (err) {
    console.error('Email send error:', err);
  }
};

module.exports = sendEmail;
