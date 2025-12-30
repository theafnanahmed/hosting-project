
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDeploymentAdvice = async (projectName: string, framework: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 3 high-impact deployment optimizations for a ${framework} project named ${projectName}. Focus on performance, security, and CI/CD best practices.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ['high', 'medium', 'low'] }
            },
            required: ["title", "content", "impact"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Advice Error:", error);
    return [];
  }
};

export const analyzeBuildError = async (logSnippet: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this build error log and provide a concise solution: \n\n${logSnippet}`,
      config: {
        systemInstruction: "You are a senior DevOps engineer specializing in React and Node.js. Provide direct, actionable solutions."
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "Failed to analyze log.";
  }
};
