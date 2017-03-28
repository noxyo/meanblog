(function () {
  'use strict';

  describe('Ofertas Controller Tests', function () {
    // Initialize global variables
    var OfertasController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      OfertasService,
      mockOferta;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _OfertasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      OfertasService = _OfertasService_;

      // create mock Oferta
      mockOferta = new OfertasService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Oferta Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Ofertas controller.
      OfertasController = $controller('OfertasController as vm', {
        $scope: $scope,
        ofertaResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleOfertaPostData;

      beforeEach(function () {
        // Create a sample Oferta object
        sampleOfertaPostData = new OfertasService({
          name: 'Oferta Name'
        });

        $scope.vm.oferta = sampleOfertaPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (OfertasService) {
        // Set POST response
        $httpBackend.expectPOST('api/ofertas', sampleOfertaPostData).respond(mockOferta);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Oferta was created
        expect($state.go).toHaveBeenCalledWith('ofertas.view', {
          ofertaId: mockOferta._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/ofertas', sampleOfertaPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Oferta in $scope
        $scope.vm.oferta = mockOferta;
      });

      it('should update a valid Oferta', inject(function (OfertasService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/ofertas\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('ofertas.view', {
          ofertaId: mockOferta._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (OfertasService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/ofertas\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Ofertas
        $scope.vm.oferta = mockOferta;
      });

      it('should delete the Oferta and redirect to Ofertas', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/ofertas\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('ofertas.list');
      });

      it('should should not delete the Oferta and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
