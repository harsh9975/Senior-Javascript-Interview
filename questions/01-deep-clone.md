# Question 1: Implement `deepClone`

Implement a robust deep clone function in JavaScript that can handle various data types, structures, and edge cases.

## Requirements

Your implementation should handle:
1. **Primitives**: numbers, strings, booleans, null, undefined, symbols, bigints.
2. **Plain Objects**: cloned recursively.
3. **Arrays**: cloned recursively.
4. **Dates**: cloned as new `Date` objects with the same time.
5. **Maps**: cloned recursively (keys and values).
6. **Sets**: cloned recursively (values).
7. **Circular References**: prevent infinite loops and correctly preserve references (i.e., if `obj.self === obj`, the clone should have `cloned.self === cloned`).

## Solution

You can view the full implementation here: [solutions/01-deep-clone.js](file:///Users/harishgautam/Desktop/Senior%20Javascript%20Interview/solutions/01-deep-clone.js).

## Test Cases

A comprehensive test suite is implemented in [tests/01-deep-clone.test.js](file:///Users/harishgautam/Desktop/Senior%20Javascript%20Interview/tests/01-deep-clone.test.js). The tests cover:
- Cloning basic primitives
- Cloning nested arrays and objects
- Cloning Map and Set instances (recursively key/value cloning)
- Cloning Date and RegExp instances
- Handling circular references correctly
- Handling Symbol keys and non-enumerable properties (preserving property descriptors)

