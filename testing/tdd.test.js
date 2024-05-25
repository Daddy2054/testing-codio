const squareRoot = require('./tdd');

describe('squareRoot function', () => {
  test('function is defined', () => {
    expect(squareRoot).toBeDefined();
  });

  test('return correct result', () => {
  expect(squareRoot(100)).toBe(10);
    expect(squareRoot(9)).toBe(3);
    expect(squareRoot(12)).toBeCloseTo(3.464, 3);
  })

  test('return a number', () => {
    expect(typeof squareRoot(25)).toBe('number');
  });

  test('throw negative number error', () => {
    function checkNegative() {
      squareRoot(-25)
    }
    expect(checkNegative).toThrow('Parameter must be a positive number');
  });

  test('throw non-number error', () => {
    function checkNonNumber() {
      squareRoot('cat')
    }
    expect(checkNonNumber).toThrow('Parameter must be a number');
  });
});