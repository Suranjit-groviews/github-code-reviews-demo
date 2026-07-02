import { add, subtract, divide, average } from '../src/math.js';

describe('math', () => {
  test('add() sums two numbers', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  test('subtract() subtracts the second from the first', () => {
    expect(subtract(10, 4)).toBe(6);
  });

  test('divide() divides two numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  test('divide() throws on divide-by-zero', () => {
    expect(() => divide(1, 0)).toThrow('Cannot divide by zero');
  });

  test('average() computes the arithmetic mean', () => {
    expect(average([2, 4, 6])).toBe(4);
    expect(average([10])).toBe(10);
  });

  test('average() returns 0 for an empty array (no NaN)', () => {
    expect(average([])).toBe(0);
  });
});
