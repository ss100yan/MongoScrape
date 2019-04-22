const mongoose = require('mongoose');
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');




// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://ss100yan:superstoy1@ds349455.mlab.com:49455/heroku_bwcnzgcm';

mongoose.connect(MONGODB_URI);
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to Mongoose!')
});

// Routes
require("./controller/controller")(app);
 

const port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log('Listening on PORT ' + port);
});

module.exports = app;