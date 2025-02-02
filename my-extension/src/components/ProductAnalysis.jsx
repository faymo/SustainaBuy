import React from 'react';

const ProductAnalysis = ({ product }) => {
  if (!product) {
    return <p>Loading product data...</p>;
  }

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
    <div className="mb-6 text-gray-600">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2> {/* Adjusted font size */}
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
      {product.climatePledge && (
        <p className="mt-2 text-green-600 font-semibold">
          {product.climatePledge}
        </p>
      )}
    </div>
  );
};

export default ProductAnalysis;