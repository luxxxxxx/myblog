const multer = require('multer'),
    path = require('path');

// 上传路径处理 ,上传文件重命名
let storage = multer.diskStorage({
    // 上传路径处理
    // destination: `${process.cwd()}/public`,
    destination: path.join(process.cwd(), 'public/img/user_img'),
    filename: function (req, file, callback) {  // file上传的文件信息, callback 重命名处理
        // console.log(file);
        // 重命名处理
        let filename = (file.originalname).split('.');  //['文件名','文件后缀'] eg: 1.png
        callback(null, `${Date.now()}.${filename[filename.length - 1]}`); //参数1 null ,参数2 时间戳+后缀
    }
});
let fileFilter = function (req, file, cb) {
    // 当设置这个判断后  没允许的 && 没设置的类型 拒绝
    // console.log(file.mimetype);   //mimetype文件类型
    if (file.mimetype === 'image/gif') {
        cb(null, true);//允许
    } else if (file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else if (file.mimetype === 'image/png') {
        cb(null, true);
    } else if (file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        req.err = '失败';
        cb(null, false);
    }
}
let upload = multer({
    // 上传文件路径,名字设置
    storage: storage,
    // limits: { }, 限制文件的大小
    fileFilter: fileFilter //文件的类型, 过滤
});

module.exports = upload;