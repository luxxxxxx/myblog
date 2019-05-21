const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    encrypt = require("../module/encrypt"),
    router = express.Router();


router.get("/", (req, res) => {  //跳转到登陆页面直接清除 cookies and session 
    res.render('./test.ejs');
})



module.exports = router;


