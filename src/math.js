// A tiny module with a few pure functions.
// This is the "code" that our automatic review (lint + tests) will check on every Pull Request.

/**
 * Add two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function add(a, b) {
  return a + b;
}

/**
 * Subtract b from a.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function subtract(a, b) {
  return a - b;
}

/**
 * Divide a by b. Throws on divide-by-zero so the tests can prove the guard works.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}
