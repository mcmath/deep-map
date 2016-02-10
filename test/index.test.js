'use strict';

var expect = require('chai').use(require('sinon-chai')).expect;
var fixtures = require('./fixtures');



describe('module:index', function() {

  var deepMap;
  before(function() {
    deepMap = require('../index');
  });

  it('is the main module', function() {
    expect(deepMap).to.equal(require('..'));
  });

  it('exports the deepMap function', function() {
    expect(deepMap).to.be.a('function');
    expect(deepMap).to.have.property('name', 'deepMap');
  });

  describe('param:object', function() {

    var objectTest = function(fixt) {
      var result = deepMap(fixt.source, fixt.transform);
      expect(result).to.deep.equal(fixt.expected);
    };

    describe('user passes a primitive value', function() {

      it('transforms the primitive value', function() {
        objectTest(fixtures.primitive);
      });
    });

    describe('user passes a flat array', function() {

      it('transforms each primitive item in the array', function() {
        objectTest(fixtures.flatArray);
      });
    });

    describe('user passes a flat object', function() {

      it('transforms each primitive value in the object', function() {
        objectTest(fixtures.flatObject);
      });
    });

    describe('user passes a nested array', function() {

      it('transforms each primitive item in each array', function() {
        objectTest(fixtures.nestedArrays);
      });
    });

    describe('user passes a nested object', function() {

      it('transforms each primitive value in each nested object', function() {
        objectTest(fixtures.nestedObjects);
      });
    });

    describe('user passes a complex, json-like object', function() {

      it('transforms each primitive value', function() {
        objectTest(fixtures.jsonLike);
      });
    });
  });

  describe('param:transformFn', function() {

    describe('user leaves undefined', function() {

      it('throws an Error', function() {
        expect(deepMap.bind(null, {})).to.throw(Error);
      });
    });

    describe('user passes a non-function', function() {

      it('throws a TypeError', function() {
        expect(deepMap.bind(null, {}, 42)).to.throw(TypeError);
      });
    });

    describe('user passes a function', function() {

      it('transforms each value in object', function() {
        var result = deepMap([0, 1], Boolean);
        expect(result).to.deep.equal([false, true]);
      });
    });
  });

  describe('param:options', function() {

    describe('option:inPlace', function() {

      var fixt, result;
      before(function() {
        fixt = fixtures.inPlace;
        result = deepMap(fixt.source, fixt.transform, {inPlace: true});
      });

      it('transforms object in place', function() {
        expect(result).to.equal(fixt.superObject);
        expect(result).to.deep.equal(fixt.expected);
      });

      it('transforms nested objects in place', function() {
        expect(result).property('[3]').to.equal(fixt.subObject);
      });
    });

    describe('option:thisArg', function() {

      it('sets the context within transformFn', function() {
        var fixt = fixtures.thisArg;
        var result = deepMap(fixt.source, fixt.transform, {thisArg: fixt.thisArg});
        expect(fixt.transform).to.be.calledOn(fixt.thisArg);
        expect(result).to.deep.equal(fixt.expected);
      });
    });
  });
});
