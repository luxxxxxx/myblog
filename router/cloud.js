const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    encrypt = require("../module/encrypt"),
    fs = require("fs"),
    multipart = require("multipart"),
    multer = require ("multer"),
    router = express.Router();


let form = new multipart.Form()

router.get ('/',(req,res) => {
    res.render ('cloud.ejs');
})




router.post ('/',(req,res) => {
    let name = req.body.name,
        pass = req.body.pass;
        
        const md5 = crypto.createHash("md5"),
        newPass = md5.update(pass).digest("hex");
        req.session.uploadFlag = false;  //不能上传
        console.log(req.session.uploadFlag);
        mysql ({
            sql : `SELECT * FROM t_user where user_name = ? and user_pass = ?`,
            args : [name,newPass],
            callback : (err,info) => {  
                console.log(err);
                if (!err) {  //success
                    req.session.uploadFlag = true;  //可以上传
                    console.log('_______','查询成功');
                    console.log(info,info.length);
                    if (info.length) {
                        res.json ({
                            err : 0,
                            info : '查询成功，权限正确'
                        })                        
                    } else {
                        res.json ({
                            err : 1,
                            info : '账号密码错误'
                        })
                    }
                } else {
                    console.log('input err')
                    res.json ({
                        err : 1,
                        info : '服务器发生错误，请及时联系站长'
                    })
                }
            }
        }) 
})




router.post ('/file', (req,res) => {
    console.log(req.session.uploadFlag);
    console.log(req.body.file);
})



module.exports = router;