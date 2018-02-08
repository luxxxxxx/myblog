const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    // sd = require("silly-datetime"),
    router = express.Router();


router.get("/",(req,res) => {
    let cookie = req.cookies.login,
        source_id = req.query.source,
        F_article = false,  //两个flag 
        F_comment = false;
    
    mysql ({
        sql : 'select * from t_article where a_id = ?',
        args : [source_id],
        callback : (err , info) => {
            if (!err) {
                if (info.length) { //存在视频
                    res.locals.err_info = 0,
                    res.locals.data = info[0];
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

                    mysql({
                        sql: 'select * from t_cm left join t_userdata on t_cm.cm_userId = t_userdata.ud_userId order by cm_id desc limit 8',
                        args: [],
                        callback: (err, info) => {
                            console.log('???????')
                            console.log(info)
                            if (!err) {  //获取评论成功
                                res.locals.cm = info;
                            } else {
                                res.locals.cm = false;  //获取评论失败
                            }
                            res.render('play.ejs');
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
    


})

router.post("/d_dm" , (req,res) => {  //删除弹幕
    if (req.session.login) {
        let dm_id = req.body['id'],
            rights = req.session.login.admin;
            if (rights > 1) {
                mysql({
                    sql : 'delete from t_dm where d_id = ?',
                    args : [req.body.id],
                    callback : (err , info) => {
                        console.log(err);
                        console.log(info);
                        if(!err) {
                            console.log('success')
                            res.json ({
                                err : 0,
                                info : '删除操作成功'
                            })
                        } else {
                            res.json ({
                                err : 1,
                                info : '删除操作失败,数据库执行错误'
                            })
                        }
                    }
                })
            } else {
                res.json({
                    err : 1,
                    info : '删除操作失败,你没有获得管理员权限'
                })
            }
    } else {
        res.json({
            err: 1,
            info: '请用管理员身份登录登录'
        })
    }
    
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
        sql: 'select * from t_dm order by d_id desc limit 100',  //获取最新100条弹幕
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


router.post("/cm_send" , (req,res) => {
    if (req.session.login) {
        let content = req.body['content'],
            source_id = req.body['source_id'],
            user_id = req.session.login.userId,
            type = req.body['type'];
        

        mysql ({
            sql : 'INSERT INTO `t_cm` (`cm_userId` , `cm_content` , `cm_date` , `cm_vId`) VALUES (?,?,sysdate(),?)',
            args : [user_id,content,(type + source_id)],
            callback : (err,info) => {
                console.log(err);
                if (!err) {
                    res.json ({
                        err : 0,
                        info : '发送评论成功'
                    })
                    console.log('发送评论成功，发送评论用户名' + req.session.login.userName)
                } else {
                    console.log('发送评论失败，数据库查询错误');
                    res.json ({
                        err : 1,
                        info : '发送评论失败，数据库查询错误'
                    })
                }
            }
        })
        
    } else {
        res.json = {
            err : 1,
            info : '500 服务器产生了一个错误'
        }
    }

    
})


router.get('/get_cm', (req,res) => {
    mysql({
        sql: 'select * from t_cm left join t_userdata on t_cm.cm_userId = t_userdata.ud_userId order by cm_id desc limit 8',
        args: [],
        callback: (err, info) => {
            if (!err) {  //获取评论成功
                res.locals.cm = info;
            } else {
                res.locals.cm = false;  //获取评论失败
            }
            res.render('comment.ejs');
        }
    
    })
})



module.exports = router;