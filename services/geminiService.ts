
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the UNICOU Assistant, a professional AI consultant for the UNICOU International Education and Immigration platform.
Your goal is to help users navigate our three main verticals:
1. Consultancy: University Admissions, Visa strategy, and PR pathways (UK, Australia, Canada, etc).
2. Vouchers: Official Exam Vouchers (PTE, IELTS, TOEFL, etc) with instant delivery.
3. Learning Hub: Preparation courses, Mock Tests, and OTHM Qualifications.

Be professional, concise, and helpful. Use a polite and encouraging tone. Always refer to the platform as UNICOU. Avoid any internal naming conventions like "Nexus".`;

export class GeminiService {
  // Uses ai.models.generateContent directly with model name
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
      // Correctly accessing the text property (not calling as a function)
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "The UNICOU AI service is currently initializing. Please try again in a moment.";
    }
  }

  // Implementation for continuous streaming of model turn parts
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
        // Safe property access for chunk text
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error) {
      console.error("Stream Error:", error);
      yield "Communication interrupted. Please verify your connection to the UNICOU portal.";
    }
  }

  // Search grounding simulation using responseSchema for structured JSON
  static async platformSearch(query: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Search for: "${query}".`,
        config: {
          systemInstruction: "You are the platform's search engine. Map queries to: 'Vouchers', 'Learning Hub', 'Consultancy', or 'Qualifications'. Return results as JSON.",
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
                    linkType: { type: Type.STRING, description: "One of: store, academy, degree, global" }
                  },
                  required: ["title", "description", "category", "linkType"]
                }
              }
            }
          }
        }
      });
      // Direct access to .text property from response
      return JSON.parse(response.text || '{"results":[]}');
    } catch (e) {
      return { results: [] };
    }
  }
}
