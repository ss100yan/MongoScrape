var express = require('express');
var router = express.Router();



//require request and cheerio to scrape
var request = require('request');
var cheerio = require('cheerio');

//Require models

var Article = require('../models/Article.js');


//Rooting index
//index
router.get('/', function(req, res) {
    res.redirect('/articles');
    // res.render('index');
});



// A GET request to scrape the Verge website
router.get('/scrape', function(req, res) {
    // First, we grab the body of the html with request
    request('http://www.theverge.com/tech', function(error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        var titlesArray = [];
        // Now, we grab every article
        $('.c-entry-box--compact__title').each(function(i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('href');

            //ensures that no empty title or links are sent to mongodb
            if(result.title !== "" && result.link !== ""){
              //check for duplicates
              if(titlesArray.indexOf(result.title) == -1){

                // push the saved title to the array 
                titlesArray.push(result.title);

                // only add the article if is not already there
                Article.count({ title: result.title}, function (err, test){
                    //if the test is 0, the entry is unique and good to save
                  if(test == 0){

                    //using Article model, create new object
                    var entry = new Article (result);

                    //save entry to mongodb
                    entry.save(function(err, doc) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log(doc);
                      }
                    });

                  }
            });
        }
        // Log that scrape is working, just the content was missing parts
        else{
          console.log('Article already exists.')
        }

          }
          // Log that scrape is working, just the content was missing parts
          else{
            console.log('Not saved to DB, missing data')
          }
        });
        // after scrape, redirects to index
        res.redirect('/');
    });
});

//this will grab every article an populate the DOM
router.get('/articles', function(req, res) {
    // allows newer articles to be on top
    Article.find().sort({_id: -1})
        //send to handlebars
        .exec(function(err, doc) {
            if(err){
                console.log(err);
            } else{
                var artcl = {article: doc};
                res.render('index', artcl);
            }
    });
    // res.render('index')
});



module.exports = router;