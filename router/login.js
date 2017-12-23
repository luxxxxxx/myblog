const express = require("express"),
        mysql = require("../module/mysql"),
        crypto = require("crypto"),
        encrypt = require("../module/encrypt"),
        router = express.Router();



router.get("/",( req, res ) => {
    res.render("./login.ejs")
});



router.post('/',(req,res) => {
    let userName = req.body.userName,
        passWord = req.body.passWord;
    const md5 = crypto.createHash("md5"),
          newPass = md5.update(passWord).digest("hex");
    mysql({
        sql: 'SELECT * FROM t_user left join t_userdata on t_user.user_id = t_userdata.ud_userId  where user_name = ? and user_pass = ? ',
        args : [userName,newPass],
        callback : (err,info) => {
            console.log(err)
            console.log(info);
            if (!err) {
                if (info.length) {
                    req.session.login = {
                        'userId': info[0].user_id,
                        'admin': info[0].user_admin,
                        'userName': info[0].user_name,
                        'email': info[0].user_email,
                        'status': info[0].user_status
                    }
                    // 1.cookie 名称  2.数据  3.过期时间
                    res.cookie('login',{ 
                        name : info[0].ud_name,
                        id : info[0].user_id,
                        admin : info[0].user_admin,  //管理权限
                        pass : encrypt.encode(info[0].user_pass),
                        tx : info[0].ud_tx,  //用户头像
                        sign : info[0].ud_sign,  //用户签名
                        exp : info[0].ud_exp, //用户经验值
                        status : info[0].user_status
                    },{maxAge : 1000*60*60*24});
                    res.json({  //查询成功,登陆成功
                         err : 2
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