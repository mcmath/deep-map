interface TransformFn {
  (value: any, key: string|number): any;
}

interface Options {
  thisArg?: any;
  inPlace?: boolean;
}

declare function deepMap<T>(object: T, transformFn: TransformFn, options?: Options): T;

export = deepMap;
