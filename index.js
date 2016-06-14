'use strict';

var isArray = Array.isArray;

function deepMap(object, fn, opts) {
  opts = opts || {};

  if (!fn) {
    throwError(Error, 'transformFn must be defined');
  } else if (!isFunction(fn)) {
    throwError(TypeError, 'transformFn must be a function');
  } else if (!isObject(opts)) {
    throwError(TypeError, 'options must be an object or undefined');
  }

  return map(object, fn, opts);
}

function map(value, fn, opts, key) {
  return isArray(value) ? mapArray(value, fn, opts) :
    isObject(value) ? mapObject(value, fn, opts) :
    fn.call(opts.thisArg, value, key);
}

function mapArray(array, fn, opts) {
  var result = opts.inPlace ? array : [];

  var length = array.length;
  for (var i = 0; i < length; i++) {
    result[i] = map(array[i], fn, opts, i);
  }

  return result;
}

function mapObject(object, fn, opts) {
  var result = opts.inPlace ? object : {};

  for (var key in object) {
    result[key] = map(object[key], fn, opts, key);
  }

  return result;
}

function isFunction(value) {
  return typeof value === 'function';
}

function isObject(value) {
  return typeof value === 'object' || isFunction(value);
}

function throwError(ErrorContructor, message) {
  var err = new ErrorContructor(message);
  Error.captureStackTrace(err, deepMap);
  throw err;
}

module.exports = deepMap;
