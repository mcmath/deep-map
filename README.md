# Deep Map

[![Version][version-badge]][npm]
[![License][license-badge]][license]
[![Build][build-badge]][travis]
[![Coverage][coverage-badge]][coveralls]
[![Dependencies][dependencies-badge]][gemnasium]

[Install](#install) | [Usage](#usage) | [API](#api) | [TypeScript](#typescript) | [License](#license)

**Deep Map** recurses through an object and transforms its primitive values
&ndash; including nested values &ndash; according to some function. Essentially,
it's a deep version of [`Array.prototype.map()`][array-prototype-map] that
works on all objects rather than just on Arrays. Circular references are
supported.

To transform the *keys* of an object rather than its values, use
[Deep Map Keys][deep-map-keys].

## Install

Install Deep Map via [npm][npm].

```sh
npm install --save deep-map
```

## Usage

Let's say we have an object like this:

```js
const info = {
  name: '<%- name %>',
  email: '<%- email %>',
  keywords: ['<%- keyword1 %>', '<%- keyword2 %>'],
  hobbies: {
    primary: '<%- hobby1 %>',
    secondary: '<%- hobby2 %>'
  }
};
```

And we want to fill it with this data:

```js
const data = {
  name: 'Samuel Johnson',
  email: 'sam.johnson@dictionary.com',
  keyword1: 'dictionary',
  keyword2: 'lexicography',
  hobby1: 'writing',
  hobby2: 'torying',
};
```

We can use Deep Map like this:

```js
const deepMap = require('deep-map');
const template = require('lodash/template');

let result = deepMap(info, value => template(value)(data));
```

And the result looks like this:

```js
{
  name: 'Samuel Johnson',
  email: 'sam.johnson@dictionary.com',
  keywords: ['dictionary', 'lexicography'],
  hobbies: {
    primary: 'writing',
    secondary: 'torying'
  }
}
```

## API

#### `deepMap(object, mapFn, [options])`

#### Parameters

<table>
  <thead>
    <tr>
      <th align="left">Param</th>
      <th align="left">Type</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>object</td>
      <td><code>any</code></td>
      <td>
        The object whose values are to be transformed. Typically, this will be
        a complex object containing other nested objects. This object may be an
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array">
        <code>Array</code></a>, and may contain nested arrays whose values will
        be deeply transformed in the same way. The object may contain circular
        references.
      </td>
    </tr>
    <tr>
      <td>mapFn</td>
      <td><code>function</code></td>
      <td>
        The function used to transform each primitive value. The function is
        called with two arguments:
        <ul>
          <li>
            <strong>value</strong> &lt;<code>any</code>&gt;
            The value being transformed.
          </li>
          <li>
            <strong>key</strong> &lt;<code>string | number</code>&gt;
            The key or index of the value being transformed. In the case
            of plain objects, this will be a string; in the case of arrays,
            this will be a number.
          </li>
        </ul>
        The return value determines the value at the same position on the
        resulting object.
      </td>
    </tr>
    <tr>
      <td>[options]</td>
      <td><code>object</code></td>
      <td>
        An optional options object. The following options are accepted:
        <ul>
          <li>
            <strong>inPlace</strong> &lt;<code>boolean=false</code>&gt;
            Mutate <code>object</code> rather than constructing a new
            object. Nested objects will also be mutated.
          </li>
          <li>
            <strong>thisArg</strong> &lt;<code>any=undefined</code>&gt;
            Sets the value of
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this"><code>this</code></a>
            within <code>mapFn()</code>.
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

#### Returns

Returns a new object with the same keys as `object`. If `options.inPlace` is set
to `true`, the original object is returned, mutated.

## TypeScript

[TypeScript][typescript] declarations are included in the package. Just import
the module, and things will just work.

By default, the compiler will assume that the return value will have the same
shape as the input object. In most use cases, this is likely to be true. But in
some cases &ndash; like the one below &ndash; the assumption breaks down.

```ts
function isPositive(n: number): boolean {
  return n >= 0;
}

// COMPILER ERROR: number not assignable to boolean :(
let bool: boolean = deepMap({n: 2}, isPositive).n;
```

Pass a type argument to describe the shape of the return value, and everything
will be happy.

```ts
let bool: boolean = deepMap<{n: boolean}>({n: 2}, isPositive).n; // :)
```

## License

Copyright &copy; 2016&ndash;2017 Akim McMath. Licensed under the [MIT License][license].

[version-badge]: https://img.shields.io/npm/v/deep-map.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/deep-map.svg?style=flat-square
[build-badge]: https://img.shields.io/travis/mcmath/deep-map/master.svg?style=flat-square
[coverage-badge]: https://img.shields.io/coveralls/mcmath/deep-map/master.svg?style=flat-square&service=github
[dependencies-badge]: https://img.shields.io/gemnasium/mcmath/deep-map.svg?style=flat-square
[npm]: https://www.npmjs.com/package/deep-map
[license]: LICENSE
[travis]: https://travis-ci.org/mcmath/deep-map
[coveralls]: https://coveralls.io/github/mcmath/deep-map?branch=master
[gemnasium]: https://gemnasium.com/mcmath/deep-map
[deep-map-keys]: https://github.com/mcmath/deep-map-keys
[typescript]: http://www.typescriptlang.org/
[array-prototype-map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
