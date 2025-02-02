import {GoogleGenerativeAI} from "@google/generative-ai";


const genAI = new GoogleGenerativeAI("AIzaSyAarP4iI6WP_zxTZNCEjGEi7-BZwnJOGBs");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const aiPrompt = `
        Analyze the following product characteristics and find the Greenhouse gas emissions based on the mass and material given. Generate a sustainability score from 0 to 10 (1 decimal place allowed), that considers each characteristic, where 10 is highly sustainable:
        - Mass: 1000 grams
        - Material: wood
        In your response, INCLUDE YOUR SUSTAINABILITY SCORE between 0-10.0, and explain the reasoning. Your response should be in the format of this example: "2.0 is the Sustainability Score: ,   Reasoning/explanation: ...." MAKE SURE THE SCORE/NUMBER IS THE FIRST THING IN YOUR RESPONSE, and dont add any asteriks or other characters
    `;

const result = await model.generateContent(aiPrompt);
console.log(result.response.text());