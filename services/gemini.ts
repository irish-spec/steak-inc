import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const generateNewsHeadline = async (gameStateSummary: string): Promise<string> => {
  if (!genAI) {
    console.warn("Gemini API Key missing");
    return "Steak Inc. stocks remain stable despite lack of AI oversight.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a satirical news ticker for a game called "Steak Inc." where the player runs a massive industrial cow farm.
      
      Current Game State Context: ${gameStateSummary}
      
      Generate ONE short, funny, satirical news headline (max 10 words) about the steak industry, cows, or the economy. 
      Examples:
      - "Cows demand union representation, farmer offers extra hay."
      - "Steak prices soar as vegetarians convert en masse."
      - "Scientists discover 5th stomach dedicated to profit."
      
      Output ONLY the headline text.
    `;

    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Failed to generate news:", error);
    return "Breaking: Local cow jumps over the moon, astronomers baffled.";
  }
};
