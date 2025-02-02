import React, { useEffect, useState } from 'react';
import ProductAnalysis from './components/ProductAnalysis';
import AlternativeSuggestions from './components/AlternativeSuggestions';
import {GoogleGenerativeAI} from "@google/generative-ai"

const GEMINI_API_KEY = 'AIzaSyDxUlWB9ZVNYr3KebXWGKTgqPDirVIeuWk'; // Replace with your actual API key

const formatAlternative = (item) => ({
  name: item.name,
  price: item.price,
  carbonEmission: item.carbonEmission,
  link: item.link
});

const App = () => {
  const [alternatives, setAlternatives] = useState([]);
  const [isAmazon, setIsAmazon] = useState(false);
  const [productUrl, setProductUrl] = useState('');

  useEffect(() => {
    const fetchAlternatives = async (url) => {
      try {
        const genAI = new GoogleGenerativeAI("AIzaSyC7xUkHVXyOMoDsvKhbYHl5C2lRW0YEsvo");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Explain how AI works";

        const result = await model.generateContent(prompt);

        console.log(result.response.text());


        //const response = await fetch(`https://api.gemini.com/v1/sustainable-alternatives?url=${encodeURIComponent(url)}`, {
        //   headers: {
        //     'Authorization': `Bearer ${GEMINI_API_KEY}`
        //   }
        // });
        // const data = await response.json();
        // const formattedAlternatives = data.map(formatAlternative);
        // setAlternatives(formattedAlternatives);
      } catch (error) {
        console.error('Error fetching sustainable alternatives:', error);
      }
    };

    // Check if the active tab is an Amazon page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      if (url.includes('amazon')) {
        setIsAmazon(true);
        setProductUrl(url);
        // Fetch sustainable alternatives automatically
        fetchAlternatives(url);
      }
    });
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
          <ProductAnalysis product={{ url: productUrl }} />
          <AlternativeSuggestions alternatives={alternatives} />
        </main>
      )}
    </div>
  );
};

export default App;