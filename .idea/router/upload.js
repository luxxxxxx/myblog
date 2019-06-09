const express = require("express"),
      mysql = require("../module/mysql"),
      crypto = require("crypto"),
      encrypt = require("../module/encrypt"),
      router = express.Router();

router.get("/", (req, res) => {
    let page = req.query.page - 1 || 0,
        count; //数据量
    mysql({
        sql: 'select a_id,a_title,a_views from t_article order by a_id desc',
        args: [],
        callback: (err, info) => {
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


router.post('/files',(res,req) => {
    
})

module.exports = router;

