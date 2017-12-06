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
app.use(cookieParser("luxxxxxx"));
app.use(session( { secret : "luxxxxxx" } ));  //设置秘钥


// app.use((req,res,next) => {  //全局cookie
//     if (req.cookies["login"]) {
//     res.locals.login = req.cookies.login.name;
// }
// next();
// });

app.use('/',require('./router/index'));

http.createServer(app).listen(233);

//  http://localhost:233  /admim 这个路径已经被app.use匹配了
//        /index 这个路径是来交给admin.js文件进行匹配的
//app.use('/admin',require('./router/admin'));
