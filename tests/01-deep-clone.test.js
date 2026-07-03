const { deepClone } = require('../solutions/01-deep-clone.js');
const assert = require('assert');

console.log('Running deepClone tests...');

// 1. Test primitives
assert.strictEqual(deepClone(42), 42);
assert.strictEqual(deepClone('hello'), 'hello');
assert.strictEqual(deepClone(true), true);
assert.strictEqual(deepClone(null), null);
assert.strictEqual(deepClone(undefined), undefined);

// 2. Test Dates
const originalDate = new Date('2026-07-03T12:00:00Z');
const clonedDate = deepClone(originalDate);
assert.deepStrictEqual(clonedDate, originalDate);
assert.notEqual(clonedDate, originalDate); // Must be different references

// 3. Test RegExps
const originalRegex = /abc/gi;
const clonedRegex = deepClone(originalRegex);
assert.deepStrictEqual(clonedRegex, originalRegex);
assert.notEqual(clonedRegex, originalRegex);

// 4. Test Maps
const originalMap = new Map();
const objKey = { key: 'temp' };
originalMap.set(objKey, { value: 'tempVal' });
const clonedMap = deepClone(originalMap);
assert.notEqual(clonedMap, originalMap);
// Ensure keys/values are cloned recursively
const clonedKeys = Array.from(clonedMap.keys());
assert.notEqual(clonedKeys[0], objKey);
assert.deepStrictEqual(clonedKeys[0], objKey);
assert.deepStrictEqual(clonedMap.get(clonedKeys[0]), { value: 'tempVal' });

// 5. Test Sets
const originalSet = new Set([{ item: 1 }, { item: 2 }]);
const clonedSet = deepClone(originalSet);
assert.notEqual(clonedSet, originalSet);
const clonedItems = Array.from(clonedSet);
assert.notEqual(clonedItems[0], Array.from(originalSet)[0]);
assert.deepStrictEqual(clonedItems[0], { item: 1 });

// 6. Test Arrays and Objects
const originalObj = {
  a: 1,
  b: [2, 3, { c: 4 }],
  d: { e: 5 }
};
const clonedObj = deepClone(originalObj);
assert.notEqual(clonedObj, originalObj);
assert.notEqual(clonedObj.b, originalObj.b);
assert.notEqual(clonedObj.b[2], originalObj.b[2]);
assert.deepStrictEqual(clonedObj, originalObj);

// 7. Test Circular References
const circularObj = { name: 'circular' };
circularObj.self = circularObj;
circularObj.nested = { parent: circularObj };
const clonedCircular = deepClone(circularObj);
assert.notEqual(clonedCircular, circularObj);
assert.strictEqual(clonedCircular.self, clonedCircular);
assert.strictEqual(clonedCircular.nested.parent, clonedCircular);

// 8. Test Symbols and Non-enumerable properties
const sym = Symbol('foo');
const specialObj = {};
Object.defineProperty(specialObj, 'nonEnum', {
  value: 'hidden',
  enumerable: false,
  writable: true,
  configurable: true
});
specialObj[sym] = 'symbolVal';

const clonedSpecial = deepClone(specialObj);
assert.strictEqual(clonedSpecial.nonEnum, 'hidden');
assert.strictEqual(clonedSpecial[sym], 'symbolVal');
// Ensure descriptors are preserved
const clonedDescriptor = Object.getOwnPropertyDescriptor(clonedSpecial, 'nonEnum');
assert.strictEqual(clonedDescriptor.enumerable, false);

console.log('All deepClone tests passed successfully!');
