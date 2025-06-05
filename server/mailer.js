const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testrahulmail@gmail.com',
    pass: 'hscvuidvpnqwrtlb',
  },
});

module.exports = transporter;
