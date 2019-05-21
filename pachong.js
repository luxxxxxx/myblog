const http = require('http'),
      https = require('https');  //默认端口443 
    options = {
        hostname : 'nodejs.cn',
        path : '/api/',
        port : '80',
        //编辑请求头
        headers : {
            //编码格式
            'Content-Type': 'charset = utf-8'
        }
    }

http.get(options,(res) => {
    //当请求有数据的时候触发
    let html = '';
    res.on('data',(data) => {
        html += data;
    });
    //当请求完成的时候
    res.on('end', () => {
        console.log(html);
    });

});

const fs = require('fs');

// http.get('picture link', (res) => {
//     //当请求有数据的时候触发
    
//     res.setEncoding('binary');
//     let img = '';
//     res.on('data', (data) => {
//         img += data;
//     });
//     //当请求完成的时候
//     res.on('end', () => {
//         fs.writeFile('./1.png',img,'binary')
//     });

// });