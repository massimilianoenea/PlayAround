var nodemailer= require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'playaround.notreply@gmail.com',
        pass: 'playaround-1'
    }
});

module.exports = {
    SetmailOptions : function (destinatario,url,tok) {
        var mailOptions = {
            from: 'playaround.notreply@gmail.com',
            to: destinatario,
            subject: 'Sending Email using Node.js',
            text: 'Questo è il tuo link di registrazione: '+url+"/confirm_registration/" +tok
        };
        return mailOptions;
    },

    sendMail : function (mailOptions) {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
};
