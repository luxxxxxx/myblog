const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    encrypt = require("../module/encrypt"),
    router = express.Router();



router.get("/",(req,res) => {
    let cookie = req.cookies.login;
    console.log(cookie);
    if (!cookie) {
        res.locals.login = cookie;
    }
    mysql({
        sql : 'select * from t_dm',
        args : [],
        callback : (err,info) => {
            console.log(info);
            if (!err) {  //
                res.locals.dm_load = true;  //加载弹幕成功
                res.locals.dm = info;
            } else {
                res.locals.dm_load = false;  //加载弹幕失败

            }
            res.render("play");
        }
    })


    

})










module.exports = router;