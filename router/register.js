const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    send = require("../module/sendMail"),
    router = express.Router();

router.get("/",(req,res) => {
    res.render("./reg.ejs")
});

let decode = (str) => {  //解密
    let deCodeStr = decodeURIComponent(str),
        arr = [];
        for (let i = 0; i < deCodeStr.length ; i ++) {
            arr[i] = deCodeStr.charCodeAt(i) - i;
        }
        let string = '';
        for (let i in arr) {
            string += String.fromCharCode(arr[i])
        }
        return string;
};
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
        html : "欢迎来到要优雅官方注册页面，点击以下链接，以此来完成邮箱校检.</br> <a>localhost:233/reg/activeEmail?email="+ activeEmail +"</a>"
    };
    console.log(req.body.email);
    mysql({
        sql : 'insert into t_user_email (email,isActive) values (?,0)',
        args : [req.body.email],
        callback : function (info) {
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
    let email = decode(req.query.email);
    mysql({
        sql : 'select * from t_user_email where email = ?',
        args : [email],
        callback(err,data) {
            console.log(err);
            console.log(data);
            if (!err) {  //null 成功
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
                console.log('err+++');
                console.log(err);
            }
        }
    })
})


module.exports = router;


