import React from 'react';
import ProductAnalysis from './components/ProductAnalysis';
import AlternativeSuggestions from './components/AlternativeSuggestions';

const App = () => {
  // Demo product data (in a real app this would come from scraping Amazon)
  const demoProduct = {
    name: "Amazon Echo Dot (3rd Gen)",
    price: 49.99,
    carbonEmission: 4.2, // kg CO₂ (example value)
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-green-600">SustainaBuy</h1>
        <p className="mt-2 text-gray-700 text-center max-w-md">
          Analyze Amazon products for their CO₂ emissions and sustainability.
        </p>
      </header>
      <main className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <ProductAnalysis product={demoProduct} />
        <AlternativeSuggestions alternatives={alternatives} />
      </main>
    </div>
  );
};

export default App;
