const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    encrypt = require("../module/encrypt"),
    router = express.Router();


router.get('/',(res,req) => {
    res.render('./upload.ejs');
});



module.exports = router;