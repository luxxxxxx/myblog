const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
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
        sql : 'select * from t_user where user_name = ? and user_pass = ?',
        args : [userName,newPass],
        callback : (err,info) => {
            console.log(err);
            console.log(info);
            if (!err) {
                if (info.length) {
                    //1.cookie 名称  2.数据  3.过期时间
                    res.cookie('login',{name : userName},{maxAge : 1000*60*60*24});
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