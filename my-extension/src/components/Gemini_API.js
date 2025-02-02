import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyC7xUkHVXyOMoDsvKhbYHl5C2lRW0YEsvo");

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const prompt = `Use this url to look at the product, and give me a list of the name, price, and link of sustainable alternatives of the same or similar product. Make sure the product is more sustainable, so look for things like what material it's made out of, and the mass. Also look at the carbon footprint of similar products and compare it to this link. Make sure you make it into this format. Name: _____. Underneath that, Price. Underneath that CarbonEmission. Make sure the link is VALID. Underneath that, the link. Use this url, ${url}`;

const result = await model.generateContent(prompt);

console.log(result.response.text());
