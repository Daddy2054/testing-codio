const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require("assert");

(async function example() {
  let driver;
  try {
    options = new chrome.Options()

    driver = await new Builder()
      .forBrowser('chrome')
      //   .setChromeOptions(new chrome.Options().headless)
      .setChromeOptions(options.addArguments('--headless=new'))
      .build();
    await driver.manage().setTimeouts({ implicit: 10000 });

    await driver.get('http://127.0.0.1:3000/selenium/sample.html');
    let el = await driver.findElement(By.xpath('//div[@id="blue"]'));
    await driver.wait(until.elementIsVisible(el), 1000);
    let elText = await el.getText();
    console.log(elText);

    let txt = await driver.findElement(By.css('.story'));
    let elText2 = await txt.getText();
    assert.strictEqual(elText2, "Once upon a timsfe...");

  } catch (err) {
    console.error(err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
})();

