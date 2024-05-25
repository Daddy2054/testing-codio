function evenOdd(num) {
    if (typeof num !== 'number') {
      return NaN;
    }
  
    if (num % 2 == 0) {
      return 'even';
    } else {
      return 'odd';
    }
  }
  
  module.exports = evenOdd;