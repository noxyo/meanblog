// Ofertas service used to communicate Ofertas REST endpoints
(function () {
  'use strict';

  angular
    .module('ofertas')
    .factory('OfertasService', OfertasService);

  OfertasService.$inject = ['$resource'];

  function OfertasService($resource) {
    return $resource('api/ofertas/:ofertaId', {
      ofertaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
