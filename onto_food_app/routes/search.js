//Router pour la recherche textuelle
let express = require('express');

let search_router = express.Router();

const Access = require('../db_classes/access');


function paginator(items, current_page, per_page_items) {
  let page = current_page || 1,
      per_page = per_page_items || 10,
      offset = (page - 1) * per_page,

      paginatedItems = items.slice(offset).slice(0, per_page_items),
      total_pages = Math.ceil(items.length / per_page);

  return {
    page: page,
    per_page: per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: (total_pages > page) ? page + 1 : null,
    total: items.length,
    total_pages: total_pages,
    data: paginatedItems
  };
}


search_router.get('/text', function (req , res){

   res.render('search');
  
  })
  
  
  
  .get('/text/result', function (req, res){
  

    let page = parseInt((req.query.page));

    let search_word =  req.query.search_word.toString();

    Access.searchWord(search_word).then(resp => {

      let paginatedData = paginator(resp,  page, 10,);

      console.log(paginatedData);

      res.render('search_result', {search_word: search_word, results: paginatedData});

    }).catch(err => {
  
      console.log(err);
  
      res.render('search_result', {search_word: search_word})
  
  
    });
  
  });


  search_router.get('/recommandations', (req, res) => {

    res.render('recom');

  });


  module.exports = search_router;
