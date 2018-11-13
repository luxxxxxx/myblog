const express = require("express"),
      mysql = require("../module/mysql"),
      encrypt = require("../module/encrypt"),
      send = require("../module/sendMail"),
      crypto = require("crypto"),
      router = express.Router();


router.get("/", (req, res) => {
    let page = req.query.page - 1 || 0,
        count;  //数据量
    mysql ({
        sql : 'select a_id,a_title,a_views from t_article order by a_id desc',
        args : [],
        callback : (err,info) => {
            if (!err) {
                res.locals.totalArticles = info;
                count = info.length;
                mysql({
                    sql: 'select user_id,user_name,a_id,a_title,a_tags,a_type,a_desc,a_views,a_link,a_date,a_cover from t_article left join t_user on t_user.user_id = t_article.a_upId order by a_id desc limit ?,4',
                    args: [page * 4],
                    callback: (err, info) => {
                        if (!err) {
                            res.locals.articles = info;
                            res.locals.totalPage = count;
                            res.locals.page = page + 1;
                            res.render('techo');
                        } else {
                            res.locals.result = '500 服务器发生了一个无法预料的问题,请联系网站管理员，QQ 981236133';
                            res.status(500).render('500');
                        }
                    }
                })
            } else {
                res.locals.result = '500 服务器发生了一个无法预料的问题,请联系网站管理员，QQ 981236133';
                res.status(500).render('500');
            }
            

        }
    })

    
    // res.locals.articles  = {};
});

router.post("/login",(req,res) => {
    let userName = req.body["userName"],
        passWord = req.body["passWord"];
    const md5 = crypto.createHash("md5"),
          newPass = md5.update(passWord).digest("hex");
    mysql ({
        sql: 'SELECT * FROM t_user left join t_userdata on t_user.user_id = t_userdata.ud_userId  where user_name = ? and user_pass = ?',
        args : [userName,newPass],
        callback : (err,info) => {
            if (!err) {
                if (info.length) {
                    req.session.login = {
                        'userId': info[0].user_id,
                        'admin': info[0].user_admin,
                        'userName': info[0].user_name,
                        'email': info[0].user_email,
                        'status': info[0].user_status
                    }
                    let encrypted = null,
                        p_cipher = (params) => {   //异步  加密
                            return new Promise((resolve, reject) => {
                                encrypt.cipher(info[0].user_pass, (params) => {
                                    encrypted = params;
                                    resolve();
                                })
                            })
                        };
                    p_cipher().then(() => {
                        res.cookie('login', {
                            name: info[0].user_name,
                            id: info[0].user_id,
                            admin: info[0].user_admin,  //管理权限
                            pass: encrypted,
                            tx: info[0].ud_tx,  //用户头像
                            sign: info[0].ud_sign,  //用户签名
                            exp: info[0].ud_exp, //用户经验值
                            status: info[0].user_status
                        }, { maxAge: 1000 * 60 * 60 * 24 });
                        res.json({
                            success : 1,
                            info : '登陆成功,如果网页没有刷新请手动刷新'
                        });
                    })
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


