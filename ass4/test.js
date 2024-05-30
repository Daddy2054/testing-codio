// FREEZE CODE BEGIN
const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome'); 
const assert = require('assert');
const file = process.argv[2];
const expectedString = process.argv.slice(3).join(' ');
// FREEZE CODE END



// WRITE YOUR CODE HERE

(async function example() {
  let driver;
  const file2 = 'http://127.0.0.1:3000/ass4/sample.html';
  const expectedString2 ="selenium";
  try {
    options=new chrome.Options()
    driver = await new Builder()
      .forBrowser('chrome')
    //   .setChromeOptions(new chrome.Options().headless)
    .setChromeOptions(options.addArguments('--headless=new'))
      .build();

      await driver.get(file2);
      let searchElement = await driver.findElement(By.css('label[for="name"]'));
      await driver.wait(until.elementIsVisible(searchElement), 1000);
      let searchText = await searchElement.getText();
      console.log( searchText);
      assert.strictEqual(searchText, expectedString2);  
  
  }catch (err) {
    console.error(err);
} finally {
    if (driver) {
      await driver.quit();
    }
}
})();

// Here is one possible solution:

// (async function findElementValue() {
//   let driver;
//   try {
//     driver = await new Builder()
//       .forBrowser('chrome')
//       .setChromeOptions(new chrome.Options().headless())
//       .build();
//     await driver.get(file);
//     const label = await driver.findElement(By.css('label[for="name"]'));
//     const text = await label.getText();
//     await console.log(text);
//     assert.strictEqual(text, expectedString);
//   } catch (err) {
//       console.error(err);
//   } finally {
//       if (driver) {
//         await driver.quit();
//       }
//   }
// })();