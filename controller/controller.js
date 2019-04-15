var express = require('express');
var router = express.Router();
var path = require('path');



//index
router.get('/', function(req, res) {
    res.redirect('/articles');
});


















module.exports = router;