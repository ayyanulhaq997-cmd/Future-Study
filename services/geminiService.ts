
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are the Nexus EDU Assistant, a highly sophisticated AI consultant for the Nexus EDU platform.
Your goal is to help students, agents, and trainers navigate the platform.

Key Platform Information:
1. Exam Vouchers: We sell vouchers for PTE Academic, IELTS, TOEFL iBT, Duolingo, LanguageCert, Oxford ELLT, and Password Skills Plus.
2. Full Registration: For PTE and others, we offer a full-service registration where we handle the booking for the student.
3. LMS Academy: We provide Mastery Courses and Mock Tests. Students get instant results for Reading/Listening and human grading for Writing/Speaking.
4. Qualifications: We offer OTHM Level 3 Diplomas and other professional certifications.
5. Roles: Students (customers), Agents (resellers with tiered discounts), and Trainers (graders).

Be professional, concise, and helpful. Use a polite and encouraging tone.`;

export class GeminiService {
  /**
   * Generates a text response using the gemini-3-flash-preview model.
   */
  static async generateText(prompt: string) {
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });
      return response.text;
    } catch (error) {
      console.error("Error generating text:", error);
      throw error;
    }
  }

  /**
   * Starts a streaming content generation for the chat interface.
   */
  static async *chatStream(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    try {
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
      console.error("Error in chat stream:", error);
      throw error;
    }
  }

  /**
   * Performs an intelligent search across platform resources.
   */
  static async platformSearch(query: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Search the Nexus platform for: "${query}". Return relevant categories and specific items available.`,
        config: {
          systemInstruction: "You are the platform's search engine. Analyze user queries and map them to: 'Vouchers', 'Academy', 'Universities', or 'Qualifications'. Be precise.",
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
      return JSON.parse(response.text || '{"results":[]}');
    } catch (e) {
      console.error("Search error:", e);
      return { results: [] };
    }
  }
}
