import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { analyzeText } from './googleNLP.js';

async function scrapeAmazon(asin) {
    const url = `https://www.amazon.com/dp/${asin}`;
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const content = await page.content();
    const $ = cheerio.load(content);

    // Extracting product title
    const title = $('#productTitle').text().trim();

    // Extracting product description
    const description = $('#feature-bullets ul').text().trim();

    // Extracting product mass (weight)
    let mass = '';
    const productDetailsTable = $('#prodDetails'); // Target the "Product Details" table

    if (productDetailsTable.length > 0) {
        // Look for the "Item Weight" row
        const weightRow = productDetailsTable.find('th:contains("Item Weight")');
        if (weightRow.length > 0) {
            mass = weightRow.next('td').text().trim(); // Get the value in the next <td>
        }
    }

    // Extracting product material
    let material = '';
    if (productDetailsTable.length > 0) {
        // Look for the "Material" row in the "Product Details" table
        const materialRow = productDetailsTable.find('th:contains("Material")');
        if (materialRow.length > 0) {
            material = materialRow.next('td').text().trim(); // Get the value in the next <td>
        }
    }

    // If material is not found in "Product Details," check "Technical Details"
    if (!material) {
        const technicalDetailsTable = $('#productDetails_techSpec_section_1'); // Target the "Technical Details" table
        if (technicalDetailsTable.length > 0) {
            const materialRow = technicalDetailsTable.find('th:contains("Material")');
            if (materialRow.length > 0) {
                material = materialRow.next('td').text().trim(); // Get the value in the next <td>
            }
        }
    }

    // If material is still not found, check the "Product Description" section
    if (!material) {
        const productDescription = $('#productDescription').text().trim();
        if (productDescription) {
            // Look for keywords like "material" or "made of" in the description
            const materialMatch = productDescription.match(/(made of|material)[\s\S]*?\./i);
            if (materialMatch) {
                material = materialMatch[0].trim();
            }
        }
    }

    // Analyze the product description using Google NLP
    //const nlpResult = await analyzeText(description);

    await browser.close();

    return { title, description, mass, material };
}

// Example usage
(async () => {
    const productData = await scrapeAmazon("B07MQG9H6R");  // Replace with a real ASIN

    // Log the full object with nested details
    console.dir(productData, { depth: null });

    // Alternatively, use JSON.stringify for pretty-printed output
    // console.log(JSON.stringify(productData, null, 2));
})();