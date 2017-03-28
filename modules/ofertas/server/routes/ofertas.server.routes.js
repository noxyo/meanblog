'use strict';

/**
 * Module dependencies
 */
var ofertasPolicy = require('../policies/ofertas.server.policy'),
  ofertas = require('../controllers/ofertas.server.controller');

module.exports = function(app) {
  // Ofertas Routes
  app.route('/api/ofertas').all(ofertasPolicy.isAllowed)
    .get(ofertas.list)
    .post(ofertas.create);

  app.route('/api/ofertas/:ofertaId').all(ofertasPolicy.isAllowed)
    .get(ofertas.read)
    .put(ofertas.update)
    .delete(ofertas.delete);

  // Finish by binding the Oferta middleware
  app.param('ofertaId', ofertas.ofertaByID);
};
