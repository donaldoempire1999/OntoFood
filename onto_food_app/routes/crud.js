
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
    
    const choice = req.body.choice_checkbox;
    const uri = req.body.uri;
    const text = req.body.text_enter;
    const label = req.body.label;

    Access.addCommentOrFact(uri,text,choice).then(response => {

        console.log("Ajout du comment ou du fait terminée .....");

        res.redirect('/entity/get/' + label);

    }).catch(err => console.log(err))


})


crud_router.get('/add/class', (req, res) => {


  res.render('operations')


})


  module.exports = crud_router;