import React, { useState, useEffect } from 'react';
import ProductAnalysis from './components/ProductAnalysis';
import AlternativeSuggestions from './components/AlternativeSuggestions';

const App = () => {
  const [scrapedData, setScrapedData] = useState(null);
  const [isAmazonPage, setIsAmazonPage] = useState(false);

  useEffect(() => {
    const port = chrome.runtime.connect({ name: "popup" });
    console.log("Popup connected to background script");

    port.onMessage.addListener((message) => {
      if (message.type === 'SCRAPER_DATA' && message.data) {
        console.log('Received scraper data:', message.data);
        const formattedData = {
          name: message.data.title,
          climatePledge: message.data.climatePledge,
          carbonEmission: 0, // Assuming carbon emission is not available in the scraped data
          rating: 0, // Assuming rating is not available in the scraped data
          suggestion: "No suggestions available", // Assuming suggestion is not available in the scraped data
          alternatives: [] // Assuming alternatives are not available in the scraped data
        };
        setScrapedData(formattedData);
      }
    });

    // Check if the current tab is an Amazon page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url && activeTab.url.includes('amazon')) {
        setIsAmazonPage(true);
      } else {
        setIsAmazonPage(false);
      }
    });

    return () => {
      console.log("Popup disconnected from background script");
      port.disconnect();
    };
  }, []);

  // Provide default product data to avoid undefined errors
  const defaultProduct = {
    name: "Loading...",
    carbonEmission: 0,
    rating: 0,
    suggestion: "Loading...",
    climatePledge: "",
    alternatives: []
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-green-600">Sustain-a-Buy</h1>
      </header>
      <main className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        {isAmazonPage ? (
          <>
            <ProductAnalysis product={scrapedData || defaultProduct} />
            <AlternativeSuggestions alternatives={scrapedData?.alternatives || []} />
          </>
        ) : (
          <p className="text-lg text-gray-700">Please navigate to an Amazon product page to see the analysis.</p>
        )}
      </main>
    </div>
  );
};

export default App;
