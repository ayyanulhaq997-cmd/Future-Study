
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the UNICOU Assistant, a highly sophisticated AI consultant for the UNICOU Immigration and Academic Mobility platform.
Your goal is to help users navigate our three main verticals:
1. UNICOU Immigration: Settlement, PR pathways, and Visa consultation (uk, canada, australia).
2. UNICOU Shop: Official Exam Vouchers (PTE, IELTS, TOEFL) and learning materials.
3. UNICOU Academy: Mastery Courses, Mock Tests, and Academic Qualifications (OTHM).

Be professional, concise, and helpful. Use a polite and encouraging tone. Always refer to the platform as UNICOU.`;

export class GeminiService {
  /**
   * Strictly follows the requirement to use process.env.API_KEY directly.
   * Build tools like Vite will replace this literal string during deployment.
   */
  static async generateText(prompt: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Text Error:", error);
      return "The UNICOU AI node is temporarily offline. Please verify the environment configuration.";
    }
  }

  static async *chatStream(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      for await (const chunk of response) {
        yield chunk.text;
      }
    } catch (error) {
      console.error("Gemini Stream Error:", error);
      yield "Connection to the UNICOU nexus was interrupted. Please check your API key deployment.";
    }
  }

  static async platformSearch(query: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Search the UNICOU platform for: "${query}". Return relevant categories and specific items available.`,
        config: {
          systemInstruction: "You are the platform's search engine. Analyze user queries and map them to: 'Vouchers', 'Academy', 'Immigration', or 'Qualifications'. Be precise.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              results: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    category: { type: Type.STRING },
                    linkType: { type: Type.STRING, description: "One of: store, academy, degree, global, immigration" }
                  },
                  required: ["title", "description", "category", "linkType"]
                }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || '{"results":[]}');
    } catch (e) {
      console.error("Gemini Search Error:", e);
      return { results: [] };
    }
  }
}