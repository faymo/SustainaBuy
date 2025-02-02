console.log('Background service worker loaded');

// Helper function to check if the URL is from Amazon
const isAmazonUrl = (urlStr) => {
  try {
    const url = new URL(urlStr);
    return url.hostname.toLowerCase().includes('amazon');
  } catch (err) {
    console.error('Error parsing URL:', err);
    return false;
  }
};

// Function to open the extension popup
const showExtensionPopup = () => {
  chrome.action.openPopup().catch(err => {
    console.error('Failed to open popup:', err);
  });
};

// Check the active tab and show the popup if it's an Amazon page
const checkActiveTab = (tabId) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab?.url && isAmazonUrl(tab.url)) {
      console.log('Amazon page detected:', tab.url);
      handleAmazonPage(tab.url);
      showExtensionPopup();
    }
  });
};

// Handle Amazon page by calling the backend scraper API
const handleAmazonPage = (url) => {
  console.log("Handling Amazon page:", url);
  fetch(`http://localhost:3001/scrape?url=${encodeURIComponent(url)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Scraped data received from backend:", data);
      // Send the scraped data to the extension UI (popup)
      if (popupPort) {
        console.log("Sending scraped data to popup:", data);
        popupPort.postMessage({
          type: "SCRAPER_DATA",
          data: data
        });
      } else {
        console.error("No connection to popup");
      }
    })
    .catch((error) => {
      console.error("Error fetching scraper data:", error);
    });
};

let popupPort;

// Listen for connections from the popup
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    console.log("Popup connected");
    popupPort = port;
    port.onDisconnect.addListener(() => {
      console.log("Popup disconnected");
      popupPort = null;
    });
  }
});

// Listen for active tab changes
chrome.tabs.onActivated.addListener(({ tabId }) => {
  checkActiveTab(tabId);
});

// Also check when the URL in the active tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active && tab.url) {
    if (isAmazonUrl(tab.url)) {
      console.log('Amazon page detected:', tab.url);
      handleAmazonPage(tab.url);
      showExtensionPopup();
    }
  }
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background:", message);
  if (message.type === "PRODUCT_URL" && message.url) {
    console.log("Background received product URL:", message.url);
    
    // Call the backend scraper API
    fetch(`http://localhost:3001/scrape?url=${encodeURIComponent(message.url)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Scraped data received from backend:", data);
        // Send the scraped data to the extension UI (popup)
        chrome.runtime.sendMessage({
          type: "SCRAPER_DATA",
          data: data
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message to popup:', chrome.runtime.lastError);
          } else {
            console.log('Message sent to popup successfully:', response);
          }
        });
        sendResponse({ status: 'success' });
      })
      .catch((error) => {
        console.error("Error fetching scraper data:", error);
        sendResponse({ status: 'error', message: error.message });
      });
    return true;  // Indicates that the response is asynchronous
  }
});