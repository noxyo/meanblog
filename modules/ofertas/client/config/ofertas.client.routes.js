(function () {
  'use strict';

  angular
    .module('ofertas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ofertas', {
        abstract: true,
        url: '/ofertas',
        template: '<ui-view/>'
      })
      .state('ofertas.list', {
        url: '',
        templateUrl: 'modules/ofertas/views/list-ofertas.client.view.html',
        controller: 'OfertasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Ofertas List'
        }
      })
      .state('ofertas.create', {
        url: '/create',
        templateUrl: 'modules/ofertas/views/form-oferta.client.view.html',
        controller: 'OfertasController',
        controllerAs: 'vm',
        resolve: {
          ofertaResolve: newOferta
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Ofertas Create'
        }
      })
      .state('ofertas.edit', {
        url: '/:ofertaId/edit',
        templateUrl: 'modules/ofertas/views/form-oferta.client.view.html',
        controller: 'OfertasController',
        controllerAs: 'vm',
        resolve: {
          ofertaResolve: getOferta
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Oferta {{ ofertaResolve.name }}'
        }
      })
      .state('ofertas.view', {
        url: '/:ofertaId',
        templateUrl: 'modules/ofertas/views/view-oferta.client.view.html',
        controller: 'OfertasController',
        controllerAs: 'vm',
        resolve: {
          ofertaResolve: getOferta
        },
        data: {
          pageTitle: 'Oferta {{ ofertaResolve.name }}'
        }
      });
  }

  getOferta.$inject = ['$stateParams', 'OfertasService'];

  function getOferta($stateParams, OfertasService) {
    return OfertasService.get({
      ofertaId: $stateParams.ofertaId
    }).$promise;
  }

  newOferta.$inject = ['OfertasService'];

  function newOferta(OfertasService) {
    return new OfertasService();
  }
}());
