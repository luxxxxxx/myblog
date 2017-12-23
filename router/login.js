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
        sql: 'SELECT * FROM t_user left join t_userdata on t_user.user_id = t_userdata.ud_userId  where t_user.user_id = ? and t_user.user_pass = ? ',
        args : [userName,newPass],
        callback : (err,info) => {
            console.log(info);
            if (!err) {
                if (info.length) {
                    console.log(info[0].user_pass)
                    // 1.cookie 名称  2.数据  3.过期时间
                    res.cookie('login',{ 
                        name : userName,
                        id : info[0].user_id,
                        admin : info[0].user_admin,  //管理权限
                        pass : encrypt.encode(info[0].user_pass)
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