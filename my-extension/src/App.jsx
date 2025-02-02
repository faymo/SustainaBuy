import React, { useState, useEffect } from 'react';
import ProductAnalysis from './components/ProductAnalysis';
import AlternativeSuggestions from './components/AlternativeSuggestions';
import { getSustainableAlternatives, getSustainabilityScore } from './Gemini_API.js';

const App = () => {
  const [productData, setProductData] = useState(null);
  const [altData, setAltData] = useState([]);
  const [isAmazonPage, setIsAmazonPage] = useState(false);
  const [productUrl, setProductUrl] = useState('');

  useEffect(() => {
    const port = chrome.runtime.connect({ name: "popup" });
    console.log("Popup connected to background script");

    port.onMessage.addListener((message) => {
      if (message.type === 'SCRAPER_DATA' && message.data) {
        console.log('Received scraper data:', message.data);
        // Include mass and material from scraped data
        const formattedData = {
          name: message.data.title,
          climatePledge: message.data.climatePledge,
          carbonEmission: 0, // Will be updated with CO₂ emissions
          rating: 0,         // Will be updated by sustainability score
          suggestion: "No suggestions available", // Placeholder suggestion
          mass: message.data.mass || '',
          material: message.data.material || ''
        };
        setProductData(formattedData);
        console.log(formattedData.mass, formattedData.material)
        // Use getSustainabilityScore to get the product rating from Gemini API
        if (formattedData.mass && formattedData.material) {
          getSustainabilityScore(formattedData.mass, formattedData.material)
            .then((scoreText) => {
              console.log("Gemini sustainability score response:", scoreText);
              // Expected response example:
              // "8.5, 3.2kg, Reasoning/explanation: ..."
              const parts = scoreText.split(',');
              const sustainabilityScore = parseFloat(parts[0].trim());
              const co2Emissions = parts[1] ? parseFloat(parts[1].toLowerCase().replace('kg', '').trim()) : 0;
              console.log('Parsed sustainability score:', sustainabilityScore, 'CO₂ Emissions:', co2Emissions);
              setProductData(prev => ({
                ...prev,
                rating: sustainabilityScore,
                carbonEmission: co2Emissions
              }));
            })
            .catch((error) => console.error("Error fetching sustainability score:", error));
        }
      }
    });

    // Check if the current tab is an Amazon page and capture the product URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url && activeTab.url.includes('amazon')) {
        setIsAmazonPage(true);
        setProductUrl(activeTab.url);
      } else {
        setIsAmazonPage(false);
      }
    });

    return () => {
      console.log("Popup disconnected from background script");
      port.disconnect();
    };
  }, []);

  // Updated parseAlternatives function remains unchanged here
  const parseAlternatives = (responseText) => {
    try {
      if (!responseText || typeof responseText !== "string") {
        console.error("Invalid Gemini response:", responseText);
        return [];
      }
      const safeResponse = responseText.trim();
      if (safeResponse.length === 0) {
        console.error("Empty Gemini response");
        return [];
      }
      const blocks = safeResponse.split(/(?=Name:)/).filter(
        (block) => block && block.trim().length > 0
      );
      if (!Array.isArray(blocks) || blocks.length === 0) {
        console.error("No alternative blocks found in the response:", safeResponse);
        return [];
      }
      const alternatives = blocks.map((block) => {
        const nameMatch = block.match(/Name:\s*(.*)/i);
        const priceMatch = block.match(/Price:\s*(.*)/i);
        const carbonMatch = block.match(/CarbonEmission:\s*(.*)/i);
        // Updated regex to capture valid links and remove trailing punctuation
        const linkMatch = block.match(/Link:\s*(https?:\/\/\S+)/i);
        let link = linkMatch ? linkMatch[1].trim() : "";
        if (link) {
          link = link.replace(/[.,;:!?)]*$/, ""); // Remove any trailing punctuation or delimiters
        }
        return {
          name: nameMatch ? nameMatch[1].trim() : "",
          price: priceMatch ? priceMatch[1].trim() : "",
          carbonEmission: carbonMatch ? carbonMatch[1].trim() : "",
          link,
        };
      });
      console.log("Parsed alternatives:", alternatives);
      return alternatives;
    } catch (error) {
      console.error("Error parsing alternatives:", error);
      return [];
    }
  };

  // Effect to fetch sustainable alternatives from Gemini API
  useEffect(() => {
    if (isAmazonPage && productUrl) {
      async function fetchAlternatives() {
        try {
          const response = await getSustainableAlternatives(productUrl);
          console.log("Gemini raw response:", response);
          const alternativesArray = parseAlternatives(response);
          setAltData(alternativesArray);
          console.log("Parsed alternatives:", alternativesArray);
        } catch (error) {
          console.error("Error fetching sustainable alternatives:", error);
        }
      }
      fetchAlternatives();
      console.log("Fetching sustainable alternatives for:", productUrl);
    }
  }, [isAmazonPage, productUrl]);

  // Provide default product data to avoid undefined errors
  const defaultProduct = {
    name: "Loading...",
    carbonEmission: 0,
    rating: 0,
    suggestion: "Loading...",
    climatePledge: ""
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-green-600">Sustain-a-Buy</h1>
      </header>
      <main className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        {isAmazonPage ? (
          <>
            <ProductAnalysis product={productData || {
              name: "Loading...",
              carbonEmission: 0,
              rating: 0,
              suggestion: "Loading...",
              climatePledge: ""
            }} />
            <AlternativeSuggestions alternatives={altData} />
          </>
        ) : (
          <p className="text-lg text-gray-700">Please navigate to an Amazon product page to see the analysis.</p>
        )}
      </main>
    </div>
  );
};

export default App;
