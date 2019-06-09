const express = require("express"),
    upload = require('../module/multer'),
    router = express.Router();

    router.post('/',upload.single('file'),(req,res,next) => {
        console.log('shit');
        console.log(req.file);
        console.log(req.files);
        console.log(res.file);
    })





    module.exports = router;