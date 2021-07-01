"use strict"

let express = require('express');
let router = express.Router();
let SolrSearch = require('../db_classes/solr_search');
const Access = require('../db_classes/access');

/* GET home page. */
router.get('/', function(req, res, next) {

  Access.getClassByIndividuals().then(resultat => {

     res.render('index', {title: 'title'})

  })

});

router.get('/text_search/', function (req , res){

  res.render('search');

})

.post('/text_search/', function (req, res){

  const search_word = req.body.search_word;

  Access.searchWord(search_word).then(resp => {

    res.render('search_result', {search_word: search_word, results: resp})


  }).catch(err => {

    console.log(err);

    res.render('search_result', {search_word: search_word})


  });

})

router.get('/global_details/:label', function (req, res ){

  Access.getEntityByLabel(req.params['label']).then(entity => {

    entity.views = entity.views.filter(view => view.data.length > 0);

    res.render('global_details', {entity: entity});

  }).catch(err => {
    console.log(err);
  })

})


module.exports = router;
