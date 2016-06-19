import WeakMap = require('es6-weak-map');
import {isArray, isObject} from 'lodash';

interface NonPrimitive extends Object {
  [key: string]: any;
  [index: number]: any;
}

export interface MapFn {
  (value: any, key: string|number): any;
}

export interface Opts {
  thisArg?: any;
  inPlace?: boolean;
}

export class DeepMap {

  private cache = new WeakMap<NonPrimitive, any>();

  constructor(
    private mapFn: MapFn,
    private opts: Opts
  ) { }

  public map(value: any, key?: string|number): any {
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

  private mapObject(obj: NonPrimitive): NonPrimitive {
    if (this.cache.has(obj)) {
      return this.cache.get(obj);
    }

    let result = this.opts.inPlace ? obj : {};
    this.cache.set(obj, result);

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = this.map(obj[key], key);
      }
    }

    return result;
  }
}
