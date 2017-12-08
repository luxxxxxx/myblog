const express = require("express"),
    mysql = require("../module/mysql"),
    crypto = require("crypto"),
    send = require("../module/sendMail"),
    router = express.Router();



router.get("/", (req, res) => {
    res.render("techo.ejs");
});


module.exports = router;


