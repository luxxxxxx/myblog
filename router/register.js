const express = require("express"),
    // mysql = require("../module/mysql"),
    crypto = require("crypto"),
    send = require("../module/sendMail"),
    router = express.Router();

router.get("/",(req,res) => {
    res.render("./reg.ejs")
});

router.get("/checkCode",(req,res) => {
    res.send("gg");
    let userName =  req.query.userName
});
router.post('/sendMail',(req,res) => {
    let encode = (str) => {
        let arr = [];
        for (var i = 0; i < str.length; i++) {
            arr[i] = str.charCodeAt(i) + i;
        }
        console.log(arr)
        let string = '';
        for (let j in arr) {
            string += String.fromCharCode(arr[j]);
        }
        let encodeStr = encodeURIComponent(string);
        return encodeStr;
    },
    activeEmail = encode(req.body.email),
    mail = {
        from : "luxxxxxx <wy981236133@126.com>",
        subject : "测试2",
        // to : req.body["email"],
        to : "981236133@qq.com",
        html : "欢迎来到要优雅官方注册页面，请在三分钟内点击以下链接，以此来完成邮箱校检.</br> <a>localhost:233/reg/activeEmail?email="+ activeEmail +"</a>"
    };
    console.log(req.body.email);
    console.log(activeEmail);
    send(mail);
});
router.get("/activeEmail",(req,res) => {
    let decode = (str) => {
        let deCodeStr = decodeURIComponent(str),
            arr = [];
        console.log('decodeURIComponent=' + deCodeStr);
        for (let i = 0; i < deCodeStr.length ; i ++) {
            arr[i] = deCodeStr.charCodeAt(i) - i;
        }
        let string = '';
        for (let i in arr) {
            string += String.fromCharCode(arr[i])
        }
        return string;
    },

    email = decode(req.query.email);
    console.log(decode(req.query.email));
    res.render('activeEmailSuccess.ejs');
})


module.exports = router;


