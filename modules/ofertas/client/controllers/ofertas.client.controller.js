(function () {
  'use strict';

  // Ofertas controller
  angular
    .module('ofertas')
    .controller('OfertasController', OfertasController);

  OfertasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'ofertaResolve'];

  function OfertasController ($scope, $state, $window, Authentication, oferta) {
    var vm = this;

    vm.authentication = Authentication;
    vm.oferta = oferta;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Oferta
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.oferta.$remove($state.go('ofertas.list'));
      }
    }

    // Save Oferta
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ofertaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.oferta._id) {
        vm.oferta.$update(successCallback, errorCallback);
      } else {
        vm.oferta.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('ofertas.view', {
          ofertaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
