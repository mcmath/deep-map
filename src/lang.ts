export const isArray = Array.isArray;

export function isFunction(value: any): boolean {
  return typeof value === 'function';
}

export function isObject(value: any): boolean {
  return !isVoid(value) && (typeof value === 'object' || isFunction(value));
}

export function isVoid(value: any): boolean {
  return value == null;
}
