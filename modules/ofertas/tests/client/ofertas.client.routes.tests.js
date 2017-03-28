(function () {
  'use strict';

  describe('Ofertas Route Tests', function () {
    // Initialize global variables
    var $scope,
      OfertasService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OfertasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OfertasService = _OfertasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('ofertas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/ofertas');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          OfertasController,
          mockOferta;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('ofertas.view');
          $templateCache.put('modules/ofertas/client/views/view-oferta.client.view.html', '');

          // create mock Oferta
          mockOferta = new OfertasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Oferta Name'
          });

          // Initialize Controller
          OfertasController = $controller('OfertasController as vm', {
            $scope: $scope,
            ofertaResolve: mockOferta
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:ofertaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.ofertaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            ofertaId: 1
          })).toEqual('/ofertas/1');
        }));

        it('should attach an Oferta to the controller scope', function () {
          expect($scope.vm.oferta._id).toBe(mockOferta._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/ofertas/client/views/view-oferta.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OfertasController,
          mockOferta;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('ofertas.create');
          $templateCache.put('modules/ofertas/client/views/form-oferta.client.view.html', '');

          // create mock Oferta
          mockOferta = new OfertasService();

          // Initialize Controller
          OfertasController = $controller('OfertasController as vm', {
            $scope: $scope,
            ofertaResolve: mockOferta
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.ofertaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/ofertas/create');
        }));

        it('should attach an Oferta to the controller scope', function () {
          expect($scope.vm.oferta._id).toBe(mockOferta._id);
          expect($scope.vm.oferta._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/ofertas/client/views/form-oferta.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OfertasController,
          mockOferta;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('ofertas.edit');
          $templateCache.put('modules/ofertas/client/views/form-oferta.client.view.html', '');

          // create mock Oferta
          mockOferta = new OfertasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Oferta Name'
          });

          // Initialize Controller
          OfertasController = $controller('OfertasController as vm', {
            $scope: $scope,
            ofertaResolve: mockOferta
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:ofertaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.ofertaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            ofertaId: 1
          })).toEqual('/ofertas/1/edit');
        }));

        it('should attach an Oferta to the controller scope', function () {
          expect($scope.vm.oferta._id).toBe(mockOferta._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/ofertas/client/views/form-oferta.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
