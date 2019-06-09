const express = require("express"),
    // mysql = require("../module/mysql"),
    crypto = require("crypto"),
    router = express.Router();



router.get('/logout', (req,res) => {
    res.clearCookie('login');
    req.session.destroy();
    res.redirect('/main');
})

router.use("/",require("./main.js"));

router.use("/main", require("./main.js"));
router.use("/anime", require("./main.js"));
router.use("/music", require("./main.js"));
router.use("/techo",require("./main.js"));

router.use("/play",require("./play.js"));

router.use("/login",require("./test.js"));
router.use("/reg",require("./register.js"));

router.use("/else",require("./else.js"));  //一些其他的游戏
router.use("/upload",require("./upload.js"));
router.use("/test",require("./test.js"));
router.use("/teste",require("./teste.js"));
router.use("/userInfoModify",require("./userInfoModify.js"));
router.use("/newtest",require("./newtest.js"));

// router.use('/reg',function () {
//     return require("./register.js")
// });

module.exports = router;

