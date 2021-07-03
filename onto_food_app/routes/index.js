"use strict"

let express = require('express');

let router = express.Router();

//Routeur pour la recherche textuelle
let searchRouter = require('./search')

//Routeur pour les actions Crud dans la base de connaissance
let crud_router = require('./crud') 

/* GET home page. */
router.get('/', function(req, res, next) {
     res.render('index', {title: 'title'})
});


// Pour les CRUDS 
router.use('/entity',crud_router);


//Pour la recherche Textuelle
router.use('/search', searchRouter);




module.exports = router;
