'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const knex = require('./knex');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

app.disable('x-powered-by');

app.use(express.static(path.join('public')));
app.use(bodyParser.json());

//require routes
const users = require('./routes/users');
app.use('/users', users);

//error functions
app.use((_req, res) => {
  res.sendStatus(404);
});

app.use((err, _req, res, _next) => {
  console.log(err);
  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }
  
  if (err.status) {
    console.log(err)
    return res.status(err.status).send(err);
  }

  console.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

module.exports = app;
