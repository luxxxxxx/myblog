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
    let mail = {
        from : "luxxxxxx <wy981236133@126.com>",
        subject : "测试2",
        // to : req.body["email"],
        to : "981236133@qq.com",
        html : "欢迎来到要优雅官方注册页面，请点击以下链接，完成邮箱校检.</br> <a>www.</a>"
    };
    send(mail);
})

router.get()
module.exports = router;


