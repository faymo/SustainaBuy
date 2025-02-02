import React from 'react';

const AlternativeSuggestions = ({ alternatives = [] }) => {
  return (
    <div>
      <h3 className="text-[1.20rem] font-bold text-gray-800 mb-4">
        Sustainable Alternatives
      </h3>
      {alternatives.length === 0 ? (
        <p className="text-gray-600">No sustainable alternatives found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alternatives.map((alt, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
            >
              <h4 className="text-lg font-semibold text-gray-800">{alt.name}</h4>
              <p className="text-gray-600">Price: {alt.price}</p>
              <p className="text-gray-600">CO₂ Emissions: {alt.carbonEmission} kg</p>
              {alt.link && (
                <a
                  href={alt.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Product
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlternativeSuggestions;