
let express = require('express');

const Access = require('../db_classes/access');


let crud_router = express.Router();


crud_router.get('/get/:label', function (req, res ){

    Access.getEntityByLabel(req.params['label']).then(entity => {
  
      entity.views = entity.views.filter(view => view.data.length > 0);
  
      res.render('global_details', {entity: entity});
  
    }).catch(err => {
      console.log(err);
    })
  
  });


  crud_router.post('/add/comment_fact', (req , res) => {

        console.log("-----------------------------ADD COMMENT OR FACT --------------------------------------")

        const choice = req.body.choice_checkbox;
        const uri = req.body.uri;
        const text = req.body.text_enter;
        const label = req.body.label;

        console.log("CHOICE IS ----------------- " + choice);

    Access.addCommentOrFact(uri,text,choice).then(response => {

        console.log("Ajout du comment ou du fait terminée .....");

        res.redirect('/entity/get/' + label);

    }).catch(err => console.log(err))


})


crud_router.get('/populate', (req, res) => {

  Access.getClassByIndividuals().then(classes => {
    
    res.render('populate',  {classes: classes});
  
  });

});



crud_router.get('/populate/individuals', (req , res) => {


  res.render('populate_individual');


});

crud_router.get('/populate/properties', (req , res) => {


    res.render('populate_properties');

});


crud_router.get('/populate/class', (req , res) => {


    res.render('populate_class');

});


crud_router.get('/get/all/properties', (req , res) => {

    Access.getAllProperties().then(entities => {

        res.json({entities: entities});

    }).catch(err => console.log(err))

});




crud_router.get('/met/get_by_region_and_country',(req , res) => {

    let country = req.query.country;

    let region = req.query.region;

    Access.getMetByRegionAndCountry(country, region).then(mets => {

        res.json({mets: mets, thead: ["Met" , "Region" , "Pays"]});

    }).catch(err => console.log(err))

});


crud_router.get('/met/get_by_disease',(req , res) => {

    let disease = req.query.disease;

    Access.getMetByDisease(disease).then(mets => {

        res.json({mets: mets, thead: ["Met" , "Disease" ]});

    }).catch(err => console.log(err))

});



crud_router.get('/insert_triples', (req, res) => {

    const triples = req.query.triples.toString();

    console.log(triples);

     Access.insertTriples(triples).then(res => {

         res.json(

             {
                 result: "SuccessFull Insert",
                 status: "OK"
             }
         )

     }).catch(err => {

         res.json({error: err})

     })

});




module.exports = crud_router;
