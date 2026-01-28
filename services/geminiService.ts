
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

export const analyzeUrlWithAI = async (url: string): Promise<ScanResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following URL for phishing characteristics: ${url}. 
    Consider domain reputation, typical SSL/DNS patterns for such domains, and common phishing tactics.
    Provide the response in structured JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER, description: "Risk score from 0 to 100" },
          threatLevel: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
          analysis: {
            type: Type.OBJECT,
            properties: {
              heuristics: { type: Type.ARRAY, items: { type: Type.STRING } },
              reputation: { type: Type.STRING },
              sslDns: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["heuristics", "reputation", "sslDns", "explanation"]
          },
          details: {
            type: Type.OBJECT,
            properties: {
              hasIpAddress: { type: Type.BOOLEAN },
              isLongUrl: { type: Type.BOOLEAN },
              excessiveSubdomains: { type: Type.BOOLEAN },
              unusualTld: { type: Type.BOOLEAN },
              suspiciousKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["hasIpAddress", "isLongUrl", "excessiveSubdomains", "unusualTld", "suspiciousKeywords"]
          }
        },
        required: ["riskScore", "threatLevel", "analysis", "details"]
      }
    }
  });

  const rawJson = response.text.trim();
  const result = JSON.parse(rawJson);
  
  return {
    ...result,
    url
  };
};
