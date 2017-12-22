const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    send = require("../module/sendMail"),
    encrypt = require("../module/encrypt"),
    router = express.Router();

router.get("/",(req,res) => {
    res.render("./reg.ejs")
});

// let decode = (str) => {  //解密
//     try {
//         let deCodeStr = decodeURIComponent(str),
//             arr = [];
//         for (let i = 0; i < deCodeStr.length ; i ++) {
//             arr[i] = deCodeStr.charCodeAt(i) - i;
//         }
//         let string = '';
//         for (let i in arr) {
//             string += String.fromCharCode(arr[i])
//         }
//         return string;
//     } catch (e) {
//         return 'err'
//     }
// };
// router.get("/checkCode",(req,res) => {  
//     res.send("gg");
//     let userName =  req.query.userName;
// });
router.post('/sendMail',(req,res) => {  //发送邮件
    let activeEmail = encrypt.encode(req.body.email),
        email = req.body.email,
    mail = {
        from : "luxxxxxx <wy981236133@126.com>",
        subject : "要优雅的注册",
        // to : req.body["email"],
        to : email,
        html: "<h1>点击链接激活邮箱</h1><br />欢迎来到要优雅官方注册页面，点击以下链接，以此来完成邮箱校检.</br> <a>http://111.231.196.109:233/reg/activeEmail?email="+ activeEmail +"</a>"
    };
    console.log(email);
    mysql({
        sql : 'insert into t_user_email (email,isActive) values (?,0)',
        args : [email],
        callback : function (err,info) {
            console.log(err);
            console.log(info);
            if (info) {
                //这里需要验证 邮箱是否已经被激活以及使用, sql 需要判断 是否 输入的email 在 user_email 表里面，如果在 （err）情况 就 不执行数据库操作 ,直接发送邮件.
                // res.send('数据库表email嵌入发生错误  -- 56\n' + info ); //Duplicate  重复
                if (/\bDuplicate\b/.test(info)) {
                    send(mail);
                } else {
                    res.send('err');
                }
            } else {
                send(mail);
            }
        }
    })
});

router.get("/activeEmail",(req,res) => {
    let email = encrypt.decode(req.query.email);
    mysql({
        sql : 'select * from t_user_email where email = ?',
        args : [email],
        callback(err,data) {
            if (!err) {  //null 成功
                if (data.length) {
                    if (!data[0].isActive) {
                        mysql({
                            sql : 'update t_user_email set isActive = 1 where t_user_email.email = ?',
                            args : [email],
                            callback(err,info) {
                                if (err) {  //失败
                                    res.render('email_callback.ejs',{data : '更新数据库发生未知错误，请联系网站管理员email:981236133@qq.com'})
                                } else {
                                    res.render('email_callback.ejs',{data : '恭喜！你的邮箱激活成功!请返回注册界面完成注册~'});
                                }
                            }
                        })
                    } else {
                        res.render('email_callback.ejs',{data : '你的邮箱已经处于激活状态~'});

                    }
                } else {
                    res.render('email_callback.ejs',{data : '请按流程在注册页面注册!小孩子别捣乱'});
                }
            } else {
                res.render('email_callback.ejs',{data : '激活邮箱失败,数据库操作发生错误,请重新发送邮件'});
            }
        }
    })
})
router.post ('/vertifyUserName',(req,res) => {
    let userName = req.body.userName;
    mysql({
        sql : 'select * from t_user where user_name = ?',
        args : [userName],
        callback : (err,data) => {
            if (!err) {
                if (data.length) {  //用户名重复
                    res.json({
                        err : 0,
                        status : 0
                    });
                } else {  //可用
                    res.json({
                        err : 0,
                        status : 1
                    });
                };
            } else {  //数据库查询发生错误
                res.json ({
                    err : 1,
                    status : 0
                })
            };
        }
    })
})
router.post ('/vertifyEmail',(req,res) => {
    let email = req.body.email;
    mysql ({
        sql : 'select * from t_user where user_email = ?',
        args : [email],
        callback : (err,data) => {
         
            if (!err) {
                if (data.length === 1) {
                    res.json({
                        err : 0,
                        status : "0"
                    })
                } else {
                    res.json({
                        err : 0,
                        status : '1'
                    })
                }
            } else {
                res.json({
                    err : 1,
                    status : '0'
                })
            }
        }
    })
})

router.post('/register',(req,res) => {
    let userName = req.body.userName,
        passWord = req.body.passWord,
        email = req.body.email;
    const md5 = crypto.createHash("md5"),
            newPass = md5.update(passWord).digest("hex");
    mysql ({
        sql : 'SELECT * FROM `t_user_email` WHERE `email` = ?',
        args : [email],
        callback : (err,data) => {
            if (!err) {
                if (data.length) {
                    if (Number(data[0].isActive)) {
                        mysql({
                            sql : 'INSERT INTO `t_user` (`user_id`, `user_name`, `user_pass`, `user_email`) VALUES (NULL,?,?,?);',
                            args : [userName,newPass,email],
                            callback : (err,data) => {
                                if (!err) {
                                    res.json({
                                        err : 0,
                                        info : '注册成功。'
                                    });
                                } else {
                                    res.json({
                                        err : 1,
                                        info : '用户信息插入数据库失败。'
                                    });
                                };
                            }
                        })
                    } else {
                        res.json ({
                            err : 1,
                            info : '邮箱未激活,请先激活邮箱。'
                        })
                    }
                } else {
                    res.json({
                        err : 1,
                        info : '请先进行邮箱验证。'
                    })
                }

            } else {
                res.json ({
                    err : 1,
                    info : '用户邮箱激活验证失败。'
                })
            }
        }
    })
})


module.exports = router;


