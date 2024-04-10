const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

// Set the keyword to search for
const keyword = 'games';

// Set the base URL for the website with the keyword
const urlWithKeyword = 'http://localhost:3000/with-keyword';

// Set the base URL for the website without the keyword
const urlWithoutKeyword = 'https://en.wikipedia.org/wiki/Elephant/without-keyword';

async function runTest(url, hasKeyword) {
  let driver;
  try {
    //driver = await new Builder().forBrowser('chrome').build();
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options => options.setAcceptInsecureCerts(true))
      .build();

    await driver.get(url);

    let presenceTime = 0;
    let foundKeyword = false;

    // Wait for the page to fully load before starting the keyword search  
    driver.wait(until.elementLocated(By.tagName('body')), 30000);

    // Check if the content contains the keyword every second
    const checkInterval = setInterval(async () => {
      //const content = await driver.findElement(By.tagName('body')).getAttribute('innerText');
      const content = await driver.executeScript('return document.documentElement.outerHTML;');
      if (content.includes(keyword)) {
        clearInterval(checkInterval);
        foundKeyword = true;

        // Extend presence time by 10 seconds if the keyword is found
        presenceTime += 10;
      }

      presenceTime++;

      if (presenceTime >= 60) {
        clearInterval(checkInterval);
      }
    }, 1000);

    console.log(`Presence time on ${url}: ${presenceTime} seconds`);
    console.log(`Keyword found: ${foundKeyword}`);

    if (hasKeyword) {
      await driver.takeScreenshot().then(buffer => {
        fs.writeFileSync(path.join(__dirname, 'Images', 'with-keyword.png'), buffer);
      });
    } else {
      await driver.takeScreenshot().then(buffer => {
        fs.writeFileSync(path.join(__dirname, 'Images', 'without-keyword.png'), buffer);
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

// Run the test against the website with the keyword
runTest(urlWithKeyword, true);

// Run the test against the website without the keyword
runTest(urlWithoutKeyword, false);
