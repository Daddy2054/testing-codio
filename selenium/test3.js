const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function example() {
    let driver;
    try {
        driver = await new Builder()
            .forBrowser('chrome')
            //   .setChromeOptions(new chrome.Options().headless())
            .setChromeOptions(new chrome.Options().addArguments('--headless=new'))
            .build();
        await driver.manage().setTimeouts({ implicit: 10000 });

        await driver.get('https://codio.com/p/login');
        console.log("Open site 'codio.com'");
    
        await driver.get('https://codio.com/p/login');
        console.log("Open site 'codio.com'");
    
        let nameInputEl = await driver.findElement(By.name('user'));
        await nameInputEl.sendKeys('fakename');
        console.log("Find login field and set name:", "fakename");
    
        let passwordInputEl = await driver.findElement(By.className('ReactPasswordStrength-input'));
        await passwordInputEl.sendKeys('fakepassword');
        console.log("Find password field and set password" , "fakepassword");
    
        let signInButtonEl = await driver.findElement(By.xpath("//button[text()='Sign In']"));
        await signInButtonEl.click();    
        console.log("Find and click 'Sign In' button");
    
        let errorEl = await driver.findElement(By.xpath("//div[@class='alert auth-alert alert--error']"));
        await driver.wait(until.elementIsVisible(errorEl));
        var displayedMessage = await errorEl.getText();
        console.log("Get the error message:", displayedMessage);
    
        assert.strictEqual(displayedMessage, "User name or password is incorrect");
        console.log("Check that error message text is similar to 'User name or password is incorrect'");
    } catch (err) {
        console.error(err);
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
})();