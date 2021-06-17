"use strict"

var express = require('express');
var router = express.Router();
var GraphDBDao = require('../graphDB');

let gb = GraphDBDao.getGraphDBDaoInstance();

/* GET home page. */
router.get('/', function(req, res, next) {

  gb.getAllTriples().then(rep => {
    console.log(rep)
    res.render('index', { title: 'Express' , pm: rep});

  }).catch(err => {
    res.render('index', {title: 'title'})

  });

});

module.exports = router;
