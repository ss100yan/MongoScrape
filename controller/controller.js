const express = require('express');
const axios = require('axios')
const cheerio = require('cheerio');
const Article = require('../models/article.js');



module.exports = function (app) {


app.get('/', function(req, res) {
    res.redirect('/articles');
  
});




app.get('/scrape', function(req, res) {

    // Grabing the body of the html with Axios

    axios.get('https://www.miamiherald.com/news/local/')
    .then((response) => {
        if(response.status === 200) {
        const html = response.data;

        // Loading it into cheerio 
        const $ = cheerio.load(html); 
        console.log ($);

        var titlesArray = [];

        // Grabing all the articles 

        $('.title').each(function(i, element) {
         
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
             
          }
         
        });
        
        res.redirect('/');
   
  }
}, (error) => console.log(err) );
});

// Populates index.handlebaes with all the saved articles saved in Mongo DB
app.get('/articles', function(req, res) {
    // sorts the newer articles to the top
    Article.find().sort({_id: -1})
        
        .exec(function(err, doc) {
            if(err){
                console.log(err);
            } else{
                var artcl = {article: doc};
                res.render('index', artcl);
            }
    });
    
});



app.get('/clearAll', function(req, res) {
  Article.remove({}, function(err, doc) {
      if (err) {
          console.log(err);
      } else {
          console.log('removed all articles');
      }

  });
  res.redirect('/');
});

};


