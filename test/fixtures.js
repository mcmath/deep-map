'use stirct';

var template = require('lodash/template');
var sinon = require('sinon');



exports.primitive = {
  source: 42,
  transform: String,
  expected: '42',
};


exports.flatArray = {
  source: ['one', '', 'three'],
  transform: Boolean,
  expected: [true, false, true]
};


exports.flatObject = {
  source: {one: 1, two: 2, three: 3},
  transform: function(value) { return value * value; },
  expected: {one: 1, two: 4, three: 9}
};


exports.nestedArrays = {
  source: ['one', 'two', ['three', 'four'], 'five'],
  transform: function(value) { return value.slice(0, 2); },
  expected: ['on', 'tw', ['th', 'fo'], 'fi']
};


exports.nestedObjects = {
  source: {one: 'one', two: {three: 'three', four: 'four'}, five: 'five'},
  transform: function(value) { return value + '!'; },
  expected: {one: 'one!', two: {three: 'three!', four: 'four!'}, five: 'five!'}
};


exports.withIndex = {
  source: ['one', 'two', 'three'],
  transform: sinon.spy(function(value, i) { return i + ': ' + value; }),
  indices: [0, 1, 2],
  expected: ['0: one', '1: two', '2: three']
};


exports.withKey = {
  source: {one: 1, two: 2, three: 3},
  transform: sinon.spy(function(value, key) { return key + ' ' + value; }),
  keys: ['one', 'two', 'three'],
  expected: {one: 'one 1', two: 'two 2', three: 'three 3'}
};


var subObject = {four: 5};
var superObject = [1, 2, 3, subObject];

exports.inPlace = {
  source: superObject,
  transform: function(value) { return value * 2; },
  subObject: subObject,
  superObject: superObject,
  subObjectCopy: {four: 5},
  superObjectCopy: [1, 2, 3, {four: 5}],
  expected: [2, 4, 6, {four: 10}]
};


var thisArg = { multiplier: 42 };

exports.thisArg = {
  source: [1, 2, 3],
  transform: sinon.spy(function(value) { return value * this.multiplier; }),
  thisArg: thisArg,
  expected: [42, 84, 126]
};


var data = {
  name: 'Samuel Johnson',
  email: 'sam.johnson@dictionary.com',
  keyword1: 'dictionary',
  keyword2: 'lexicography',
  hobby1: 'writing',
  hobby2: 'torying',
};


exports.jsonLike = {
  source: {
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
  },
  transform: function(value) {
    return template(value)(data);
  },
  expected: {
    name: 'Samuel Johnson',
    email: 'sam.johnson@dictionary.com',
    keywords: [
      'dictionary',
      'lexicography'
    ],
    hobbies: {
      primary: 'writing',
      secondary: 'torying'
    }
  },
};
