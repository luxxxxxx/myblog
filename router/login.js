const express = require("express"),
    // mysql = require("../module/mysql"),
    crypto = require("crypto"),
    router = express.Router();


router.get("/",( req, res ) => {
    res.render("404.html")
})



router.exports = router;