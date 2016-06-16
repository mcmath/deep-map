import {isArray, isFunction, isObject, isVoid} from './lang';

export interface MapFn {
  (value: any, key: string|number): any;
}

export interface Options {
  thisArg?: any;
  inPlace?: boolean;
}

export function deepMap<T>(object: T, mapFn: MapFn, options?: Options): T;
export function deepMap<T>(object: any, mapFn: MapFn, options?: Options): T;

export function deepMap(object: any, mapFn: MapFn, options?: Options): any {
  options = isVoid(options) ? {} : options;

  if (!mapFn) {
    throw new Error('mapFn is required');
  } else if (!isFunction(mapFn)) {
    throw new TypeError('mapFn must be a function');
  } else if (!isObject(options)) {
    throw new TypeError('options must be an object');
  }

  return map(object, mapFn, options);
}

function map(value: any, fn: MapFn, opts: Options, key?: string|number): any {
  return isArray(value) ? mapArray(value, fn, opts) :
    isObject(value) ? mapObject(value, fn, opts) :
    fn.call(opts.thisArg, value, key);
}

function mapArray(arr: any[], fn: MapFn, opts: Options): any[] {
  let result = opts.inPlace ? arr : [];
  let len = arr.length;

  for (let i = 0; i < len; i++) {
    result[i] = map(arr[i], fn, opts, i);
  }

  return result;
}

function mapObject(obj: {[key: string]: any}, fn: MapFn, opts: Options): {[key: string]: any} {
  let result = opts.inPlace ? obj : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = map(obj[key], fn, opts, key);
    }
  }

  return result;
}
