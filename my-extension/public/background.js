console.log('Background service worker loaded');

// Function to open the extension popup (attached to the extension icon)
const showExtensionPopup = () => {
  chrome.action.openPopup().catch(err => {
    console.error('Failed to open popup:', err);
  });
};

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

// Check the active tab and show the popup if it's an Amazon page
const checkActiveTab = (tabId) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab?.url && isAmazonUrl(tab.url)) {
      showExtensionPopup();
    }
  });
};

// Listen for active tab changes
chrome.tabs.onActivated.addListener(({ tabId }) => {
  checkActiveTab(tabId);
});

// Also check when the URL in the active tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active && tab.url) {
    if (isAmazonUrl(tab.url)) {
      showExtensionPopup();
    }
  }
});