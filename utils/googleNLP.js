import { LanguageServiceClient } from '@google-cloud/language';
import dotenv from 'dotenv';

dotenv.config();

const client = new LanguageServiceClient();

// List of sustainability-related keywords
const sustainabilityKeywords = [
    "sustainable", "eco-friendly", "biodegradable", "recycled", "organic",
    "renewable energy", "carbon footprint", "climate change", "biodiversity", "conservation",
    "ecosystem", "recycling", "composting", "zero waste", "circular economy",
    "green energy", "solar power", "wind energy", "hydropower", "geothermal energy",
    "carbon offset", "deforestation", "reforestation", "afforestation", "pollution",
    "air quality", "water conservation", "sustainable agriculture", "organic farming", "permaculture",
    "soil health", "wildlife protection", "endangered species", "habitat restoration", "sustainable fishing",
    "ocean conservation", "plastic-free", "compostable", "green building", "LEED certification",
    "energy efficiency", "sustainable transportation", "electric vehicles", "public transit", "bicycle-friendly",
    "walkability", "urban gardening", "green spaces", "sustainable forestry", "rainwater harvesting",
    "greywater systems", "carbon neutrality", "net zero", "social equity", "fair trade",
    "ethical sourcing", "human rights", "community development", "inclusive growth", "diversity and inclusion",
    "gender equality", "social justice", "affordable housing", "education for all", "health and well-being",
    "food security", "access to clean water", "labor rights", "living wage", "corporate social responsibility",
    "CSR", "philanthropy", "volunteerism", "empowerment", "cultural preservation", "indigenous rights",
    "social impact", "stakeholder engagement", "transparency", "accountability", "ethical consumption",
    "responsible tourism", "community resilience", "disaster preparedness", "sustainable development",
    "green economy", "circular business models", "resource efficiency", "sustainable investing", "ESG",
    "impact investing", "green bonds", "corporate sustainability", "triple bottom line", "lifecycle assessment",
    "sustainable supply chains", "local sourcing", "fair labor practices", "economic resilience", "green jobs",
    "sustainable innovation", "clean technology", "renewable resources", "waste reduction", "energy independence",
    "sustainable finance", "carbon pricing", "carbon tax", "emissions trading", "sustainable consumption",
    "product stewardship", "extended producer responsibility", "green procurement", "sustainable urban planning",
    "resilience", "regeneration", "stewardship", "intergenerational equity", "systems thinking",
    "holistic approach", "long-term thinking", "balance", "harmony", "collaboration",
    "partnerships", "innovation", "adaptation", "mitigation", "sustainable lifestyles",
    "minimalism", "conscious consumerism", "eco-conscious", "green living", "sustainable future"
  ];

async function analyzeText(text) {
    if (!text) return { message: "No description available" };

    try {
        // Convert text to lowercase for case-insensitive matching
        const lowercaseText = text.toLowerCase();

        // Count the number of keyword matches
        let matchCount = 0;
        sustainabilityKeywords.forEach(keyword => {
            if (lowercaseText.includes(keyword)) {
                matchCount++;
            }
        });

        // Calculate the score as a percentage of total keywords
        const totalKeywords = sustainabilityKeywords.length;
        const score = (matchCount / totalKeywords) * 100; // Score as a percentage

        return { score: score.toFixed(2), matchCount, totalKeywords };
    } catch (error) {
        return { error: error.message };
    }
}

export { analyzeText };