const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    encrypt = require("../module/encrypt"),
    router = express.Router();

// 这个 JS 很重要， 之前出了一个玄学bug，login.js 无论如何都无法  处理 post 请求，做了很多尝试，殊不知竟然是名字出的问题，至于为什么这样至今未搞懂。真是玄学至极，为了给后面的开发人员
//说明这个JS 的重要程度，希望别看到名字是test就随便就改动,这是处理登陆信息的重要router 。！！
router.get("/",(req,res) => {  //跳转到登陆页面直接清除 cookies and session 
    res.clearCookie('login');
    req.session.destroy();
    res.render('./login.ejs');
})

router.post("/",(req,res) => {

    let userName = req.body.userName,
        passWord = req.body.passWord;
    const md5 = crypto.createHash("md5"),
        newPass = md5.update(passWord).digest("hex");
    mysql({
        sql: 'SELECT * FROM t_user left join t_userdata on t_user.user_id = t_userdata.ud_userId  where user_name = ? and user_pass = ? ',
        args : [userName,newPass],
        callback : (err,info) => {
            if (!err) {
                if (info.length) {
                    // console.log('---');
                    // console.log(info[0]);
                    // console.log('----')
                    req.session.login = {
                        'userId': info[0].user_id,
                        'admin': info[0].user_admin,
                        'userName': info[0].ud_name,
                        'count': info[0].user_name,
                        'email': info[0].user_email,
                        'status': info[0].user_status,
                        'tx': info[0].ud_tx
                    };
                    
                let encrypted = null,
                    p_cipher = (params) => {   //异步  加密
                        return new Promise((resolve, reject) => {
                            encrypt.cipher(info[0].user_pass, (params) => {
                                encrypted = params;
                                resolve();
                            })
                        })
                    };

                    p_cipher().then(() => 
                    {
                        // 1.cookie 名称  2.数据  3.过期时间
                        res.cookie('login',{ 
                            name : info[0].ud_name,
                            count : info[0].user_name,
                            id : info[0].user_id,
                            admin : info[0].user_admin,  //管理权限
                            pass : encrypted,
                            tx : info[0].ud_tx,  //用户头像
                            sign : info[0].ud_sign,  //用户签名
                            exp : info[0].ud_exp, //用户经验值
                            status : info[0].user_status
                        },{maxAge : 1000*60*60*24});
                        res.json({  //查询成功,登陆成功
                             err : 2
                        })
                    })
                } else {
                    res.json({ //用户名或者码错误
                        err : 0
                    })
                }
            } else {  //数据库查询错误
                res.json ({
                    err : 1
                })
            }
        } 
    })
})
module.exports = router;


