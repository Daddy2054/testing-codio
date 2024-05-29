const {Given, When, Then, setWorldConstructor} = require('@cucumber/cucumber');
const {By, until, Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const timeOut = 10000;

setWorldConstructor(function(options) {
  this.driver = new Builder().forBrowser('chrome')
//   .setChromeOptions(new chrome.Options().addArguments('--headless=new'))
  .build();
  //   .setChromeOptions(new chrome.Options().addArguments('--headless'))
});

Given('A user opens Codio login page', async function () {
    await this.driver.manage().setTimeouts({ implicit: 10000 });
  await this.driver.get('https://codio.com/p/login');
  let formTitle = await this.driver.findElement(By.className('form-title title'));
  await this.driver.wait(until.elementIsVisible(formTitle));
  //   await this.driver.wait(until.elementIsVisible(formTitle), timeOut);
  await console.log('    ...Page opened, and form title is \'' + await formTitle.getText() + '\'');
});

When('The username field filled up with {string}', async function (string) {
    let field = await this.driver.findElement(By.name('user'));
  await this.driver.wait(until.elementIsVisible(field), timeOut);
  await field.sendKeys(string);
  await console.log('    ...Username field filled with name \'' + await field.getAttribute('value') + '\'');
});

When('The password field filled up with {string}', async function (string) {
  let field = await this.driver.findElement(By.css('.ReactPasswordStrength-input'));
  await this.driver.wait(until.elementIsVisible(field), timeOut);
  await field.sendKeys(string);
  await console.log('    ...Password field filled with password \'' + await field.getAttribute('value') + '\'');
});

Then('The {string} button should be disabled', async function (string) {
  let button = await this.driver.findElement(By.xpath("//button[text()='Sign In']"));
  await this.driver.wait(until.elementIsVisible(button), timeOut);
  await console.log('    ...Sign In button\'s \'disabled\' attribute is ' + await button.getAttribute("disabled"));
  await button.isEnabled().then(function(isEnabled) {
    assert.ok(!isEnabled, 'Button is disabled');
  });
});

Then('The {string} button should be enabled', async function (string) {
  let button = await this.driver.findElement(By.xpath("//button[text()='Sign In']"));
  await this.driver.wait(until.elementIsVisible(button), timeOut);
  await console.log('    ...Sign In button\'s \'disabled\' attribute is ' + await button.getAttribute("disabled"));
  await button.isEnabled().then(function(isEnabled) {
    assert.ok(isEnabled, 'Button is enabled');
  });
});