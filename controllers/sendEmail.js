require('dotenv').config();
const nodemailer = require('nodemailer');

let sendEmail = (to, subject, content) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: process.env.EMAIL,
        to: [to],
        subject: subject,
        text: subject,
        html: `<b>${content}</b>`
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return false;
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return true;
    });

}
module.exports = sendEmail;