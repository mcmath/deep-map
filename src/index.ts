import {isFunction, isNil, isObject} from 'lodash';
import {DeepMap, MapFn, Opts} from './deep-map';

function deepMap<T>(object: T, mapFn: MapFn, options?: Opts): T;
function deepMap<T>(object: any, mapFn: MapFn, options?: Opts): T;

function deepMap(object: any, mapFn: MapFn, options?: Opts): any {
  options = isNil(options) ? {} : options;

  if (!mapFn) {
    throw new Error('mapFn is required');
  } else if (!isFunction(mapFn)) {
    throw new TypeError('mapFn must be a function');
  } else if (!isObject(options)) {
    throw new TypeError('options must be an object');
  }

  return new DeepMap(mapFn, options).map(object);
}

export = deepMap;
