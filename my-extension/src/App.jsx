import React, { useState, useEffect } from 'react';
import ProductAnalysis from './components/ProductAnalysis';
import AlternativeSuggestions from './components/AlternativeSuggestions';

const App = () => {
  const [scrapedData, setScrapedData] = useState(null);

  useEffect(() => {
    const port = chrome.runtime.connect({ name: "popup" });
    console.log("Popup connected to background script");
    port.onMessage.addListener((message) => {
      if (message.type === 'SCRAPER_DATA' && message.data) {
        console.log('Received scraper data:', message.data);
        const formattedData = {
          name: message.data.title,
          description: message.data.description,
          climatePledge: message.data.climatePledge,
          price: message.data.price || 0, // Use the scraped price or default to 0
          carbonEmission: 0, // Assuming carbon emission is not available in the scraped data
          rating: 0, // Assuming rating is not available in the scraped data
          suggestion: "No suggestions available", // Assuming suggestion is not available in the scraped data
          alternatives: [] // Assuming alternatives are not available in the scraped data
        };
        setScrapedData(formattedData);
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
    price: 0,
    carbonEmission: 0,
    rating: 0,
    suggestion: "Loading...",
    description: "",
    climatePledge: "",
    alternatives: []
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-green-600">SustainaBuy</h1>
      </header>
      <main className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <ProductAnalysis product={scrapedData || defaultProduct} />
        <AlternativeSuggestions alternatives={scrapedData?.alternatives || []} />
      </main>
    </div>
  );
};

export default App;
