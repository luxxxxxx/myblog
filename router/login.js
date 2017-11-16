const express = require("express"),
    // mysql = require("../module/mysql"),
    crypto = require("crypto"),
    router = express.Router();


router.get("/",( req, res ) => {
    res.render("play.ejs")
});



module.exports = router;