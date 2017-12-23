const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    encrypt = require("../module/encrypt"),
    // sd = require("silly-datetime"),
    router = express.Router();



router.get('/',(req,res) => {
    res.send('网站主页正在修建...');
})





module.exports = router;