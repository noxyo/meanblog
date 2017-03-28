(function () {
  'use strict';

  angular
    .module('ofertas')
    .controller('OfertasListController', OfertasListController);

  OfertasListController.$inject = ['OfertasService'];

  function OfertasListController(OfertasService) {
    var vm = this;

    vm.ofertas = OfertasService.query();
  }
}());
