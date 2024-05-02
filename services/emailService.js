const nodemailer = require('nodemailer');

require('dotenv').config();

const config = {
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.API_KEY,
  },
};
const transporter = nodemailer.createTransport(config);

async function sendEmail(userEmail, verificationToken) {
const info = await transporter.sendMail({
  from: 'elektryk.pruszkow@onet.pl',
  to: userEmail,
  subject: 'verification',
  text: `Please click the following link to verify your email http://localhost:3000/users/verify/${verificationToken}`,

});
console.log('Message sent: %s', info.messageId);
}

module.exports = {
  sendEmail
}
