const express = require("express"),

    router = express.Router();


router.get("/", (req, res) => { 
    res.render('./vueTest/vueTest.ejs');
})

router.get("/demo1", (req, res) => {
    res.render('./vueTest/vueTest2.ejs');
})

router.get("/demo2",(req,res) => {
    res.render('./vueTest/todoList.ejs')
})

router.get("/demo3", (req, res) => {
    res.render('./vueTest/components.ejs')
})
router.get("/demo4", (req, res) => {
    res.render('./vueTest/demo4.ejs')
})
router.get("/demo5", (req, res) => {
    res.render('./vueTest/eventBus.ejs')
})
router.get("/demo6", (req, res) => {
    res.render('./vueTest/VueTest3.ejs')
})
router.get("/demo7", (req, res) => {
    res.render('./vueTest/slotTest.ejs')
})
router.get("/demo8", (req, res) => {
    res.render('./vueTest/vue-router.ejs')
})
router.get("/demo9", (req, res) => {
    res.render('./vueTest/insert_router.ejs')
})
router.get("/demo10", (req, res) => {
    res.render('./vueTest/news.ejs')
})
// router.get("/demo11", (req, res) => {
//     res.render('./vueTest/news.ejs')
// })


module.exports = router;
