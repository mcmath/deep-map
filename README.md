# deep-map

[![Version][version-badge]][npm]
[![License][license-badge]][license]
[![Build][build-badge]][travis]
[![Coverage][coverage-badge]][coveralls]
[![Dependencies][dependencies-badge]][gemnasium]

Recurses through a JSON-like object and transforms its primitive values.
Effectively applies [*array*.map()][array-map] to each nested array and
[\_.mapValues()][object-map-values] to each nested object.

## Install

Install via [npm][npm]:

```sh
npm install --save deep-map
```

## Example

Suppose we have an object containing some nested template strings:

```js
const templateObject = {
  name: '<%- name %>',
  email: '<%- email %>',
  keywords: [
    '<%- keyword1 %>',
    '<%- keyword2 %>'
  ],
  hobbies: {
    primary: '<%- hobby1 %>',
    secondary: '<%- hobby2 %>'
  }
};
```

And we want to fill it with the following data:

```js
const data = {
  name: 'Samuel Johnson',
  email: 'sam.johnson@dictonary.com',
  keyword1: 'dictionary',
  keyword2: 'lexicography',
  hobby1: 'writing',
  hobby2: 'torying',
};
```

We can use deepMap like so:

```js
const deepMap = require('deep-map');
const template = require('lodash/template');
const fs = require('fs');


let result = deepMap(templateObject, (value) => {
  return template(value)(data);
});


fs.writeFileSync('johnson.json', JSON.stringify(result, null, 2));
```

And here is the result:

```json
{
  "name": "Samuel Johnson",
  "email": "sam.johnson@dictionary.com",
  "keywords": [
    "dictionary",
    "lexicography"
  ],
  "hobbies": {
    "primary": "writing",
    "secondary": "torying"
}
```

## API

### `deepMap(object, transformFn, [options])`

Performs a transformation on each *primitive* value in an object or array.
Properties and indices are visited recursively, so nested primitives will
be transformed. By default, a new object is returned without modifying the
original or any of its nested objects.

##### object

`object|array`

The object to iterate over. This may be an object or an array, and may contain
nested objects and/or arrays.

##### transformFn

`function`

The function to call for each primitive value. The return value of the function
determines the transformed value. The function is invoked with two
arguments:

* **value**: The primitive value being transformed.

* **key**/**index**: The name of the key at the present node in the case of an
object, or the index value in the case of an array.


##### options

`object` (optional)

An options object. The following options are accepted:

* **thisArg**: Set the `this` context within `transformFn`.

* **inPlace**: Mutate the object passed-in rather than returning a new object.
Nested objects are also transformed in-place.

#### Returns

`object|array`

Returns a new object, unless the `inPlace` option is set, in which case the
old object is returned transformed.

## License

Copyright &copy; 2016 Akim McMath. Licensed under the [MIT License][license].

[version-badge]: https://img.shields.io/npm/v/deep-map.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/deep-map.svg?style=flat-square
[build-badge]: https://img.shields.io/travis/akim-mcmath/deep-map/master.svg?style=flat-square
[coverage-badge]: https://img.shields.io/coveralls/akim-mcmath/deep-map/master.svg?style=flat-square&service=github
[dependencies-badge]: https://img.shields.io/gemnasium/akim-mcmath/deep-map.svg?style=flat-square

[npm]: https://www.npmjs.com/package/deep-map
[license]: LICENSE.txt
[travis]: https://travis-ci.org/akim-mcmath/deep-map
[coveralls]: https://coveralls.io/github/akim-mcmath/deep-map?branch=master
[gemnasium]: https://gemnasium.com/akim-mcmath/deep-map

[array-map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
[object-map-values]: https://lodash.com/docs#mapValues
