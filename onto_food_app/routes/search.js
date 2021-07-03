//Router pour la recherche textuelle
let express = require('express');

let search_router = express.Router();

const Access = require('../db_classes/access');



search_router.get('/text', function (req , res){

    res.render('search');
  
  })
  
  
  
  .post('/text', function (req, res){
  
    const search_word = req.body.search_word;
  
    Access.searchWord(search_word).then(resp => {
  
      res.render('search_result', {search_word: search_word, results: resp})
  
  
    }).catch(err => {
  
      console.log(err);
  
      res.render('search_result', {search_word: search_word})
  
  
    });
  
  });


  search_router.get('/recommandations', (req, res) => {

    res.render('recommandations');

  });


  module.exports = search_router;