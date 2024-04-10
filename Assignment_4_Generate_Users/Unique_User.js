const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

// Set the base URL for the website with the keyword
const urlWithKeyword = 'https://en.wikipedia.org/wiki/Web_scraping';

// Set the base URL for the website without the keyword
const urlWithoutKeyword = 'https://www.example.com/without-images';

async function runTest(url, hasKeyword) {
  let driver;
  try {
    driver = await new Builder().forBrowser('chrome').build();

    await driver.get(url);

    // Wait for the page to fully load before checking for elements
    await driver.wait(until.elementLocated(By.tagName('body')), 30000);

    let presenceTime = 0;
    let foundKeyword = false;
    let foundImage = false;
    let foundLink = false;

    // Check if the content contains the keyword every second
    const checkInterval = setInterval(async () => {
      const content = await driver.findElement(By.tagName('body')).getAttribute('innerText');
      if (content.includes(keyword)) {
        clearInterval(checkInterval);
        foundKeyword = true;

        // Extend presence time by 10 seconds if the keyword is found
        presenceTime += 10;
      }

      presenceTime++;

      if (presenceTime >= 20) {
        clearInterval(checkInterval);
      }
    }, 1000);

    // Check if there are any images on the page
    const images = await driver.findElements(By.tagName('img'));
    if (images.length > 0) {
      foundImage = true;

      // Extend presence time by 10 seconds for each image
      for (const image of images) {
        await driver.sleep(10000);
        presenceTime += 10;
      }
    }

    // Check if there is a link on the page
    const link = await driver.findElement(By.tagName('a'));
    if (link) {
      foundLink = true;

      // Wait for the intercepting element to disappear before clicking on the link
      await driver.wait(until.elementLocated(By.css('.vector-menu-toggle')), 10000).then(() => {
        driver.findElement(By.css('.vector-menu-toggle')).click();
      });

      // Extend presence time by 10 seconds for the link
      await driver.sleep(10000);
      presenceTime += 10;

      // Click on the link and repeat the process
      await link.click();
      await driver.wait(until.elementLocated(By.tagName('body')), 10000);
      await runTest(driver.getCurrentUrl(), hasKeyword);
    }

    console.log(`Presence time on ${url}: ${presenceTime} seconds`);
    console.log(`Keyword found: ${foundKeyword}`);
    console.log(`Image found: ${foundImage}`);
    console.log(`Link found: ${foundLink}`);

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

// Set the keyword to search for
const keyword = 'web scraping';
try {
// Run the test against the website with the keyword
runTest(urlWithKeyword, true);

// Run the test against the website without the keyword
runTest(urlWithoutKeyword, false);
} catch (err) {
    console.error(err);

}
