import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

async function scrapeAmazon(asin) {
    const url = `https://www.amazon.com/dp/${asin}`;
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const content = await page.content();
    const $ = cheerio.load(content);

    const title = $('#productTitle').text().trim();
    const description = $('#feature-bullets ul').text().trim();
    const climatePledge = $('[aria-label*="Climate Pledge Friendly"]').text().trim();

    await browser.close();

    return { title, description, climatePledge };
}

// Example usage
(async () => {
    const productData = await scrapeAmazon("B0CCH81HP8");  // Replace with a real ASIN
    console.log(productData);
})();