"use strict"

let express = require('express');
let router = express.Router();
let SolrSearch = require('../db_classes/solr_search');
const Access = require('../db_classes/access');

//Moteur de recherche
//let sr = SolrSearch.getSolrSearchInstance();


/* GET home page. */
router.get('/', function(req, res, next) {

  Access.getClassByIndividuals().then(res => {

     res.render('index', {title: 'title'})

  })

});

router.get('/global_details/:label', function (req, res ){

  Access.getEntityByLabel(req.params['label']).then(entity => {

    entity.views = entity.views.filter(view => view.data.length > 0);

    res.render('global_details', {entity: entity});

  }).catch(err => {
    console.log(err);
  })

})


module.exports = router;
