// FREEZE CODE BEGIN
const checkTriangle = require('./triangle');
// FREEZE CODE END

// npm test triangle
describe('Triangle Tests', () => {

// WRITE YOUR CODE HERE

test('Triangle is equilateral', () => {
  expect(checkTriangle(10,10,10)).toBe('Triangle exists');
});
test('Side1 is equal to sum of two', () => {
  expect(checkTriangle(10,5,5)).toBe('Triangle does not exist');
});
test('Side1 is more than sum of two', () => {
  expect(checkTriangle(11,5,5)).toBe('Triangle does not exist');
});
test('Side1 is less than sum of two', () => {
  expect(checkTriangle(9,5,5)).toBe('Triangle exists');
});
});