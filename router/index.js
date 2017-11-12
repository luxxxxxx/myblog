const express = require("express"),
    // mysql = require("../module/mysql"),
    crypto = require("crypto"),
    router = express.Router();


router.get("/play",(req,res) => {
    res.render("play.ejs");
});

router.get("/techo",(req,res) => {
    res.render("techo.ejs");
});

// router.use("/login",require("./login.js"));


module.exports = router;
