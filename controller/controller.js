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

        let titlesArray = [];

        // Grabing all the articles 

        $('.title').each(function(i, element) {

            
         
            let result = {i} ={

            // Add the text and href of every link, and save them as properties of the result object
            title: $(this).children().text(),
            link: $(this).children().attr('href')
                        
            };

            //no empty title or links
            if(result.title !== "" && result.link !== ""){
              // no duplicates
              if(titlesArray.indexOf(result.title) == -1){

               
                titlesArray.push(result.title);

                // no duplicate 
                Article.count({ title: result.title}, function (err, test){
                    //if the test is 0, the entry is unique and good to save
                  if(test == 0){

                  
                    const entry = new Article (result);

                   
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


app.get('/articles', function(req, res) {

    // newer articles to the top
    Article.find().sort({_id: -1})
        
        .exec(function(err, doc) {
            if(err){
                console.log(err);
            } else{
                const artcl = {article: doc};
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

app.get('/saved_articles', function(req, res) {
     
  res.render('saved_articles');

})

app.get('/save', function(req, res) {
     
  res.redirect('/');

})

};


