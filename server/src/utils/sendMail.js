const nodemailer = require('nodemailer');
const ApiError = require('./ApiError');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMail = async (to, subject, html) => {

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html
    });

  } catch (error) {
    throw ApiError.serverError(`Failed to send email \n ${error}`);
  }

};

module.exports = sendMail;
