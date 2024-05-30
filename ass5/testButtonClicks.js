// FREEZE CODE BEGIN
const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome'); 
const assert = require('assert');
const file = process.argv[2];
const expectedIncrement = process.argv[3];
const expectedDecrement = process.argv[4];
// FREEZE CODE END



// WRITE YOUR CODE HERE

(async function example() {
    let driver;
    const file2 = 'http://127.0.0.1:3000/ass5/button.html';
    const expectedIncrement2 = '1';
    const expectedDecrement2 = '0';
    try {
      options=new chrome.Options()
      driver = await new Builder()
        .forBrowser('chrome')
      //   .setChromeOptions(new chrome.Options().headless)
      .setChromeOptions(options.addArguments('--headless=new'))
        .build();
  
        await driver.get(file2);
        
        let incrementButton = await driver.findElement(By.id("increment-btn"));
        await incrementButton.click();    
        // console.log("Find and click 'Increment' button");
        let counter = await driver.findElement(By.id("counter"));
        var displayedCounter = await counter.getText();
        // console.log("Find and display counter");
        console.log("Value after increment:", displayedCounter);
        assert.strictEqual(displayedCounter, expectedIncrement2);

        let decrementButton = await driver.findElement(By.id("decrement-btn"));
        await decrementButton.click();    
        // console.log("Find and click 'Decrement' button");
        counter = await driver.findElement(By.id("counter"));
        var displayedCounter = await counter.getText();
        // console.log("Find and display counter");
        console.log("Value after decrement:", displayedCounter);
        assert.strictEqual(displayedCounter, expectedDecrement2);

    }catch (err) {
        console.error(err);
    } finally {
        if (driver) {
          await driver.quit();
        }
    }
    })();

    // possibhle solution

    // (async function testButtonClicks() {
    //     let driver;
    //     try {
    //       driver = await new Builder()
    //         .forBrowser('chrome')
    //         .setChromeOptions(new chrome.Options().headless())
    //         .build();
    //       await driver.get(file);
      
    //       const counter = await driver.findElement(By.xpath('//span[@id="counter"]'));
    //       const incrementBtn = await driver.findElement(By.xpath('//button[@id="increment-btn"]'));
    //       const decrementBtn = await driver.findElement(By.xpath('//button[@id="decrement-btn"]'));
      
    //       await incrementBtn.click();
    //       let counterValue = await counter.getText();
    //       assert.equal(await counterValue, expectedIncrement);
    //       await console.log(`Value after increment: ${counterValue}`);
      
    //       await decrementBtn.click();
    //       counterValue = await counter.getText();
    //       assert.equal(await counter.getText(), expectedDecrement);
    //       await console.log(`Value after decrement: ${counterValue}`);
      
    //     } catch (err) {
    //         console.error(err);
    //     } finally {
    //         if (driver) {
    //           await driver.quit();
    //         }
    //     }
    //   })();