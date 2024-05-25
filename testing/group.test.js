const evenOdd = require('./group');

describe('Even or Odd Function', ()=> {
test('check with even number', () => {
  expect(evenOdd(100)).toBe('even');
});

test('check with odd number', () => {
  expect(evenOdd(25)).toBe('odd');
});

test('check with string', () => {
  expect(evenOdd('dog')).toBe(NaN);
});
});