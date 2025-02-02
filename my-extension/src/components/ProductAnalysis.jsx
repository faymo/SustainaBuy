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

  // Function to determine font size based on title length
  const getTitleFontSize = (title) => {
    if (title.length > 50) {
      return "text-lg"; // Smaller font size for long titles
    } else if (title.length > 30) {
      return "text-xl"; // Medium font size for medium-length titles
    } else {
      return "text-2xl"; // Larger font size for short titles
    }
  };

  return (
    <div className="mb-6 text-gray-600">
      <h2 className={`${getTitleFontSize(product.name)} font-bold text-gray-800 mb-2`}>{product.name}</h2>
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