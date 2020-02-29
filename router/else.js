const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    encrypt = require("../module/encrypt"),
    router = express.Router();




router.get('/tx',(req,res) => { //特效
    res.render('tx.ejs')
});  
router.get('/dfj',(req,res) => { //打飞机
    res.render('dfj.ejs')
});

router.get('/big',(req,res) => {  //mistery
    res.render('big.ejs')
})

module.exports = router;