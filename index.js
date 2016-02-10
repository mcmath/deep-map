'use strict';

var isArray = require('lodash/isArray');
var isFunction = require('lodash/isFunction');
var isObject = require('lodash/isObject');
var isUndefined = require('lodash/isUndefined');



function deepMap(object, fn, opts) {
  opts = opts || {};

  if (isUndefined(fn)) {
    throwError(Error, 'transformFn must be defined');
  }

  if (!isFunction(fn)) {
    throwError(TypeError, 'transformFn must be a function');
  }

  if (!isObject(opts)) {
    throwError(TypeError, 'options must be an object or undefined');
  }

  return transform(object, fn, opts);
}


function transform(value, fn, opts, key) {
  return isArray(value) ? mapArray(value, fn, opts)
    : isObject(value) ? mapObject(value, fn, opts)
    : fn.call(opts.thisArg, value, key);
}


function mapArray(array, fn, opts) {
  var result = opts.inPlace ? array : [];

  var length = array.length;
  for (var i = 0; i < length; i++) {
    result[i] = transform(array[i], fn, opts, i);
  }

  return result;
}


function mapObject(object, fn, opts) {
  var result = opts.inPlace ? object : {};

  for (var key in object) {
    result[key] = transform(object[key], fn, opts, key);
  }

  return result;
}


function throwError(ErrorContructor, message) {
  var err = new ErrorContructor(message);
  Error.captureStackTrace(err, deepMap);
  throw err;
}


module.exports = deepMap;
