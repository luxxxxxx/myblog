const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    encrypt = require("../module/encrypt"),
    upload = require('../module/multer'),
    fs = require('fs'),
    router = express.Router();

let originPass,  //用户全局加密密码
    flag1 = false,  //用于判断两个请求处理的flag
    flag2 = false, 
    newPass,  //用户新加密密码
    userName,  //用户名
    count,  //用户账号
    oldTx,
    admin,  //用户权限
    tx,  //用户头像
    sign,  //用户签名
    exp,  //用户经验
    status,  //用户身份
    userId;  //用户ID 全局


router.get('/',(req,res) => {
    console.log(req.session);
    if (!req.session.login) {  //没有登录情况下访问该页面
        console.log('its no session')
        res.locals.status = false;
        res.render('./userInfoModify.ejs');  
    } else {  //登录情况下访问页面 
        console.log('there is a session');
        res.locals.status = true;  
        userId = req.session.login.userId;  //用户ID 
        res.locals.count = req.session.login.count;  //用户账号
        console.log('userId = ' + userId); 
        mysql({
            sql: 'SELECT * FROM t_user left join t_userdata on t_user.user_id = t_userdata.ud_userId  where user_id = ?',
            args: [userId],
            callback: (err,info) => {
                console.log(info);
                if (!err) {  //查询数据库成功
                    originPass = info[0].user_pass;  //全局加密密码         
                    oldTx = info[0].ud_tx;
                    admin = info[0].user_admin;
                    exp = info[0].ud_exp;
                    status = info[0].user_status;
                    res.render('./userInfoModify.ejs');
                    
                } else { // 查询数据库失败
                    res.locals.result = info;
                    res.render('./500.ejs')              
                }
            }
        })

        res.locals.userInfo = req.session.login;  // userId  
        
    }
})


router.post('/',(req,res) => {
    const md5 = crypto.createHash("md5"),
          oPass = req.body['originPass'], 
          encrypted = md5.update(oPass).digest("hex");   //加密密码
        if (encrypted === originPass) {
            res.json({
               err : 0,
               detail: '密码正确' 
            })
        } else {
            res.json({
                err : 1,
                detail: '密码错误'
            })
        }
        // p_cipher = (params) => {   //异步  加密
        //     return new Promise((resolve, reject) => {
        //         encrypt.cipher(oPass, (params) => {
        //             encrypted = params;
        //             resolve();
        //         })
        //     })
        // };
        // p_cipher().then(() => {
        //     console.log(encrypted);
            


        // })
});


router.post('/form', (req,res) => {  //表单
    userName = req.body['userName'];
    sign = req.body['sign'];
    newPass = req.body['newPass'];
    console.log('new Pass is :+++++++++++++++++++++++++++++++++++++++++++++++++' + newPass);
    console.log(typeof(newPass));
    console.log(originPass)
    let encrypted = '',
        sql = 'UPDATE `t_userdata` SET `ud_name` = ?,`ud_sign` = ? WHERE `t_userdata`.`ud_userId` = ?;',
    args = [userName,sign,userId],
    p_cipher = (params) => {   //异步  加密
        return new Promise((resolve, reject) => {
            if (newPass === 'null') {  //如果新密码不存在，则直接使用原始密码 (注意取到的密码为字符串)
                console.log('新密码不存在')
                newPass = originPass;
                resolve();
            } else {  //如果新密码存在，加密
                console.log('新密码存在')
                let md5 = crypto.createHash("md5"),
                    encrypted = md5.update(newPass).digest("hex");
                newPass = encrypted;
                sql = 'UPDATE `t_userdata`,`t_user` SET `t_userdata`.`ud_name` = ?,`t_userdata`.`ud_sign` = ?,`t_user`.`user_pass` = ? WHERE `t_userdata`.`ud_userId` = ? ;',
                args = [userName,sign,encrypted,userId],
                console.log('新密码压缩结束:' + encrypted);
                resolve();
            }
        })
    };
    p_cipher().then(() => {  //加密之后直接注入数据库，成功返回该数据
        mysql ({
            sql: sql,
            args : args,
            callback (err ,info) {
                if (err) {
                    res.json({
                        err : 1,
                        info : info
                    })
                } else {
                    flag1 = true;
                    if (flag1 && flag2) {
                        console.log('ready to change cookies')
                        // res.cookie('login', {
                        //     name: userName,
                        //     count: count,
                        //     id: userId,
                        //     admin: admin,  //管理权限
                        //     pass: newPass,
                        //     tx: tx,  //用户头像
                        //     sign: sign,  //用户签名
                        //     exp: exp, //用户经验值
                        //     status: status
                        // }, { maxAge: 1000 * 60 * 60 * 24 });
                    }
                    res.json ({
                        err : 0,
                        info : '注入成功:' + info
                    })
                }
                // newPass,  //用户新加密密码
                // userName,  //用户名
                // admin,  //用户权限
                // tx,  //用户头像
                // sign,  //用户签名
                // exp,  //用户经验
                // status,  //用户身份
                // userId;  //用户ID 全局

                console.log(newPass,userName,admin,tx,sign,exp,status,userId);
               
            }
        })
        
    })
    
})



router.post('/tx',upload.single('touxiang'),(req,res,next) => {
    let file = req.file;
    console.log(file);
    
    mysql ({
        sql: 'UPDATE `t_userdata` SET `ud_tx` = ? WHERE `t_userdata`.`ud_userId` = ?',
        args: [file.filename,userId],
        callback: (err,info) => {
            if(err) {
                res.json({
                    err : 1,
                    info : '数据库查询失败，失败信息:' + info
                })
            } else {
                res.locals.tx = file.filename;
                tx = file.filename;
                flag2 = true;
                console.log(oldTx);
                if (oldTx == 'default.png') {  //如果老头像是默认头像
                    //不作任何操作                
                } else { 
                    fs.unlink(process.cwd() + '/public/img/user_img/' + oldTx, function (error) {
                        if (error) {
                            console.log(error);
                            return false;
                        }
                        console.log('删除文件成功');
                    })
                }

                // if (flag1 && flag2) {
                //     res.cookie('login', {
                //         name: userName,
                //         count: count,
                //         id: userId,
                //         admin: admin,  //管理权限
                //         pass: newPass,
                //         tx: tx,  //用户头像
                //         sign: sign,  //用户签名
                //         exp: exp, //用户经验值
                //         status: status
                //     }, { maxAge: 1000 * 60 * 60 * 24 });
                // }
            }
        }
    })
})

module.exports = router;

