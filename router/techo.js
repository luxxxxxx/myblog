const express = require("express"),
      mysql = require("../module/mysql"),
      encrypt = require("../module/encrypt"),
      send = require("../module/sendMail"),
      crypto = require("crypto"),
      router = express.Router();



router.get("/", (req, res) => {
    res.render("techo.ejs");
});

router.post("/login",(req,res) => {
    let userName = req.body["userName"],
        passWord = req.body["passWord"];

    const md5 = crypto.createHash("md5"),
          newPass = md5.update(passWord).digest("hex");
    mysql ({
        sql : 'select * from t_user where user_name = ? and user_pass = ?',
        args : [userName,newPass],
        callback : (err,info) => {
            if (!err) {
                if (info.length) {
                    res.cookie('login', {
                        name: userName,
                        id: info[0].user_id,
                        admin: info[0].user_admin,  //管理权限
                        pass: encrypt.encode(info[0].user_pass)
                    }, { maxAge: 1000 * 60 * 60 * 24 });
                    res.json({
                        success : 1,
                        info : '登陆成功,如果网页没有刷新请手动刷新'
                    });
                } else {
                    res.json({
                        success : 0,
                        info : '用户名密码错误'
                    })
                }
            } else {
                res.json({
                    success : 0,
                    info : '数据库查询出错,请联系管理员'
                })
            }
            
        }
    })
})


module.exports = router;


