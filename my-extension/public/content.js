function scrapeProductData() {
    console.log('Content script is running');
    const productUrl = window.location.href;
    return { url: productUrl };
  }
  
  // Listen for messages from the React component
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'REQUEST_PRODUCT_DATA') {
      const productData = scrapeProductData();
      console.log('Scraped Product Data:', productData);
      // Send the product data to the background script
      chrome.runtime.sendMessage({ type: 'PRODUCT_DATA', data: productData });
    }
  });