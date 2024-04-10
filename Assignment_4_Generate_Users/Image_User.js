const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

// Set the base URL for the website with images
const urlWithImages = 'http://localhost:3000/with-images';

// Set the base URL for the website without images
const urlWithoutImages = 'https://www.example.com/without-images';

async function runTest(url) {
  let driver;
  let presenceTime = 0;
  let imagesFound = 0;

  try {
    driver = await new Builder().forBrowser('chrome').build();

    await driver.get(url);

    // Check if the content contains images every second
    const checkInterval = setInterval(async () => {
      const images = await driver.findElements(By.tagName('img'));

      if (images.length > 0) {
        imagesFound += images.length;
        presenceTime += 10; // Extend presence time by 10 seconds for each image
      }

      if (presenceTime >= 20 || imagesFound === 0) {
        clearInterval(checkInterval);
      }
    }, 1000);

    await driver.sleep(20000); // Wait for 20 seconds to ensure all images have loaded

    console.log(`Presence time on ${url}: ${presenceTime} seconds`);
    console.log(`Images found: ${imagesFound}`);

    if (imagesFound > 0) {
      await driver.takeScreenshot().then(buffer => {
        fs.writeFileSync(path.join(__dirname, 'Images', 'with-images.png'), buffer);
      });
    } else {
      await driver.takeScreenshot().then(buffer => {
        fs.writeFileSync(path.join(__dirname, 'Images', 'without-images.png'), buffer);
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

// Run the test against the website with images
runTest(urlWithImages);

// Run the test against the website without images
runTest(urlWithoutImages);
