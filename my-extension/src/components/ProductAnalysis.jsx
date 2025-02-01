import React from 'react';

const ProductAnalysis = ({ product }) => {
  // Determine rating level and color based on average rating
  let ratingColor;
  if (product.rating >= 4) {
    ratingColor = "text-green-600";
  } else if (product.rating < 2.5) {
    ratingColor = "text-red-600";
  } else {
    ratingColor = "text-yellow-600";
  }

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
      <p className="text-gray-600">Price: ${product.price}</p>
      <p className="text-gray-600">
        Estimated Carbon Emissions: {product.carbonEmission} kg CO₂
      </p>
      <p className="mt-2 text-lg">
        <span className="font-semibold">Rating: </span>
        <span className={ratingColor}>{product.rating} / 5</span>
      </p>
      <p className="mt-2">
        <span className="font-semibold">Suggestion: </span>
        {product.suggestion}
      </p>
    </div>
  );
};

export default ProductAnalysis;