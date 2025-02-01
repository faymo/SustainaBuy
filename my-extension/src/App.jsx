import React, { useState } from 'react';
import ProductCard from './ProductCard';

const App = () => {
  const [products] = useState([
    {
      name: 'Organic Cotton T-Shirt',
      category: 'Clothing',
      price: 25,
      carbonFootprint: 2.5
    },
    {
      name: 'Bamboo Toothbrush',
      category: 'Personal Care',
      price: 5,
      carbonFootprint: 0.1
    },
    {
      name: 'Reusable Water Bottle',
      category: 'Accessories',
      price: 15,
      carbonFootprint: 0.3
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-green-600">
          SustainaBuy Tracker
        </h1>
        <p className="text-gray-700 mt-2 text-center max-w-md">
          Track your shopping sustainability with carbon footprint estimates.
        </p>
      </header>
      <main className="w-full max-w-4xl">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </main>
    </div>
  );
};

export default App;
