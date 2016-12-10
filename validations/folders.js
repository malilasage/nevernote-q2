'use strict';

const Joi = require('joi');

module.exports.get = {
  params: Joi.object().keys({
    id: Joi.number()
          .integer()
          .positive()
          .required()
  })
};

module.exports.post = {
  body: Joi.object().keys({
    user_id: Joi.number()
          .integer()
          .positive()
          .required(),
    parent_folder: Joi.number()
          .integer()
          .positive(),
    name: Joi.string()
          .trim()
          .min(1)
          .max(20),
    is_secure: Joi.boolean()
  })
};

module.exports.patch = {
  body: Joi.object().keys({
    user_id: Joi.number()
          .integer()
          .positive()
          .required(),
    parent_folder: Joi.number()
          .integer()
          .positive(),
    name: Joi.string()
          .trim()
          .min(1)
          .max(20),
    is_secure: Joi.boolean()
  }).or(['user_id', 'parent_folder', 'name', 'is_secure']),

  params: Joi.object().keys({
    id: Joi.number()
          .integer()
          .positive()
          .required()
  })
};

module.exports.delete = {
  params: Joi.object().keys({
    id: Joi.number()
          .integer()
          .positive()
          .required()
  })
};