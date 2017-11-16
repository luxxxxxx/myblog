const express = require("express"),
    // mysql = require("../module/mysql"),
    crypto = require("crypto"),
    send = require("../module/sendMail"),
    router = express.Router();

router.get("/",(req,res) => {
    res.render("./reg.ejs")
});

router.post('/sendMail',(req,res) => {
    let mail = {
        from : "luxxxxxx <wy981236133@126.com>",
        subject : "测试2",
        // to : req.body["email"],
        to : "1933521558@qq.com",
        html : "哇啊啊啊啊 啊"
    };
    send(mail);
})

module.exports = router;


