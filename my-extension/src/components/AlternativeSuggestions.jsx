import React from 'react';

const AlternativeSuggestions = ({ alternatives }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Sustainable Alternatives</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alternatives.map((alt, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
          >
            <h4 className="text-lg font-semibold text-gray-800">{alt.name}</h4>
            <p className="text-gray-600">Price: ${alt.price}</p>
            <p className="text-gray-600">CO₂ Emissions: {alt.carbonEmission} kg</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlternativeSuggestions;