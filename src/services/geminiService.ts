import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface MoleculeInsight {
  name: string;
  iupac?: string;
  category: string;
  mechanismOfAction: string;
  researchSignificance: string;
  clinicalStatus: string;
  toxicityRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  phaseSuccessProbability: string;
  synthesizabilityScore: number; // 1-10 (10 is easiest)
  solubilityCategory: 'Poor' | 'Moderate' | 'Good' | 'Excellent';
  deepLearningMetrics?: {
    bindingAffinityEstimate: string;
    metabolicStability: 'Low' | 'Medium' | 'High';
    lipinskiViolationsDetail: string;
  };
  benchmarking: {
    referenceDrug: string;
    comparison: string;
  };
}

export interface SynthesisInsight {
  verdict: string;
  score: number;
  risk: 'Low' | 'Moderate' | 'High' | 'Critical';
  detailedAnalysis: string;
  potentialInteractions: { type: string; severity: string; description: string }[];
  resultantSmiles?: string;
  resultantName?: string;
  resultantProperties?: { mw: number; logp: number; tpsa: number };
}

export const geminiService = {
  async identifyMolecule(smiles: string): Promise<MoleculeInsight | null> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              iupac: { type: Type.STRING },
              category: { type: Type.STRING },
              mechanismOfAction: { type: Type.STRING },
              researchSignificance: { type: Type.STRING },
              clinicalStatus: { type: Type.STRING },
              toxicityRisk: { type: Type.STRING, enum: ["Low", "Moderate", "High", "Severe"] },
              phaseSuccessProbability: { type: Type.STRING },
              synthesizabilityScore: { type: Type.NUMBER },
              solubilityCategory: { type: Type.STRING, enum: ["Poor", "Moderate", "Good", "Excellent"] },
              deepLearningMetrics: {
                type: Type.OBJECT,
                properties: {
                  bindingAffinityEstimate: { type: Type.STRING },
                  metabolicStability: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                  lipinskiViolationsDetail: { type: Type.STRING }
                }
              },
              benchmarking: {
                type: Type.OBJECT,
                properties: {
                  referenceDrug: { type: Type.STRING },
                  comparison: { type: Type.STRING },
                }
              }
            },
            required: ["name", "category", "mechanismOfAction", "researchSignificance", "clinicalStatus", "toxicityRisk", "phaseSuccessProbability", "benchmarking", "synthesizabilityScore", "solubilityCategory"]
          },
          systemInstruction: "You are a world-class cheminformatics expert. Identify the molecule provided in SMILES notation. If it is a known drug or chemical, provide its common name, category, and research details. If it is a novel or unrecognized scaffold, provide its IUPAC name and a scientific evaluation of its potential chemical properties or research interest based on its structural features including synthesizability score (1-10, 10 easiest) and predicted solubility."
        },
        contents: [{ role: 'user', parts: [{ text: `Identify this molecule: ${smiles}` }] }]
      });

      if (response.text) {
        let text = response.text;
        if (text.includes('```')) {
          text = text.replace(/```(?:json)?\n?|```/g, '').trim();
        }
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("JSON Identification Parse Error:", e);
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Molecule Identification Error:", error);
      return null;
    }
  },

  async predictSynthesis(smilesA: string, smilesB: string): Promise<SynthesisInsight | null> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verdict: { type: Type.STRING },
              score: { type: Type.NUMBER },
              risk: { type: Type.STRING, enum: ["Low", "Moderate", "High", "Critical"] },
              detailedAnalysis: { type: Type.STRING },
              potentialInteractions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    description: { type: Type.STRING },
                  }
                }
              },
              resultantSmiles: { type: Type.STRING },
              resultantName: { type: Type.STRING },
              resultantProperties: {
                type: Type.OBJECT,
                properties: {
                  mw: { type: Type.NUMBER },
                  logp: { type: Type.NUMBER },
                  tpsa: { type: Type.NUMBER }
                }
              }
            },
            required: ["verdict", "score", "risk", "detailedAnalysis", "potentialInteractions", "resultantSmiles", "resultantName"]
          },
          systemInstruction: "You are a specialized medicinal chemist. Analyze the potential interaction or combined effect of two chemical compounds provided in SMILES notation. Predict the primary resultant compound if they were to react (or a hypothetical co-administered complex). Evaluate clinical synergy, cumulative toxicity, and structural compatibility."
        },
        contents: [{ role: 'user', parts: [{ text: `Analyze interaction and predict product between Molecule A: ${smilesA} and Molecule B: ${smilesB}` }] }]
      });

      if (response.text) {
        let text = response.text;
        if (text.includes('```')) {
          text = text.replace(/```(?:json)?\n?|```/g, '').trim();
        }
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("JSON Synthesis Parse Error:", e);
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Synthesis Prediction Error:", error);
      return null;
    }
  }
};
