// src/services/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAfzLGBgOW-CCoFBZyPRx08E9Tiu7kyLpE";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getLegalGuidance(question: string): Promise<string> {
  try {
    console.log("Initializing request to Gemini API...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `As a legal guidance assistant for women and children in India, please provide information about: ${question}

    Please format your response with:
    1. Clear headings in **bold**
    2. Bullet points using • for lists
    3. Proper spacing between paragraphs
    4. Important terms in **bold**
    5. Include relevant helpline numbers when applicable
    
    Remember to:
    • Keep the response focused on legal rights and protections
    • Provide general guidance only
    • Recommend professional legal consultation when necessary`;
    
    console.log("Sending prompt to API...");
    const result = await model.generateContent(prompt);
    console.log("Received response from API");
    
    if (!result.response) {
      throw new Error("No response received from API");
    }
    
    const response = result.response.text();
    console.log("Processed response:", response);
    
    return response;
  } catch (error: any) {
    console.error("Gemini API Error:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw new Error(`Failed to get response: ${error.message}`);
  }
}