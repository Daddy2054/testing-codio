const loanRate = require('./loan');

describe('loanRate Boundary Values', () => {
    test('Check 17', () => {
      expect(loanRate(17)).toBe('Not applicable');
    });
    test('Check 18', () => {
      expect(loanRate(18)).toBe('15%');
    });
    test('Check 19', () => {
      expect(loanRate(19)).toBe('15%');
    });
    test('Check 24', () => {
      expect(loanRate(24)).toBe('15%');
    });
    test('Check 25', () => {
      expect(loanRate(25)).toBe('15%');
    });
    test('Check 26', () => {
      expect(loanRate(26)).toBe('10%');
    });
    test('Check 44', () => {
      expect(loanRate(44)).toBe('10%');
    });
    test('Check 45', () => {
      expect(loanRate(45)).toBe('10%');
    });
    test('Check 46', () => {
      expect(loanRate(46)).toBe('13%');
    });
  });