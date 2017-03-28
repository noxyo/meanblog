'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Oferta = mongoose.model('Oferta'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Oferta
 */
exports.create = function(req, res) {
  var oferta = new Oferta(req.body);
  oferta.user = req.user;

  oferta.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(oferta);
    }
  });
};

/**
 * Show the current Oferta
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var oferta = req.oferta ? req.oferta.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  oferta.isCurrentUserOwner = req.user && oferta.user && oferta.user._id.toString() === req.user._id.toString();

  res.jsonp(oferta);
};

/**
 * Update a Oferta
 */
exports.update = function(req, res) {
  var oferta = req.oferta;

  oferta = _.extend(oferta, req.body);

  oferta.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(oferta);
    }
  });
};

/**
 * Delete an Oferta
 */
exports.delete = function(req, res) {
  var oferta = req.oferta;

  oferta.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(oferta);
    }
  });
};

/**
 * List of Ofertas
 */
exports.list = function(req, res) {
  Oferta.find().sort('-created').populate('user', 'displayName').exec(function(err, ofertas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ofertas);
    }
  });
};

/**
 * Oferta middleware
 */
exports.ofertaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Oferta is invalid'
    });
  }

  Oferta.findById(id).populate('user', 'displayName').exec(function (err, oferta) {
    if (err) {
      return next(err);
    } else if (!oferta) {
      return res.status(404).send({
        message: 'No Oferta with that identifier has been found'
      });
    }
    req.oferta = oferta;
    next();
  });
};
