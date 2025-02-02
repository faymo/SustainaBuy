import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyC7xUkHVXyOMoDsvKhbYHl5C2lRW0YEsvo");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function getSustainableAlternatives(url) {
  const prompt = `Use this url to look at the product, and give me a list of the name, price, and link of 3 sustainable alternatives of the same or similar product. Make sure the product is more sustainable, so look for things like what material it's made out of, and the mass. Also look at the carbon footprint of similar products and compare it to this link. Make sure you dont have '**' in your format and make sure your links work. Make sure you make it into this format.
Name: _____.
Underneath that, Price.
Underneath that, CarbonEmission.
Make sure the link is VALID.
Underneath that, the link.
Use this url, ${url}`;
  
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  return result.response.text();
}

export async function getSustainabilityScore(mass, material) {
  const aiPrompt = `
    Analyze the following product characteristics and find an exact Greenhouse gas emissions based specifically on the mass (larger mass means more emissions which is bad) and material given (kg). Generate a sustainability score from 0 to 10 (1 decimal place allowed), that considers each characteristic, where 10 is highly sustainable. Remember that materials like bamboo(0.5kg/1000g co2e/bamboomass) are more sustainable than plastic (2-6kg/1000g co2e/plasticmass). Remember that 10-100g is not that much compared to 1+ kg.
    - Mass: 90 grams
    - Material: Plastic
    In your response, INCLUDE YOUR SUSTAINABILITY SCORE between 0-10.0, and explain the reasoning. Your response should be in the format of this example: "(Sustainability Score), (Greenhouse Gas Emissions)kg,   Reasoning/explanation: ...." MAKE SURE THE SCORE/NUMBER IS THE FIRST THING IN YOUR RESPONSE, and dont add any asteriks or other characters
  `;
  const result = await model.generateContent(aiPrompt);
  console.log(result.response.text());
  return result.response.text();
}


