(function () {
  'use strict';

  angular
    .module('ofertas')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    /*
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Ofertas',
      state: 'ofertas',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'ofertas', {
      title: 'List Ofertas',
      state: 'ofertas.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'ofertas', {
      title: 'Create Oferta',
      state: 'ofertas.create',
      roles: ['user']
    });
    */
    menuService.addMenuItem('topbar', {
      title: 'Ultimas Ofertas',
      state: 'ofertas.list',
      roles: ['user']
    });
    menuService.addMenuItem('topbar', {
      title: 'Criar Oferta',
      state: 'ofertas.create',
      roles: ['user']
    });

  }
}());
