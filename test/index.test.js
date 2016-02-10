'use strict';

var expect = require('chai').use(require('sinon-chai')).expect;
var fixtures = require('./fixtures');
var sinon = require('sinon');



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

  var objectTest = function(fixt) {
    var result = deepMap(fixt.source, fixt.transform);
    expect(result).to.deep.equal(fixt.expected);
  };

  describe('param:object', function() {

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

    describe('argument type', function() {

      describe('undefined', function() {

        it('throws an Error', function() {
          expect(deepMap.bind(null, {})).to.throw(Error);
        });
      });

      describe('non-function', function() {

        it('throws a TypeError', function() {
          expect(deepMap.bind(null, {}, 42)).to.throw(TypeError);
        });
      });

      describe('function', function() {

        it('transforms each value in object', function() {
          var result = deepMap([0, 1], Boolean);
          expect(result).to.deep.equal([false, true]);
        });
      });
    });

    describe('arg2:index/key', function() {

      function arg2Test(fixt, keys) {
        for (var i = 0; i < keys.length; i++) {
          expect(fixt.transform).to.have.been.calledWith(sinon.match.any, keys[i]);
        }
      }

      describe('traversing array', function() {

        it('is called with current index', function() {
          var fixt = fixtures.withIndex;
          objectTest(fixt);
          arg2Test(fixt, fixt.indices);
        });
      });

      describe('traversing object', function() {

        it('is called with current key', function() {
          var fixt = fixtures.withKey;
          objectTest(fixt);
          arg2Test(fixt, fixt.keys);
        });
      });

    });
  });

  describe('param:options', function() {

    describe('user passes a truthy primitive', function() {

      it('throws a TypeError', function() {
        expect(deepMap.bind(null, {}, function() {}, 42)).to.throw(TypeError);
      });
    });

    describe('option:inPlace', function() {

      describe('value:falsy',function() {

        var fixt, result;
        before(function() {
          fixt = fixtures.inPlace;
          result = deepMap(fixt.source, fixt.transform);
        });

        it('leaves old object alone', function() {
          expect(result).not.to.equal(fixt.superObject);
          expect(fixt.superObject).to.deep.equal(fixt.superObjectCopy);
        });

        it('leave old nested objects alone', function() {
          expect(result).property(3).not.to.equal(fixt.subObject);
          expect(fixt.subObject).to.deep.equal(fixt.subObjectCopy);
        });
      });

      describe('value:truthy', function() {

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
          expect(result).property(3).to.equal(fixt.subObject);
        });
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
