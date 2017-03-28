'use strict';

describe('Ofertas E2E Tests:', function () {
  describe('Test Ofertas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ofertas');
      expect(element.all(by.repeater('oferta in ofertas')).count()).toEqual(0);
    });
  });
});
