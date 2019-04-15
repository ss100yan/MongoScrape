var express = require('express');
var router = express.Router();
var path = require('path');



//Rooting index
router.get('/', function(req, res) {
    // res.redirect('/articles');
    res.render('index');
});


















module.exports = router;