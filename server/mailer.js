/* eslint-disable */
const nodemailer = require('nodemailer');

const sender = '"Trello-like" <info@trellolike.com';

function setup() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });
}

function sendConfirmationEmail(user) {
  const transport = setup();
  const url = user.generateConfirmationUrl();
  const email = {
    sender,
    to: user.email,
    subject: 'Welcome to Trellolike',
    text: `
      Welcome to Trellolike, ${user.nick}! Please, confirm your email.
    
      ${url}
    `,
  };

  return transport.sendMail(email);
}

function sendResetPasswordEmail(user) {
  const transport = setup();
  const email = {
    sender,
    to: user.email,
    subject: 'Reset Password',
    text: `
      To reset password follow this link
    
      ${user.generateResetPasswordLink()}
    `,
  };

  transport.sendMail(email);
}

module.exports = {
  sendConfirmationEmail,
  sendResetPasswordEmail,
}
