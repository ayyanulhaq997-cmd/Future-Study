
import { GoogleGenAI, Type } from "@google/genai";

export class AIEvaluator {
  static async evaluateEssay(prompt: string, studentResponse: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Evaluate this student essay based on IELTS/TOEFL standards.\n\nPrompt: ${prompt}\n\nResponse: ${studentResponse}`,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a professional IELTS/TOEFL examiner. Return a structured JSON evaluation including band score (0-9) and detailed criteria breakdown.",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bandScore: { type: Type.STRING },
              taskResponse: { type: Type.STRING },
              coherence: { type: Type.STRING },
              lexicalResource: { type: Type.STRING },
              grammaticalRange: { type: Type.STRING },
              improvementTips: { type: Type.STRING }
            },
            required: ["bandScore", "taskResponse", "coherence", "lexicalResource", "grammaticalRange"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (e) {
      console.error("AI Evaluation Node Offline");
      return null;
    }
  }

  static async evaluateSpeaking(prompt: string, transcript: string) {
    // Similar logic for speaking evaluation via transcript analysis
    return this.evaluateEssay(`Speaking Prompt: ${prompt}`, transcript);
  }
}
