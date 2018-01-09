const express = require("express"),
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      session = require("express-session"),
      mysql = require("./mysql"),
      crypto = require("crypto"),
      async = require("async"),  
      cipher = crypto.createCipher('aes192', 'a password'),
      app = express();


module.exports = () => {
    console.log('async module');
    let cookies = null;
    async.parallel([   
        () => {
            app.use((req,res,next) => {
                
                console.log(req.cookies.login);
                
            })
        },
        () => {}
        

    ])



    // let return_status = 0;  //返回状态
    //                         // -2 产生数据库访问异常? （可能）
    //                         // -1 不存在cookie 需要重新登录
    //                         // 0 存在cookie 但是没有成功获取权限
    //                         // 1 存在cookie  而且成功获取权限/或者本身存在session
    
    // app.use((req,res,next) => {
    //     //判断当前页面是否存在cookie
    //     if (req.cookies.login) {
    //         console.log('cookie exist');
    //         if (req.session.login) {
    //             console.log('session exist return 1');
    //             return_status = 1;
    //             return 1;
    //         } else {  
    //             console.log('session undefined connect to mysql');
    //             let decrypted = null,  //异步编程
    //                 pass = req.cookies.login.pass,
    //                 p_decipher = (str) => {  //先解密 pass 
    //                     return new Promise((resolve, reject) => {
    //                         encrypt.decipher(pass, (str) => {
    //                             decrypted = str;
    //                             resolve();
    //                         })
    //                     })
    //                 };
    //             p_decipher().then(() => {
    //                 mysql({
    //                     sql: 'select * from t_user where user_name = ? and user_pass = ?',
    //                     args: [req.cookies.login.name, decrypted],
    //                     callback: (err, info) => {
    //                         console.log(" mysql info start ------ permission.js")
    //                         console.log(err);
    //                         console.log(info);
    //                         console.log("mysql info end ----------");
    //                         if (!err) {
    //                             if (info.length) {
    //                                 req.session.login = {
    //                                     'userId': info[0].user_id,
    //                                     'admin': info[0].user_admin,
    //                                     'userName': info[0].user_name,
    //                                     'email': info[0].user_email,
    //                                     'status': info[0].user_status
    //                                 }
    //                             } else {
    //                                 console.log('按理说不应该会查询数据库错误的 ---- permission.js');
    //                                 return_status = -2;
    //                                 return -2;
    //                             }
    //                         } else {
    //                             console.log('获取管理员权限失败,数据库执行错误 getPermission.js ');
    //                             return_status = -2;
    //                             return -2;
    //                         }
    //                     } //callback
    //                 })
    //             })  //promise end
    //         }
    //     } else {
    //         console.log('cookie undefined return -1');
    //         return_status = -1;
    //         return -1;
    //     }
    // })
    
    
}


