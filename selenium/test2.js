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
    .setChromeOptions(options.addArguments('--headless=new'))
      .build();
    await driver.manage().setTimeouts( { implicit: 10000 } );

    await driver.get('https://codio.com/p/login');
    console.log("Open site 'codio.com'");

    // Using XPath and CSS
    // Using XPath and CSS
    let labelElement = await driver.findElement(By.xpath('/html/body/main/div/div[1]/div/form/div[3]/label'));
    await driver.wait(until.elementIsVisible(labelElement), 1000);
    let labelText = await labelElement.getText();
    console.log(labelText);
    // Using XPath and CSS
    let userElement = await driver.findElement(By.xpath('//input[@name="user"]'));
    await driver.wait(until.elementIsVisible(userElement), 1000);
    let placeholderText = await userElement.getAttribute('placeholder');
    console.log(placeholderText);
    // Using XPath and CSS
    let linkElement = await driver.findElement(By.css('.oauthSigninButtons a:nth-of-type(2)'), 10000);
    await driver.wait(until.elementIsVisible(linkElement), 1000);
    let linkTitle = await linkElement.getAttribute('title');
    console.log(linkTitle);
    // Using XPath and CSS
    let imgElement = await driver.findElement(By.xpath('//div//img[@class="auth-form-logo"]'));
    await driver.wait(until.elementIsVisible(imgElement), 1000);
    let imgSource = await imgElement.getAttribute('src');
    console.log(imgSource);
        // Using XPath and CSS
        let spanElement = await driver.findElement(By.css('div[class="actions"] > span'));
        await driver.wait(until.elementIsVisible(spanElement), 1000);
        let spanText = await spanElement.getText();
        console.log(spanText);
  } catch (err) {
    console.error(err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
})();

