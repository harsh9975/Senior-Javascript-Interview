/**
 * Creates a deep clone of a value, handling primitives, arrays, objects,
 * Dates, Maps, Sets, and circular references.
 *
 * @param {*} value - The value to clone.
 * @param {Map} [cache] - A map to cache cloned objects (internal use for circular references).
 * @returns {*} The deep cloned value.
 */
function deepClone(value, cache = new Map()) {
  // 1. Handle primitives and null/undefined
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // 2. Handle circular references
  if (cache.has(value)) {
    return cache.get(value);
  }

  // 3. Handle Dates
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // 4. Handle RegExps
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  // 5. Handle Sets
  if (value instanceof Set) {
    const clonedSet = new Set();
    cache.set(value, clonedSet);
    for (const item of value) {
      clonedSet.add(deepClone(item, cache));
    }
    return clonedSet;
  }

  // 6. Handle Maps
  if (value instanceof Map) {
    const clonedMap = new Map();
    cache.set(value, clonedMap);
    for (const [key, val] of value) {
      clonedMap.set(deepClone(key, cache), deepClone(val, cache));
    }
    return clonedMap;
  }

  // 7. Handle Arrays and Plain/Custom Objects
  // Create an object of the same prototype to preserve custom constructors if any
  const prototype = Object.getPrototypeOf(value);
  const clonedObj = Array.isArray(value) ? [] : Object.create(prototype);

  // Cache the clone before deep cloning nested keys to resolve circular references
  cache.set(value, clonedObj);

  // Copy all own properties, including Symbols and non-enumerable properties
  const keys = Reflect.ownKeys(value);
  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor) {
      // Recursively clone the value of the property
      const clonedVal = deepClone(descriptor.value, cache);
      
      // Define the property on the cloned object with the same descriptor flags (enumerable, writable, configurable)
      Object.defineProperty(clonedObj, key, {
        ...descriptor,
        value: clonedVal,
      });
    }
  }

  return clonedObj;
}

module.exports = { deepClone };
