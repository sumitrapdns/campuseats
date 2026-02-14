import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIRecommendations = async (mood: string, menu: FoodItem[]) => {
  const menuStr = JSON.stringify(menu.map(i => ({ id: i.id, name: i.name, tags: i.tags })));
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user says their mood/preference is: "${mood}". 
    Based on this menu: ${menuStr}, suggest the top 2 items from the menu. 
    Explain why each fits their mood in a friendly way.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                foodId: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["foodId", "reason"]
            }
          }
        },
        required: ["recommendations"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data.recommendations;
  } catch (e) {
    console.error("Failed to parse response", e);
    return [];
  }
};

export const analyzeDeliveryLocation = async (lat: number, lng: number) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Tell me about the area at latitude ${lat}, longitude ${lng}. Is it a university campus area, a residential zone, or a business district? Provide a one-sentence tip for a food delivery driver coming here. Do not mention any AI branding in your response.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    },
  });
  return response.text;
};

export const getAIChatResponse = async (history: { role: string, parts: { text: string }[] }[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the Intelligent Concierge for 'CampusEats', a premium food ordering app. 
      Be helpful, witty, and encourage healthy or delicious choices depending on user intent. 
      Keep answers concise and relevant to food ordering. If they ask about the menu, mention we have Burgers, Pizza, Sushi, Salads, and Desserts.
      Do not mention that you are an AI model or mention Google/Gemini. Act as a built-in feature of the CampusEats platform.`,
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};
