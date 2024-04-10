const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

// Set the keyword to search for
const keyword = 'games';

// Set the base URL for the website with the keyword
const urlWithKeyword = 'http://localhost:3000/with-link';

// Set the base URL for the website without the keyword
const urlWithoutKeyword = 'https://docs.google.com/document/d/1RMOmXTiH0Kk1aXFKV9uYu4vD0tg7zmKGChYU45uedlk/edit/without-link';

async function runTest(url, hasKeyword) {
  let driver;
  let presenceTime = 0;
  let keywordFound = false;
  let imageFound = false;

  try {
    driver = await new Builder().forBrowser('chrome').build();
    
    await driver.get(url);

    // Check if the content contains the keyword every second
    const checkKeywordInterval = setInterval(async () => {
      const content = await driver.findElement(By.tagName('body')).getAttribute('innerText');
      if (content.includes(keyword)) {
        clearInterval(checkKeywordInterval);
        keywordFound = true;

        // Extend presence time by 10 seconds if the keyword is found
        presenceTime += 10;
      }

      presenceTime++;

      if (presenceTime >= 20) {
        clearInterval(checkKeywordInterval);
      }
    }, 1000);

    // Check if there are any images on the page
    const images = await driver.findElements(By.tagName('img'));
    if (images.length > 0) {
      imageFound = true;

      // Extend presence time by 10 seconds for each image
      for (const image of images) {
        await driver.sleep(10000);
        presenceTime += 10;
      }
    }

    await driver.sleep(5000); // wait for 5 seconds
    // Check if there is a link on the page
    const link = await driver.findElement(By.tagName('a'));
    if (link) {
      await link.click();

      // Wait for the new page to load
      await driver.wait(until.elementLocated(By.tagName('body')), 10000);

      // Recursively check this requirement and the image and keyword requirements above
      await runTest(driver.getCurrentUrl(), true);

      // Go back to the previous page
      await driver.navigate().back();

      // Wait for the previous page to load
      await driver.wait(until.elementLocated(By.tagName('body')), 10000);
    } else {
      presenceTime += 10;
    }

    console.log(`Presence time on ${url}: ${presenceTime} seconds`);
    console.log(`Keyword found: ${keywordFound}`);
    console.log(`Image found: ${imageFound}`);

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
