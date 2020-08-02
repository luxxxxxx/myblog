const mysql = require("mysql");
module.exports = (obj) => {
    // obj 参数：sql，args：查询数据 （例username）的数组形式，callback：回调函数
    let config = mysql.createConnection({
        host: "127.0.0.1",
        port: "3306",
        user: "root",
        password: "",
        // password: "liu5001131",
        // last server pass: "lux5001131",
        database: "blog"
    })
    config.connect();
    if (!obj.args) {
        config.query(obj.sql,(err,data)=>{
            obj.callback(err,data);
        })
    } else {
        config.query(obj.sql,obj.args,(err,data) => {
            obj.callback(err,data);
        })
    }
}

