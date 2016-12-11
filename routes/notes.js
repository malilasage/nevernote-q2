'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.get('/', function(req, res, next) {
  console.log('cool duded');
});

router.get('/:id', function(req, res, next) {
  knex('notes')
  .where('id', req.params.id)
  .first()
  .then((note) => {
    if(!note){
      return next();
    }
    res.send(note);
  }).catch((err) => {
    next(err);
  })
});

router.post('/', (req, res, next) => {
  var {content, name} = req.body;
  knex('notes')
  .insert({
    content,
    name
  }, '*')
  .then((note) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(note[0]);
  })
})

module.exports = router;
