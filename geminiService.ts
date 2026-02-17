import { GoogleGenAI, Type } from "@google/genai";

function getAi() {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Add it to your .env file.');
  }
  return new GoogleGenAI({ apiKey });
}

export interface DiagnosticResult {
  classification: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High';
  description: string;
  dermatologistAdvice: string;
  homeRemedies: {
    title: string;
    instructions: string;
  }[];
  skincareIngredients: {
    name: string;
    benefit: string;
  }[];
  recommendations: string[];
  metrics: {
    inflammation: number;
    hydration: number;
    pigmentation: number;
  };
}

export const diagnoseSkinCondition = async (imageBase64: string): Promise<DiagnosticResult> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
        {
          text: "Act as a Board-Certified Dermatologist. Analyze this skin image for damage (sun damage, barrier irritation, acne, etc.). Provide a professional diagnosis. Include: 1) Personalized clinical advice, 2) Safe home remedies, 3) Recommended active skincare ingredients, 4) General recommendations. Format as structured JSON with metrics for inflammation, hydration, and pigmentation.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          classification: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          severity: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
          description: { type: Type.STRING },
          dermatologistAdvice: { type: Type.STRING },
          homeRemedies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                instructions: { type: Type.STRING }
              },
              required: ['title', 'instructions']
            }
          },
          skincareIngredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                benefit: { type: Type.STRING }
              },
              required: ['name', 'benefit']
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          metrics: {
            type: Type.OBJECT,
            properties: {
              inflammation: { type: Type.NUMBER },
              hydration: { type: Type.NUMBER },
              pigmentation: { type: Type.NUMBER },
            },
            required: ['inflammation', 'hydration', 'pigmentation'],
          },
        },
        required: [
          'classification', 'confidence', 'severity', 'description', 
          'dermatologistAdvice', 'homeRemedies', 'skincareIngredients', 
          'recommendations', 'metrics'
        ],
      },
    },
  });

  return JSON.parse(response.text || '{}') as DiagnosticResult;
};

export const getAiChatResponse = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const ai = getAi();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are Monica, an expert AI Dermatologist. You are friendly, concise, and helpful. You provide evidence-based skincare advice. If users ask for recent news, use Google Search.',
      tools: [{ googleSearch: {} }]
    }
  });

  const response = await chat.sendMessage({ message });
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};
