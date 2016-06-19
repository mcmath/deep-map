import chai = require('chai');
import sinonChai = require('sinon-chai');
import sinon = require('sinon');
import deepMap = require('./');

before(() => {
  chai.use(sinonChai);
  chai.should();
});

describe('deepMap(object, mapFn, [options])', () => {
  let square: (n: number) => number;

  beforeEach(() => {
    square = sinon.spy((n: number) => n * n);
  });

  it('exports a function', () => {
    deepMap.should.be.a('function');
  });

  describe('@object: any', () => {

    it('transforms simple object', () => {
      deepMap({two: 2, three: 3}, square).should.deep.equal({two: 4, three: 9});
    });

    it('transforms simple array', () => {
      deepMap([2, 3], square).should.deep.equal([4, 9]);
    });

    it('transforms object with nested objects/arrays', () => {
      deepMap({two: 2, obj: {three: 3, four: 4}, arr: [5, 6]}, square)
        .should.deep.equal({two: 4, obj: {three: 9, four: 16}, arr: [25, 36]});
    });

    it('transforms array with nested objects/arrays', () => {
      deepMap([2, {three: 3, four: 4}, [5, 6]], square)
        .should.deep.equal([4, {three: 9, four: 16}, [25, 36]]);
    });

    it('transforms an object with circular references', () => {
      let obj = {two: 2, arr: [3, 4], self: null as any, arr2: null as any[]};
      obj.self = obj;
      obj.arr2 = obj.arr;

      let exp = {two: 4, arr: [9, 16], self: null as any, arr2: null as any[]};
      exp.self = exp;
      exp.arr2 = exp.arr;

      deepMap(obj, square).should.deep.equal(exp);
    });

  });

  describe('@mapFn(value: any, key: string|number): any', () => {

    it('throws Error if undefined', () => {
      deepMap.bind(null, {two: 2}).should.throw(Error);
    });

    it('throws TypeError if not a function', () => {
      deepMap.bind(null, {two: 2}, 42).should.throw(TypeError);
    });

    it('is called once per primitive value', () => {
      deepMap({two: 2, obj: {three: 3}, arr: [4]}, square);
      square.should.have.callCount(3);
    });

    it('is called with @value as first argument', () => {
      deepMap({two: 2, arr: [3]}, square);
      square.should.have.been.calledWith(2);
      square.should.have.been.calledWith(3);
    });

    it('is called with @key as second argument', () => {
      let {any} = sinon.match;
      deepMap({two: 2, arr: [3]}, square);
      square.should.have.been.calledWith(any, 'two');
      square.should.have.been.calledWith(any, 0);
    });

  });

  describe('@options', () => {

    it('throws TypeError if defined but not an object', () => {
      deepMap.bind(null, {two: 2}, square, 42).should.throw(TypeError);
    });

    describe('option: thisArg', () => {

      it('sets the context within @mapFn', () => {
        deepMap({two: 2, arr: [3]}, square, {thisArg: 42});
        square.should.have.been.calledOn(42);
      });

      it('defaults to undefined', () => {
        deepMap({two: 2, arr: [3]}, square);
        square.should.have.been.calledOn(undefined);
      });

    });

    describe('option: inPlace', () => {
      let arr: number[];
      let obj: {two: number, arr: number[]};

      beforeEach(() => {
        arr = [3];
        obj = {two: 2, arr};
      });

      it('transforms @object in place', () => {
        let result = deepMap(obj, square, {inPlace: true});
        result.should.deep.equal({two: 4, arr: [9]});
        result.should.equal(obj);
      });

      it('transforms sub-objects/sub-arrays in place', () => {
        deepMap(obj, square, {inPlace: true}).arr.should.equal(arr);
      });

      it('defaults to false', () => {
        deepMap(obj, square).should.not.equal(obj);
      });

    });

  });

});
