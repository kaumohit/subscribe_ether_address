const nodemailer = require('nodemailer');

let sendEmail = (to, subject, content) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'swiggyorderkarunga@gmail.com', // generated ethereal user
            pass: 'mohit@1996'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'swiggyorderkarunga@gmail.com', // sender address
        to: [to], // list of receivers
        subject: subject,
        text: subject, // plain text body
        html: `<b>${content}</b>` // html body
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