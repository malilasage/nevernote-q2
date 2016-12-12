'use strict';

// This route needs to be to do:
  // GET: All of the users in the database. GET/id: Gets a specific user info.
  // POST: Adds a user to the database.
  // PATCH: Updates a user's information in the database.
  // DELETE: Delete's the user from the database.

var express = require('express');
var router = express.Router();
var ev = require('express-validation');
var validations = require('../validations/users');
var knex = require('../knex');
var bcrypt = require('bcrypt-as-promised');
const { camelizeKeys, decamelizeKeys } = require('humps');

// GET: All users.
router.get('/', (req, res, next) => {
  knex('users')
    .select(['id', 'first_name', 'email', 'created_at', 'updated_at'])
    .then((results) => {
      res.status(200).send(camelizeKeys(results));
    })
    .catch((err) => {
      next(err);
    });
});

// GET w/ ID: Gets a single user's information.
router.get('/:id', ev(validations.get), (req, res, next) => {
  const id = req.params.id;

  knex('users')
    .max('id')
    .then(results => {
      if (!id || id <= 0 || id > results) {
        return res.status(401).send('Unauthorized Access.');
      }
      // After determining if the ID exists and is valid; find it.
      return knex('users')
        .where('users.id', id)
        .select(['id', 'first_name', 'email', 'created_at', 'updated_at'])
        .first()
        .then((result) => {
          if (!result) {
            return next();
          }
          res.status(200).send(camelizeKeys(result));
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

// POST: Creates a new user.
router.post('/', ev(validations.post), (req, res, next) => {
  const { firstName, email, password } = req.body;

  let newUser = { firstName, email };
  bcrypt.hash(password, 10).then((result) => {
    newUser.hashed_password = result;
    return knex('users')
      .insert(decamelizeKeys(newUser))
      .returning(['id', 'first_name', 'email', 'created_at', 'updated_at'])
      .then((result) => {
        delete newUser.hashed_password;
        res.status(200).send(camelizeKeys(result[0]));
      });
  })
  .catch((err) => {
    next(err);
  });
});

// PATCH w/ ID: Updates a user with the ID.
router.patch('/:id', ev(validations.patch), (req, res, next) => {
  const id = req.params.id;
  const { firstName, email, password } = req.body;

  let newUser = { firstName, email };
  bcrypt.hash(password, 10).then(result => {
    newUser.hashed_password = result;
    // Query and make sure the ID is fine.
    return knex('users')
      .max('id')
      .then((results) => {
        if (!results || !id || id <= 0 || id > results) {
          return res.status(401).send('Unauthorized Access.');
        }
        // After determining if the ID exists and is valid; find it.
        return knex('users')
          .update(decamelizeKeys(newUser))
          .where('id', id)
          .returning(['id', 'first_name', 'email', 'created_at', 'updated_at'])
          .then((updated) => {
            delete newUser.hashed_password;
            res.status(200).send(camelizeKeys(updated[0]));
          });
      })
      .catch((err) => {
        next(err);
      });
  });
});

// DELETE w/ ID: Deletes an individual user by ID.
router.delete('/:id', ev(validations.delete), (req, res, next) => {
  const id = req.params.id;

  knex('users')
    .max('id')
    .then((results) => {
      if (!results || !id || id <= 0 || id > results) {
        return res.status(401).send('Unauthorized Access.');
      }
      // After determining if the ID exists delete it.
      return knex('users')
        .del([ 'first_name', 'email' ])
        .where('users.id', id)
        .then((deleted) => {
          res.status(200).send(deleted[0]);
        });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
