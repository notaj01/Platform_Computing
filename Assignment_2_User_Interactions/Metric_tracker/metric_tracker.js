const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function() {
    // Set up Chrome options
    let chromeOptions = new chrome.Options();
    // Disable image loading to reduce page load time
    chromeOptions.addArguments("--blink-settings=imagesEnabled=false");

    // Initialize WebDriver
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();

    try {
        // Navigate to the website
        await driver.get('http://localhost:3000/');

        // Initialize variables for tracking metrics
        let startTime = new Date().getTime(); // Get start time

        // Track scrolling
        let totalScroll = 0;
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");

        // Set interval to track scrolling every second
        let scrollInterval = setInterval(async () => {
            let currentScroll = await driver.executeScript("return window.pageYOffset;");
            totalScroll += Math.abs(currentScroll - totalScroll);
        }, 1000);

        // Set interval to track time spent on the website every second
        let timeInterval = setInterval(() => {
            let currentTime = new Date().getTime();
            let elapsedTime = (currentTime - startTime) / 1000; // Convert milliseconds to seconds
            console.log(`Time spent on website: ${elapsedTime} seconds`);
        }, 1000);

        // Wait for a certain duration or user action
        await driver.sleep(60000); // For example, wait for 60 seconds

        // Clear intervals and close the browser
        clearInterval(scrollInterval);
        clearInterval(timeInterval);
        await driver.quit();
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();
