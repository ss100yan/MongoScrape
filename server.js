//dependencies
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


//initialize Express app
var express = require('express');
var app = express();


app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(process.cwd() + '/public'));

var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//connecting to MongoDB

var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://ss100yan:superstoy1@ds349455.mlab.com:49455/heroku_bwcnzgcm';

mongoose.connect(MONGODB_URI);

// mongoose.connect('mongodb://ss100yan:superstoy1@ds349455.mlab.com:49455/heroku_bwcnzgcm');
  

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to Mongoose!')
});

var routes = require('./controller/controller.js');
app.use('/', routes);

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log('Listening on PORT ' + port);
});