const http = require("http"),
    express = require("express"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    mysql = require("./module/mysql"),
    encrypt = require("./module/encrypt"),
    app = express();

app.set('views',__dirname+'/views');// 设置模板引擎的目录
app.set('view engine','ejs');// 设置使用的模板引擎是什么
app.use(express.static(__dirname+'/public'));// 设置静态资源目录 js img  css

app.use(bodyParser.json());// 用来接收json的数据
// extended:true 可以接收任何数据类型的数据


// app.use( session ({
//     secret : 'testapp',
//     cookie : {maxAge:80000},
//     resave: false,
//     saveUninitialized
// }))


app.use(bodyParser.urlencoded( { extended:true } ));
app.use(cookieParser("sakldlsadlhjkhjksadhjk"));
app.use(session( { secret : "sadaskhdasuusadhuisduixb" } ));  //设置秘钥



app.use ((req,res,next) => {
    if(req.cookies['login']) {
        let cookies = req.cookies['login'];
        // res.locals.login.pass = req.cookies.login.pass;
        // res.locals.login.userName = req.cookies.login.name;
        // console.log(res.locals.login);
    } else {
        res.locals.login = null;
    }
    next();
})

app.use ((req,res,next) => {
    console.log('step1');
    if (req.cookies.login) {  //存在cookie 但是不存在session 的情况下，
                             //根据cookie里面的存放的用户名以及用户密码(加密后的)
                             //从数据库里面获取管理员权限 但凡获取失败 ,需要使用管理员权限的时候
                             //必须重新进行登录
        console.log('step2');
        console.log(req.session.login);
        if (!req.session.login) {
            console.log('session deny');
            let cookies = req.cookies.login;
            mysql({
                sql : 'select * from t_user where user_name = ? and user_pass = ?',
                args : [cookies.name,encrypt.decode(cookies.pass)],
                callback : (err,info) => {
                    console.log('获取session执行数据库操作ing')
                    if (!err) {
                        if (info.length) {
                            req.session.login = {
                                'admin': info[0].user_admin,
                                'userName': info[0].user_name,
                                'email': info[0].user_email
                             }
                             req.session.test = 1;
                        } else {
                            console.log('按理说不应该存在这种错误的');
                        }
                    } else {
                        console.log('获取管理员权限失败,数据库执行错误')
                    }
                    console.log('sessssssssssssssssssss');
                    console.log(req.session);
                    console.log('req.session.admin = ' + req.session.login.admin);
                    console.log('req.session.userName =' + req.session.login.userName);
                    console.log('email=' + req.session.login.email);
                    next();
                }
            })
        } else {
            console.log('session access');
        }
        next();
    }
    next();
})




app.use('/',require('./router/index'));

http.createServer(app).listen(233);

//  http://localhost:233  /admim 这个路径已经被app.use匹配了
//        /index 这个路径是来交给admin.js文件进行匹配的
//app.use('/admin',require('./router/admin'));




