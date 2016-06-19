declare module 'es6-weak-map' {

  export = class WeakMap<K, V> {
    delete(key: K): boolean;
    get(key: K): V;
    has(key: K): boolean;
    set(key: K, value?: V): this;
  };

}
