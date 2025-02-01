import React, { useState, useEffect } from 'react';
import ProductAnalysis from './components/ProductAnalysis';
import AlternativeSuggestions from './components/AlternativeSuggestions';

const App = () => {
  // State to determine if the active tab is an Amazon site
  const [isAmazon, setIsAmazon] = useState(false);

  // Demo product data (in a real app this would come from scraping the Amazon page)
  const demoProduct = {
    name: "Amazon Echo Dot (3rd Gen)",
    price: 49.99,
    carbonEmission: 4.2, // kg CO₂
    rating: 2.5, // out of 5
    suggestion: "Maybe consider alternatives with lower carbon footprint."
  };

  // Demo sustainable alternatives
  const alternatives = [
    {
      name: "EcoSmart Speaker",
      price: 39.99,
      carbonEmission: 2.1
    },
    {
      name: "GreenSound Home Assistant",
      price: 59.99,
      carbonEmission: 1.8
    }
  ];

  useEffect(() => {
    if (chrome && chrome.tabs) {
      // Function to check if active tab URL is Amazon
      const checkActiveTab = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const url = tabs && tabs[0]?.url;
          if (url) {
            try {
              const parsedUrl = new URL(url);
              setIsAmazon(parsedUrl.hostname.toLowerCase().includes('amazon'));
            } catch (error) {
              console.error('Error parsing URL:', error);
            }
          }
        });
      };

      // Initial check on mount
      checkActiveTab();

      // Listen for tab updates and check URL when it changes
      const onUpdatedListener = (tabId, changeInfo, tab) => {
        if (changeInfo.url && tab.active) {
          try {
            const newUrl = new URL(changeInfo.url);
            setIsAmazon(newUrl.hostname.toLowerCase().includes('amazon'));
          } catch (error) {
            console.error('Error parsing updated URL:', error);
          }
        }
      };

      chrome.tabs.onUpdated.addListener(onUpdatedListener);
      
      // Cleanup listener on unmount
      return () => {
        chrome.tabs.onUpdated.removeListener(onUpdatedListener);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-green-600">SustainaBuy</h1>
        <p className="mt-2 text-gray-700 text-center max-w-md">
          {isAmazon
            ? "Amazon page detected. Analyzing product sustainability..."
            : "This extension only works on Amazon pages. Navigate to an Amazon website to see the analysis."}
        </p>
      </header>
      {isAmazon && (
        <main className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
          <ProductAnalysis product={demoProduct} />
          <AlternativeSuggestions alternatives={alternatives} />
        </main>
      )}
    </div>
  );
};

export default App;
