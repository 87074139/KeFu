var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../config/config')

// smtpTransport = nodemailer.createTransport(smtpTransport({
//     service: config.config.email.smtp_server,
//     port: 25,
//     secure: false,
//     auth: {
//         user: config.config.email.smtp_username,
//         pass: config.config.email.smtp_password
//     }
// }));

let transporter = nodemailer.createTransport({
    host: config.config.email.smtp_server,
    // port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.config.email.smtp_username, // generated ethereal user
        pass: config.config.email.smtp_password // generated ethereal password
    }
});

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function (recipient, subject, html, callback) {
    
    if (!transporter) {


        let transporter = nodemailer.createTransport({
            host: config.config.email.smtp_server,
            // port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: config.config.email.smtp_username, // generated ethereal user
                pass: config.config.email.smtp_password // generated ethereal password
            }
        });
    }
    transporter.sendMail({

        from: config.config.email.smtp_username,
        to: recipient,
        subject: subject,
        html: html

    }, function (error, info) {
        if (error) {
            console.log(error);
        }
        // console.log('发送成功')
        if(info) {
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        
        callback(error, info)
    });
}

module.exports = sendMail;