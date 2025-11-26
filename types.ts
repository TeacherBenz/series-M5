
export enum MissionId {
  ARITHMETIC = 'arithmetic',
  GEOMETRIC = 'geometric',
  INFINITE = 'infinite',
  SIGMA = 'sigma',
}

export enum Difficulty {
  EASY = 'Easy (พื้นฐาน)',
  MEDIUM = 'Medium (ปานกลาง)',
  HARD = 'Hard (ท้าทาย)',
}

export interface MissionConfig {
  id: MissionId;
  title: string;
  description: string;
  icon: string; // Emoji or icon name
  color: string;
  gradient: string;
  imageUrl: string; // New field for background image
}

export interface MathProblem {
  question: string;
  sequenceData?: string; // Optional: specific numbers like "2, 4, 6, ..."
  correctAnswer: number;
  choices?: number[]; 
  explanationSteps: string[]; // Changed to array for step-by-step rendering
  hint: string;
  variableUnit?: string; // e.g., "พจน์ที่ n" or "ผลรวม"
}

// Gemini specific types
export interface GeneratedProblemResponse {
  problem: MathProblem;
}