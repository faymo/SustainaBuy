const GEMINI_API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

// Function to fetch sustainable alternatives using the Gemini API
async function fetchSustainableAlternatives(productUrl) {
  // Example API call to Gemini API (replace with your actual API endpoint and key)
  const response = await fetch(`https://api.gemini.com/v1/sustainable-alternatives?url=${encodeURIComponent(productUrl)}`, {
    headers: {
      'Authorization': `Bearer ${GEMINI_API_KEY}`
    }
  });
  const data = await response.json();
  return data.alternatives;
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'PRODUCT_DATA') {
    const productData = message.data;
    const sustainableAlternatives = await fetchSustainableAlternatives(productData.url);
    console.log('Sustainable Alternatives:', sustainableAlternatives);
    // Send the sustainable alternatives back to the content script
    chrome.tabs.sendMessage(sender.tab.id, { type: 'SUSTAINABLE_ALTERNATIVES', data: sustainableAlternatives });
  }
});