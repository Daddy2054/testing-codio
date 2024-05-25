function loanRate(age) {
    if (age < 18) {
      return 'Not applicable';
    } else if (age <= 25) {
      return '15%';
    } else if (age <= 45) {
      return '10%';
    } else {
      return '13%';
    }
  }
  
  module.exports = loanRate;