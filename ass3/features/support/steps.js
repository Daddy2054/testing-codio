// FREEZE CODE BEGIN
const {Given, When, Then, setWorldConstructor} = require('@cucumber/cucumber');
const assert = require('assert');
const {By, Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const file = process.argv[2];
// FREEZE CODE END


// WRITE YOUR CODE HERE
const { until } = require('selenium-webdriver');
setWorldConstructor(function (options) {
  this.driver = new Builder().forBrowser('chrome')
  .setChromeOptions(new chrome.Options()
  .addArguments('--headless'))
    .build();
});

Given('I open the capitals.html file', async function () {
  await this.driver.get('http://127.0.0.1:3000/ass3/capitals.html');
  await this.driver.wait(until.titleContains('Capitals'), 10000); // Wait for the page title to contain 'Capitals'
});
// Given('I open the {string} file', async function (string) {
//   await this.driver.get(string);
//   await this.driver.wait(until.titleContains('Capitals'), 10000); // Wait for the page title to contain 'Capitals'
// });

When('I select the second capital city', async function () {
  const cell = await this.driver.findElement(By.css('table tbody tr:nth-child(3) td:nth-child(2)'));
});


Then('I expect to see {string}', async function (string) {
  const cell = await this.driver.findElement(By.css('table tbody tr:nth-child(3) td:nth-child(2)'));
  const actualCapital = await cell.getText();
  assert.strictEqual(actualCapital, string);
});

// possible solution
// setWorldConstructor(function(options) {
//   this.driver = new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--headless')).build();
// });

// Given(/^I open the "([^"]*)" file$/, async function (file) {
//   await this.driver.get(file);
// });

// When(/^I select the second capital city$/, async function () {
//   let secondCapitalElement = await this.driver.findElement(By.css('tr:nth-child(3) > td:nth-child(2)'));
//   this.secondCapitalText = await secondCapitalElement.getText();
// });

// Then(/I expect to see "([^"]*)"$/, async function (expected) {
//   assert.strictEqual(this.secondCapitalText, expected);
// });