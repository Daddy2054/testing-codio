const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

function CustomWorld() {
  this.driver = new Builder()
  .forBrowser('chrome')
  // .setChromeOptions(new chrome.Options()
  .setChromeOptions(options.addArguments('--headless=new'))
  // .addArguments('--headless'))
  .build();
  //
}

module.exports = function () {
  this.World = CustomWorld;
  this.setDefaultTimeout(30000);
};
