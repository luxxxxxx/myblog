const http = require("http"),
      express = require("express"),
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      session = require("express-session"),
      app = express();

app.set('views',__dirname+'/views');// 设置模板引擎的目录
app.set('view engine','ejs');// 设置使用的模板引擎是什么
app.use(express.static(__dirname+'/public'));// 设置静态资源目录 js img  css

app.use(bodyParser.json());// 用来接收json的数据
// extended:true 可以接收任何数据类型的数据

app.use(bodyParser.urlencoded( { extended:true } ));
app.use(cookieParser("luxxx"));
app.use(session({ 
    resave : true,  //don't save session  if unmoified
    saveUninitialized : false,
    secret : "sadaskhdasuusadhuisduixb",
    cookie : {maxAge : 60 * 1000 * 60 * 24}   //存放内存时间  
}));  //设置秘钥


// app.use((req,res,next) => {
//     const decipher = crypto.createDecipher('aes192', 'luxxxxxx');
    
//     let decrypted = '';
//     decipher.on('readable', () => {
//         const data = decipher.read();
//         if (data)
//             decrypted += data.toString('utf8');
//     });
//     decipher.on('end', () => {
//         console.log(decrypted);
//         // Prints: some clear text data
//     });
//     console.log(req.cookies.login.pass);
//     const encrypted =
//         'da1261c7676ff6a053be53f9e98918b9442fcd06c4a67afd5fe324eec92f3a55d56f6e88d537cdd4d58f8a0dad3907ac';
//     decipher.write(encrypted, 'hex');
//     decipher.end();
// });

// app.use ((req,res,next) => {

//     if (req.cookies.login) {  
//         //存在cookie 但是不存在session 的情况下，
//         //根据cookie里面的存放的用户名以及用户密码(加密后的)
//         //从数据库里面获取管理员权限并存放在session 内部 但凡获取失败 ,需要使用管理员权限的时候
//         //必须重新进行登录

//         if (!req.session.login) {
//             // console.log('session deny');  //异步编程，先解密 cookie里面的密码
//             let decrypted = null,
//                 pass = req.cookies.login.pass,
//                 p_decipher = (str) => {
//                      return new Promise ((resolve,reject) => {
//                         encrypt.decipher(pass,(str) => { 
//                             decrypted = str;
//                             resolve();  
//                         })
//                      })
//                 };   
            
//             p_decipher().then(() => {
//                 mysql({
//                     sql : 'select * from t_user where user_name = ? and user_pass = ?',
//                     args : [req.cookies.login.name,decrypted],
//                     callback : (err,info) => {
//                         // console.log(err);
//                         // console.log(info);
//                         if (!err) {
//                             if (info.length) {
//                                 req.session.login = {
//                                     'userId' : info[0].user_id,
//                                     'admin': info[0].user_admin,
//                                     'userName': info[0].ud_name,
//                                     'count': info[0].user_name,
//                                     'email': info[0].user_email,
//                                     'status' : info[0].user_status,
//                                     'tx': info[0].ud_tx
//                                 }
//                             } else {
//                                 console.log('按理说不应该存在这种错误的');
//                             }
//                         } else {
//                             console.log('获取管理员权限失败,数据库执行错误 index.js')
//                         }
//                         next();
//                     } //callback
//                 })
//             })  //promise end
//         } else {
//             next();
//         }
//     } else {
//         next();
//     } 
// })



app.use((req, res, next) => {
    console.log(req.session);
    if (req.cookies['login']) {
        let cookies = req.cookies['login'];
        // res.locals.login = {
        //     status: cookies.status,  
        //     name: cookies.name,
        //     count: cookies.count, 
        //     id: cookies.id,
        //     admin : cookies.admin,
        //     tx : cookies.tx,
        //     sign : cookies.sign,
        //     exp : cookies.exp
        // }
        res.locals.name = cookies.name;
        res.locals.status = cookies.status;
        res.locals.count = cookies.count;
        res.locals.id = cookies.id;
        res.locals.admin = cookies.admin;
        res.locals.tx = cookies.tx;
        res.locals.sign = cookies.sign;
        res.locals.exp = cookies.exp;

        // res.locals.login.pass = r = req.cookies.login.name;
        // console.log(res.locals.login);
    } else {
        res.locals.login = null;
    }
    next();
})

app.use('/',require('./router/index'));

http.createServer(app).listen(233);




//  http://localhost:233  /admim 这个路径已经被app.use匹配了
//        /index 这个路径是来交给admin.js文件进行匹配的
//app.use('/admin',require('./router/admin'));




