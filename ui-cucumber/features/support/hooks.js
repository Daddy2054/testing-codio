const {Before, After} = require('@cucumber/cucumber');

Before(function() {
  return this.driver.manage().window().maximize();
});

After(function() {
  // return this.driver.quit();
});

module.exports = function() {
  this.After(function() {
    // return this.driver.quit();
  });
};