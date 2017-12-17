const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    encrypt = require("../module/encrypt"),
    // sd = require("silly-datetime"),
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
            if (!err) { 
                res.locals.dm_load = true;  //加载弹幕成功
                res.locals.dm = info;
            } else {
                res.locals.dm_load = false;  //加载弹幕失败
            }
            res.render("play");
        }
    })
})


router.post("/dm",(req,res) => {
    let content = req.body['content'],
        time = req.body['crt_time'],  //当前播放时间
        color = req.body['color'],
        size = req.body['size'],
        type = req.body['type'];
        
    mysql ({
        sql: "INSERT INTO `t_dm` (`d_content`, `d_userId`, `d_time`, `d_sendTime`, `d_type`, `d_color`, `d_size`) VALUES (?,?,?,sysdate(),?,?,?);",
        args: [content, 12 ,time , type , color , size],
        callback : (err,info) => {
            console.log(err);
            console.log(info)
            if (!err) {
                res.json({
                    err : 0,
                    info : content
                })
            } else {
                res.json ({
                    err : 1,
                    info : '后台数据库查询失败,请刷新后再试'
                })
            }
        }
    })
})


router.post("/get_dm",(req,res) => {
    mysql({
        sql : 'select * from t_dm',
        args : [],
        callback : (err,info) => {
            if (!err) {
                res.json({
                    err : 0,
                    info : info
                });
            } else { 
                res.json({
                    err : 1,
                    info : '数据库查询错误,弹幕获取失败'
                });
            }
        }
    })
})


module.exports = router;