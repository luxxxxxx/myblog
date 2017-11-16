let nodemailer = require("nodemailer");

let config = {
    host : "smtp.126.com",
    port : 25,
    auth : {
        user : "wy981236133@126.com",
        pass : "ljh5001131"
    }
}

let transporter = nodemailer.createTransport(config);

module.exports = function (mail) {
    transporter.sendMail(mail, function (err,info) {
        if (err) {
            return console.log(err)
        }
        console.log("mail send:",info.response)
    })
}


