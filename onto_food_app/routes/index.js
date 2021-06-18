"use strict"

var express = require('express');
var router = express.Router();
var GraphDBDao = require('../graphDB');

let gb = GraphDBDao.getGraphDBDaoInstance();

/* GET home page. */
router.get('/', function(req, res, next) {

  gb.getAllClassByINdividualsNumber().then(rep => {
    res.render('index', { title: 'Express' , pm: rep});

  }).catch(err => {
    console.log(err);
    res.render('index', {title: 'title'})

  });

});


router.get('/global_details/:label', function (req, res ) {

    // Obtenir toutes les informations par rapport à l'entité ayant le label passé en paramètre dans la requête

    let label = "", infos = "", comments = "";

    //Ici je prends le label
    label = req.params['label']

    // Obentir toutes les informations entre lui et toute les entités

   gb.getAllInfoAboutEntity(label).then(function(result){

       console.log("Voici toutes les informations entre lui et toute les entités");

       console.log(result);

       infos = result;

       return gb.getCommentsAboutLabel(label);

    }).then(function (comments){

        console.log("voici les commentaires...");

        console.log(comments);

        let isClass = gb.isClass(label, infos);

       console.log("Recherche du type de l'entité , est t-il une classe ?")

       console.log(isClass);

        res.render('global_details', {
            label: label ,
            comments: comments,
            infos: infos,
            isClass: isClass
        })


   }).catch(function(err) {
       console.log(err);
       res.render('global_details', {
           label: label
       });
   })

})

module.exports = router;
