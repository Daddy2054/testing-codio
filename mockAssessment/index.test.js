const fibonacci = require('./index');

// WRITE YOUR CODE HERE

const mockFibonacci = jest.fn(n => {
  switch (n) {
    case 0:
      return 1;
    case 1:
      return 1;
    case 2:
      return 8;
    case 5:
      return 8;
    default:
      return 1;
  }
});

// CODE FREEZE BEGIN

describe("Testing mock function", () => {

  test("fibonacci function returns correct result with 5", () => {
    mockFibonacci(5);
    expect(mockFibonacci.mock.results[0].value).toBe(8);
  });

  test("fibonacci function returns correct result with 0", () => {
    mockFibonacci(0);
    expect(mockFibonacci.mock.results[1].value).toBe(1);
  });

  test("fibonacci function returns correct result with 1", () => {
    mockFibonacci(1);
    expect(mockFibonacci.mock.results[2].value).toBe(1);
  });

  test("fibonacci function returns correct result with 2", () => {
    mockFibonacci(2);
    expect(mockFibonacci.mock.results[3].value).toBe(8);
  });

  test("fibonacci function returns correct result for negative numbers", () => {
    mockFibonacci(-1);
    expect(mockFibonacci.mock.results[4].value).toBe(1);
  });

});

// CODE FREEZE END