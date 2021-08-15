var nodemailer = require('nodemailer');
const Email = require('email-templates');

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    auth: {
        user: 'apikey',
        pass: process.env.EMAIL_API_KEY
    }
});

const emailConfig = new Email({
    message: {
        from: process.env.FROM_EMAIL
    },
    send: process.env.EMAIL_SEND_DEBUG === 'true' || process.env.NODE_ENV === 'production',
    transport: transporter
});

module.exports = { emailConfig };