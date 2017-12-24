const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    // sd = require("silly-datetime"),
    router = express.Router();


router.get("/",(req,res) => {
    let cookie = req.cookies.login,
        source_id = req.query.source;
        console.log(source_id);
    mysql ({
        sql : 'select * from t_article where a_id = ?',
        args : [source_id],
        callback : (err , info) => {
            console.log(err);
            console.log(info)
            if (!err) {
                if (info.length) { //存在视频
                    res.locals.err_info = 0,
                    res.locals.data = info[0];
                    res.render('play.ejs');
                    mysql ({   //增加 观看次数
                        sql : 'update t_article set a_views = a_views + 1',
                        args : [],
                        callback : (err,info) => {
                            if (!err) {
                                console.log('增加观看人数操作成功');
                            } else {
                                console.log('增加观看次数操作失败')
                            }
                        }
                    })
                } else {
                    res.render('404.ejs');
                }
            } else {
                res.render('500.ejs');
            }
        }
    })
    console.log(req.session.login)
    res.locals.user = req.session.login;
})


router.post("/dm",(req,res) => {
    let content = req.body['content'],
        time = req.body['crt_time'],  //当前播放时间
        color = req.body['color'],
        size = req.body['size'],
        userId = req.session.login['userId'],
        type = req.body['type'];
        
    mysql ({
        sql: "INSERT INTO `t_dm` (`d_content`, `d_userId`, `d_time`, `d_sendTime`, `d_type`, `d_color`, `d_size`) VALUES (?,?,?,sysdate(),?,?,?);",
        args: [content, userId ,time , type , color , size],
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