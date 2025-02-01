import express from 'express';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

const app = express();
const PORT = 3001;

async function scrapeAmazon(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  try {
    await page.waitForSelector('#productTitle', { timeout: 10000 });
  } catch (error) {
    console.error('Product title element did not load in time.', error);
  }

  const content = await page.content();
  const $ = cheerio.load(content);

  const title = $('#productTitle').text().trim();
  const description = $('#feature-bullets ul').text().trim();
  const climatePledge = $('[aria-label*="Climate Pledge Friendly"]').text().trim();

  // Try multiple selectors for the price
  let price = $('#priceblock_ourprice').text().trim();
  if (!price) {
    price = $('#priceblock_dealprice').text().trim();
  }
  if (!price) {
    price = $('#price_inside_buybox').text().trim();
  }
  if (!price) {
    price = $('#newBuyBoxPrice').text().trim();
  }
  if (!price) {
    price = $('#priceblock_saleprice').text().trim();
  }
  if (!price) {
    price = $('[data-asin-price]').attr('data-asin-price');
  }

  if (!price) {
    console.error('Price element not found.');
  } else {
    console.log('Price found:', price);
  }

  await browser.close();

  return { title, description, climatePledge, price };
}

app.get('/scrape', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const data = await scrapeAmazon(url);
    res.json(data);
  } catch (error) {
    res.status(500).send('Error scraping Amazon');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});