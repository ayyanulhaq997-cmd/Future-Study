
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// Initialize Gemini API client correctly using the environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
          systemInstruction: 'You are Nexus AI, a highly sophisticated AI assistant. You are helpful, professional, and creative.',
        }
      });
      
      // Access the .text property directly (not as a method).
      return response.text;
    } catch (error) {
      console.error("Error generating text:", error);
      throw error;
    }
  }

  /**
   * Analyzes an image with a text prompt.
   */
  static async analyzeImage(prompt: string, base64Image: string) {
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Image,
                mimeType: 'image/jpeg'
              }
            }
          ]
        }
      });
      return response.text;
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw error;
    }
  }

  /**
   * Generates an image using the gemini-2.5-flash-image model.
   */
  static async generateImage(prompt: string) {
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      // Safely extract the image data from the response parts.
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      throw new Error("No image data returned from model");
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }
}
