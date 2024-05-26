const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome'); 
const assert = require ("assert");
(async function example() {
  let driver;
  try {
    options=new chrome.Options()
    driver = await new Builder()
      .forBrowser('chrome')
    //   .setChromeOptions(new chrome.Options().headless)
    // .setChromeOptions(options.addArguments('--headless=new'))
      .build();
    await driver.get('https://www.google.com/');
    await driver.findElement(By.name('q')).sendKeys('selenium', Key.RETURN);
    await driver.wait(until.titleIs('selenium - Google Search'), 1000);
    // assertions
    let searchElement = await driver.findElement(By.name('q'));
    await driver.wait(until.elementIsVisible(searchElement), 1000);
    let searchText = await searchElement.getAttribute('value');
    console.log("Get the text from search element:", searchText);
    assert.strictEqual(searchText, "selenium");  
} catch (err) {
      console.error(err);
  } finally {
      if (driver) {
        await driver.quit();
      }
  }
})();