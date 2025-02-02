import express from 'express';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Use the cors middleware
app.use(cors());

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
  const climatePledge = $('[aria-label*="Climate Pledge Friendly"]').text().trim();

  // Extract mass from "Product Details" table
  let mass = '';
  const productDetailsTable = $('#prodDetails'); // Target the "Product Details" table

  if (productDetailsTable.length > 0) {
    // Look for the "Item Weight" row
    const weightRow = productDetailsTable.find('th:contains("Item Weight")');
    if (weightRow.length > 0) {
      mass = weightRow.next('td').text().trim(); // Get the value in the next <td>
    }
  }

  // Extract product material from "Product Details" table
  let material = '';
  if (productDetailsTable.length > 0) {
    const materialRow = productDetailsTable.find('th:contains("Material")');
    if (materialRow.length > 0) {
      material = materialRow.next('td').text().trim();
    }
  }

  // If material is not found in "Product Details," check "Technical Details"
  if (!material) {
    const technicalDetailsTable = $('#productDetails_techSpec_section_1'); // Target the "Technical Details" table
    if (technicalDetailsTable.length > 0) {
      const techMaterialRow = technicalDetailsTable.find('th:contains("Material")');
      if (techMaterialRow.length > 0) {
        material = techMaterialRow.next('td').text().trim();
      }
    }
  }

  // If material is still not found, check the "Product Description" section
  if (!material) {
    const productDescription = $('#productDescription').text().trim();
    if (productDescription) {
      const materialMatch = productDescription.match(/(made of|material)[\s\S]*?\./i);
      if (materialMatch) {
        material = materialMatch[0].trim();
      }
    }
  }

  await browser.close();

  return { title, climatePledge, material, mass };
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