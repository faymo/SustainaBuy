import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="max-w-sm w-full p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 mb-4">
      <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
      <p className="text-gray-600">Category: {product.category}</p>
      <p className="text-gray-600">Price: ${product.price}</p>
      <p className="text-green-600 font-semibold mt-2">
        Carbon Footprint: {product.carbonFootprint} kg CO₂
      </p>
    </div>
  );
};

export default ProductCard;