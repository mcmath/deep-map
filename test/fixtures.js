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
  transform: function(value, i) { return i + ': ' + value; },
  expected: ['1: one', '2: two', '3: three']
};


exports.withKey = {
  source: {one: 1, two: 2, three: 3},
  transform: function(value, key) { return key + ' ' + value; },
  expected: {one: 'one 1', two: 'two 2', three: 'three 3'}
};


var subObject = {four: 5};
var superObject = [1, 2, 3, subObject];

exports.inPlace = {
  source: superObject,
  transform: function(value) { return value * 2; },
  subObject: subObject,
  superObject: superObject,
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
  email: 'sam.johnson@dictonary.com',
  keyword1: 'dictonary',
  keyword2: 'lexography',
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
      hobby1: '<%- hobby1 %>',
      hobby2: '<%- hobby2 %>'
    }
  },
  transform: function(value) {
    return template(value)(data);
  },
  expected: {
    name: 'Samuel Johnson',
    email: 'sam.johnson@dictonary.com',
    keywords: [
      'dictonary',
      'lexography'
    ],
    hobbies: {
      hobby1: 'writing',
      hobby2: 'torying'
    }
  },
};
