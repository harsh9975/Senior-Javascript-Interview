/**
 * Creates a deep clone of a value, handling primitives, arrays, objects,
 * Dates, Maps, Sets, and circular references.
 *
 * @param {*} value - The value to clone.
 * @param {Map} [cache] - A map to cache cloned objects (internal use for circular references).
 * @returns {*} The deep cloned value.
 */
function deepClone(value, seen = new WeakMap()) {
  // Handle primitives and functions
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Handle circular references
  if (seen.has(value)) {
    return seen.get(value);
  }

  // Date
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // Array
  if (Array.isArray(value)) {
    const arr = [];
    seen.set(value, arr);

    for (const item of value) {
      arr.push(deepClone(item, seen));
    }

    return arr;
  }

  // Map
  if (value instanceof Map) {
    const map = new Map();
    seen.set(value, map);

    for (const [key, val] of value) {
      map.set(
        deepClone(key, seen),
        deepClone(val, seen)
      );
    }

    return map;
  }

  // Set
  if (value instanceof Set) {
    const set = new Set();
    seen.set(value, set);

    for (const item of value) {
      set.add(deepClone(item, seen));
    }

    return set;
  }

  // Object (preserve prototype)
  const clonedObj = Object.create(Object.getPrototypeOf(value));
  seen.set(value, clonedObj);

  for (const key of Reflect.ownKeys(value)) {
    clonedObj[key] = deepClone(value[key], seen);
  }

  return clonedObj;
}

module.exports = { deepClone };
