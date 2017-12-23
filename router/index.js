const express = require("express"),
    // mysql = require("../module/mysql"),
    crypto = require("crypto"),
    router = express.Router();



router.get('/logout', (req,res) => {
    res.clearCookie('login');
    res.redirect('/techo');
})

router.use("/",require("./main.js"));
router.use("/main",require("./main.js"));
router.use("/play",require("./play.js"));
router.use("/login",require("./login.js"));
router.use("/reg",require("./register.js"));
router.use("/techo",require("./techo.js"));


// router.use('/reg',function () {
//     return require("./register.js")
// });

module.exports = router;

