import WeakMap = require('es6-weak-map');
import {isArray, isObject, isFunction, isNil} from 'lodash';

export interface DeepMapModule {
  <T>(object: any, mapFn: MapFn, options?: Opts): T;
  default<T>(object: any, mapFn: MapFn, options?: Opts): T;
}

export interface MapFn {
  (value: any, key: string | number): any;
}

export interface Opts {
  thisArg?: any;
  inPlace?: boolean;
}

export const deepMapModule: DeepMapModule = function deepMap(object: any, mapFn: MapFn, options?: Opts): any {
  options = isNil(options) ? {} : options;

  if (!mapFn) {
    throw new Error('mapFn is required');
  } else if (!isFunction(mapFn)) {
    throw new TypeError('mapFn must be a function');
  } else if (!isObject(options)) {
    throw new TypeError('options must be an object');
  }

  return new DeepMap(mapFn, options).map(object);
} as any;

deepMapModule.default = deepMapModule;

class DeepMap {

  private cache = new WeakMap<object, any>();

  constructor(
    private mapFn: MapFn,
    private opts: Opts
  ) { }

  public map(value: any, key?: string | number): any {
    return isArray(value) ? this.mapArray(value) :
      isObject(value) ? this.mapObject(value) :
      this.mapFn.call(this.opts.thisArg, value, key);
  }

  private mapArray(arr: any[]): any[] {
    if (this.cache.has(arr)) {
      return this.cache.get(arr);
    }

    let length = arr.length;
    let result = this.opts.inPlace ? arr : [];
    this.cache.set(arr, result);

    for (let i = 0; i < length; i++) {
      result[i] = this.map(arr[i], i);
    }

    return result;
  }

  private mapObject(obj: object): object {
    if (this.cache.has(obj)) {
      return this.cache.get(obj);
    }

    let result = this.opts.inPlace ? obj : {};
    this.cache.set(obj, result);

    for (let key in obj as any) {
      if (obj.hasOwnProperty(key)) {
        result[key] = this.map(obj[key], key);
      }
    }

    return result;
  }
}
