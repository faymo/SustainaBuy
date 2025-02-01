console.log('Background service worker loaded');

async function estimateEmissions(query, quantity, unit) {
    const apiKey = '8GCPVZJBP94XV6SST591MRHX6M'; // Replace with your actual API key
    const url = 'https://api.climatiq.io/data/v1/estimate';

    // Constructing the payload with data_version
    const payload = {
        emission_factor: {
            activity_id: "electricity-supply_grid-source_residual_mix", // The activity query (e.g., "electricity")
            data_version: "^20" // Use a dynamic version or a fixed version like "20"
        },
        parameters: {
            [unit]: quantity // Dynamically set the unit and quantity
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${await response.text()}`);
        }

        const result = await response.json();
        console.log("Estimated Emissions Result:", result);
        return result;
    } catch (error) {
        console.error("Error estimating emissions:", error.message);
        throw error;
    }
}


/*chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'estimate') {
        estimateEmissions(request.query, request.quantity, request.unit)
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ error }));
        return true; // Required for async response
    }
}); */
// Test function in background.js
async function testEstimateEmissions() {
    const query = "electricity";
    const quantity = 1000;
    const unit = "energy";
    
    try {
      console.log("[TEST] Calling estimateEmissions...");
      const result = await estimateEmissions(query, quantity, unit);
      console.log("[TEST] Result:", result); // Check this in the service worker console
    } catch (error) {
      console.error("[TEST] Error:", error);
    }
  }
  
  // Run the test
console.log('ghrello');
testEstimateEmissions();
  
