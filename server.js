
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var express = require('express');


var app = express();



// Handlebars layout set up
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
// Express static folder /public
app.use(express.static(process.cwd() + '/public'));


// body parser
app.use(bodyParser.urlencoded({
    extended: false
  }));






var routes = require('./controller/controller.js');
app.use('/', routes);



var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Listening on PORT ' + port);
});