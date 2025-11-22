import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ChordData } from "../types";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

const chordSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    chordName: {
      type: Type.STRING,
      description: "The standard name of the guitar chord (e.g., C Major, G7).",
    },
    frets: {
      type: Type.ARRAY,
      items: { type: Type.INTEGER },
      description: "Array of 6 integers representing the fret number for each string from Low E (6th string) to High E (1st string). Use -1 for muted strings, 0 for open strings.",
    },
    fingers: {
      type: Type.ARRAY,
      items: { type: Type.INTEGER },
      description: "Array of 6 integers representing the finger used for each string from Low E to High E. 0=None, 1=Index, 2=Middle, 3=Ring, 4=Pinky, 5=Thumb.",
    },
    startingFret: {
      type: Type.INTEGER,
      description: "The fret number corresponding to the top of the diagram. Usually 1, unless the chord is played higher up the neck.",
    },
    barre: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        fret: { type: Type.INTEGER },
        startString: { type: Type.INTEGER, description: "String index (1-6) where barre starts." },
        endString: { type: Type.INTEGER, description: "String index (1-6) where barre ends." },
      },
      description: "Information about barre chord technique if applicable.",
    },
    description: {
      type: Type.STRING,
      description: "A helpful tip or instruction in Korean on how to hold this chord properly and avoid buzzing.",
    },
    difficulty: {
      type: Type.STRING,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
  },
  required: ["chordName", "frets", "fingers", "startingFret", "description", "difficulty"],
};

export const generateChord = async (query: string): Promise<ChordData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a guitar chord diagram for: "${query}". Provide the exact fingering, fret positions, and a helpful tip in Korean. Ensure the 'frets' and 'fingers' arrays have exactly 6 elements (String 6 to String 1).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: chordSchema,
        systemInstruction: "You are an expert guitar teacher. Always respond with accurate, standard guitar chord voicings. If the user asks for a non-existent chord, try to infer the closest valid chord.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data received from Gemini.");
    }

    const data = JSON.parse(text) as ChordData;
    return data;
  } catch (error) {
    console.error("Error fetching chord:", error);
    throw error;
  }
};