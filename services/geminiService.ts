import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, MissionId, MathProblem } from "../types";

// Access API Key safely. Vite config injects this as a string replacement.
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return '';
};

const apiKey = getApiKey();
// Only initialize if we have a key, otherwise we'll handle it in the function calls
// Using a dummy key string if empty allows the constructor to pass, but calls will fail gracefully later
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

// Helper to get Thai topic name
const getTopicName = (id: MissionId): string => {
  switch (id) {
    case MissionId.ARITHMETIC: return "Arithmetic Series (อนุกรมเลขคณิต)";
    case MissionId.GEOMETRIC: return "Geometric Series (อนุกรมเรขาคณิต)";
    case MissionId.INFINITE: return "Infinite Series & Convergence (อนุกรมอนันต์และลิมิต)";
    case MissionId.SIGMA: return "Sigma Notation & Summation (สัญลักษณ์แทนการบวก)";
    default: return "Mathematics Series";
  }
};

export const generateProblem = async (missionId: MissionId, difficulty: Difficulty): Promise<MathProblem> => {
  // Fallback immediately if no API key is detected to prevent 400 errors from bubbling up awkwardly
  if (!apiKey || apiKey === 'dummy-key') {
     console.warn("API Key is missing. Using offline fallback.");
     return getFallbackProblem(missionId);
  }

  const topic = getTopicName(missionId);
  const model = "gemini-2.5-flash";

  const systemInstruction = `You are a strict mathematics teacher generator. 
  Generate a math problem about '${topic}' with '${difficulty}' difficulty level.
  The problem must be clear and solvable. 
  The answer must be a number (integer or decimal).
  Language: Thai (ภาษาไทย).
  Ensure the question is formatted nicely.
  If it's a sequence, provide the first few terms.
  
  IMPORTANT: Provide the 'explanationSteps' as an array of strings. Each string represents ONE step of the calculation or logic. Break it down line-by-line so it is easy to read.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Create a unique math problem about ${topic}.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "The text of the math problem in Thai" },
            sequenceData: { type: Type.STRING, description: "The sequence numbers if applicable (e.g., '2, 5, 8, ...'), else empty string" },
            correctAnswer: { type: Type.NUMBER, description: "The numeric answer" },
            hint: { type: Type.STRING, description: "A helpful hint without giving the answer" },
            explanationSteps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "An ordered list of steps to solve the problem. Each item is one line of explanation." 
            },
            variableUnit: { type: Type.STRING, description: "Unit of the answer if any (e.g. 'หน่วย', 'บาท', 'พจน์')" }
          },
          required: ["question", "correctAnswer", "explanationSteps", "hint"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from AI");
    
    return JSON.parse(jsonText) as MathProblem;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Fallback problem in case of API failure or rate limit
    return getFallbackProblem(missionId);
  }
};

export const askTutor = async (question: string, context: string): Promise<string> => {
  if (!apiKey || apiKey === 'dummy-key') {
    return "กรุณาตั้งค่า API Key เพื่อใช้งานระบบ AI Tutor (Offline Mode)";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context Problem: ${context}\n\nUser Question: ${question}`,
      config: {
        systemInstruction: "You are a helpful Thai math tutor. Explain clearly, encourage the student. Do not just give the answer directly, guide them to it. Keep it concise."
      }
    });
    return response.text || "ขออภัย ครูไม่สามารถตอบได้ในขณะนี้";
  } catch (error) {
    console.error("Tutor Error:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับครู AI";
  }
};

// Extracted fallback logic
const getFallbackProblem = (missionId: MissionId): MathProblem => {
    return {
      question: "ระบบ AI กำลังปิดปรับปรุงหรือไม่มี API Key กรุณาลองใหม่ภายหลัง (โจทย์ตัวอย่าง: จงหาผลบวก 10 พจน์แรก)",
      sequenceData: "2, 4, 6, ...",
      correctAnswer: 110,
      hint: "ใช้สูตร Sn = n/2 * (2a1 + (n-1)d)",
      explanationSteps: [
        "นี่คือโหมด Offline (เนื่องจากไม่พบ API Key หรือเกิดข้อผิดพลาด)",
        "จากโจทย์ ลำดับคือ 2, 4, 6, ...",
        "จะได้พจน์แรก a1 = 2",
        "ผลต่างร่วม d = 4 - 2 = 2",
        "ต้องการหาผลบวก 10 พจน์แรก (S10)",
        "จากสูตร Sn = n/2 * (2a1 + (n-1)d)",
        "แทนค่าลงในสูตร: S10 = 10/2 * (2(2) + (10-1)(2))",
        "S10 = 5 * (4 + 9(2))",
        "S10 = 5 * 22",
        "S10 = 110"
      ],
      variableUnit: "หน่วย"
    };
}