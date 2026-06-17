import {
  Patient,
  PatientDemographics,
  ClinicalHistory,
  CognitiveEvaluation,
  ImagingExam,
  ImagingAnalysisResult,
  AIAnalysisResult
} from '../types';
import * as mockSeeds from './mockData';

// Simulated DB with localStorage persistence
const DB = {
  getPatients: (): Patient[] => {
    const raw = localStorage.getItem('np_patients');
    if (!raw) {
      localStorage.setItem('np_patients', JSON.stringify(mockSeeds.initialPatients));
      return mockSeeds.initialPatients;
    }
    return JSON.parse(raw);
  },
  savePatients: (patients: Patient[]) => {
    localStorage.setItem('np_patients', JSON.stringify(patients));
  },

  getDemographics: (): Record<string, PatientDemographics> => {
    const raw = localStorage.getItem('np_demographics');
    if (!raw) {
      localStorage.setItem('np_demographics', JSON.stringify(mockSeeds.initialDemographics));
      return mockSeeds.initialDemographics;
    }
    return JSON.parse(raw);
  },
  saveDemographics: (demos: Record<string, PatientDemographics>) => {
    localStorage.setItem('np_demographics', JSON.stringify(demos));
  },

  getHistories: (): Record<string, ClinicalHistory> => {
    const raw = localStorage.getItem('np_histories');
    if (!raw) {
      localStorage.setItem('np_histories', JSON.stringify(mockSeeds.initialHistories));
      return mockSeeds.initialHistories;
    }
    return JSON.parse(raw);
  },
  saveHistories: (hist: Record<string, ClinicalHistory>) => {
    localStorage.setItem('np_histories', JSON.stringify(hist));
  },

  getCognitiveScores: (): Record<string, CognitiveEvaluation> => {
    const raw = localStorage.getItem('np_cognitive');
    if (!raw) {
      localStorage.setItem('np_cognitive', JSON.stringify(mockSeeds.initialCognitiveScores));
      return mockSeeds.initialCognitiveScores;
    }
    return JSON.parse(raw);
  },
  saveCognitiveScores: (cog: Record<string, CognitiveEvaluation>) => {
    localStorage.setItem('np_cognitive', JSON.stringify(cog));
  },

  getImagingExams: (): Record<string, ImagingExam> => {
    const raw = localStorage.getItem('np_exams');
    if (!raw) {
      localStorage.setItem('np_exams', JSON.stringify(mockSeeds.initialImagingExams));
      return mockSeeds.initialImagingExams;
    }
    return JSON.parse(raw);
  },
  saveImagingExams: (ex: Record<string, ImagingExam>) => {
    localStorage.setItem('np_exams', JSON.stringify(ex));
  },

  getImagingAnalysis: (): Record<string, ImagingAnalysisResult> => {
    const raw = localStorage.getItem('np_img_analysis');
    if (!raw) {
      localStorage.setItem('np_img_analysis', JSON.stringify(mockSeeds.initialImagingAnalysis));
      return mockSeeds.initialImagingAnalysis;
    }
    return JSON.parse(raw);
  },
  saveImagingAnalysis: (an: Record<string, ImagingAnalysisResult>) => {
    localStorage.setItem('np_img_analysis', JSON.stringify(an));
  },

  getAIAnalysis: (): Record<string, AIAnalysisResult> => {
    const raw = localStorage.getItem('np_ai_analysis');
    if (!raw) {
      localStorage.setItem('np_ai_analysis', JSON.stringify(mockSeeds.initialAIAnalysis));
      return mockSeeds.initialAIAnalysis;
    }
    return JSON.parse(raw);
  },
  saveAIAnalysis: (ai: Record<string, AIAnalysisResult>) => {
    localStorage.setItem('np_ai_analysis', JSON.stringify(ai));
  }
};

// High fidelity timing simulator
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const patientService = {
  async getPatients(): Promise<Patient[]> {
    await delay(450);
    return DB.getPatients();
  },

  async getPatient(id: string): Promise<{
    patient: Patient;
    demographics: PatientDemographics;
    history: ClinicalHistory;
    cognitive: CognitiveEvaluation;
    exam?: ImagingExam;
    imagingAnalysis?: ImagingAnalysisResult;
    aiAnalysis?: AIAnalysisResult;
  }> {
    await delay(350);
    const patients = DB.getPatients();
    const foundPatient = patients.find(p => p.id === id);
    if (!foundPatient) throw new Error("Patient not found in clinical registry.");

    const demos = DB.getDemographics();
    const histories = DB.getHistories();
    const cognitives = DB.getCognitiveScores();
    const exams = DB.getImagingExams();
    const imagings = DB.getImagingAnalysis();
    const ais = DB.getAIAnalysis();

    const exam = Object.values(exams).find(e => {
      // Find the exam that correlates if any (img-01 correlates to pat-01, etc by ID mappings)
      const matchingScanId = id === "pat-01" ? "img-01" : id === "pat-02" ? "img-02" : id === "pat-03" ? "img-03" : "";
      return e.id === matchingScanId;
    });

    return {
      patient: foundPatient,
      demographics: demos[id] || {
        id,
        name: foundPatient.name,
        age: foundPatient.age,
        gender: foundPatient.gender,
        mrn: foundPatient.mrn,
        dob: "1960-01-01",
        phone: "N/A",
        email: "N/A",
        educationYears: 12
      },
      history: histories[id] || {
        symptoms: [],
        familyHistory: { alzheimersRelation: [], dementiaCount: 0 },
        riskFactors: [],
        comorbidities: [],
        medications: []
      },
      cognitive: cognitives[id] || {
        patientId: id,
        mmse: { score: 30, maxScore: 30, status: "Normal", assessmentDate: new Date().toISOString() },
        moca: { score: 30, maxScore: 30, status: "Normal", assessmentDate: new Date().toISOString() },
        cdr: { score: 0, status: "Normal", assessmentDate: new Date().toISOString() },
        history: []
      },
      exam,
      imagingAnalysis: exam ? imagings[exam.id] : undefined,
      aiAnalysis: ais[id]
    };
  },

  async createPatient(
    demographics: Omit<PatientDemographics, 'id'>,
    history: ClinicalHistory,
    cognitive: { mmse: number; moca: number; cdr: number },
    imaging?: { scanType: string; scanDate: string; radiologistNotes: string; fileUploaded?: string }
  ): Promise<Patient> {
    await delay(800);
    const patients = DB.getPatients();
    const newId = `pat-${(patients.length + 1).toString().padStart(2, '0')}`;
    const newScanId = `img-${(patients.length + 1).toString().padStart(2, '0')}`;

    // Categorize risk based on score formula
    let riskScore = 0;
    if (cognitive.mmse < 20) riskScore += 35;
    else if (cognitive.mmse < 26) riskScore += 15;

    if (cognitive.moca < 18) riskScore += 30;
    else if (cognitive.moca < 24) riskScore += 12;

    if (cognitive.cdr >= 1.0) riskScore += 25;
    else if (cognitive.cdr >= 0.5) riskScore += 10;

    if (history.riskFactors.some(f => f.toLowerCase().includes('apoe4'))) {
      riskScore += 10;
    }

    riskScore = Math.min(riskScore, 100);
    const riskCategory = riskScore > 60 ? "High" : riskScore > 30 ? "Moderate" : "Low";

    const newPatient: Patient = {
      id: newId,
      name: demographics.name,
      age: demographics.age,
      gender: demographics.gender,
      mrn: demographics.mrn,
      riskScore,
      riskCategory,
      lastEvaluated: new Date().toISOString().split('T')[0],
      status: imaging ? "Completed" : "Awaiting MRI"
    };

    patients.push(newPatient);
    DB.savePatients(patients);

    // Save Demographics
    const demos = DB.getDemographics();
    demos[newId] = {
      ...demographics,
      id: newId
    };
    DB.saveDemographics(demos);

    // Save Clinical History
    const histories = DB.getHistories();
    histories[newId] = history;
    DB.saveHistories(histories);

    // Save Cognitive
    const cognitives = DB.getCognitiveScores();
    cognitives[newId] = {
      patientId: newId,
      mmse: {
        score: cognitive.mmse,
        maxScore: 30,
        status: cognitive.mmse >= 25 ? "Normal" : cognitive.mmse >= 15 ? "Mild Cognitive Impairment" : "Severe",
        assessmentDate: new Date().toISOString().split('T')[0]
      },
      moca: {
        score: cognitive.moca,
        maxScore: 30,
        status: cognitive.moca >= 25 ? "Normal" : cognitive.moca >= 15 ? "Mild Cognitive Impairment" : "Severe",
        assessmentDate: new Date().toISOString().split('T')[0]
      },
      cdr: {
        score: cognitive.cdr,
        status: cognitive.cdr === 0 ? "Normal" : cognitive.cdr === 0.5 ? "Prodromal / Very Mild" : "Mild Dementia",
        assessmentDate: new Date().toISOString().split('T')[0]
      },
      history: [
        {
          date: new Date().getFullYear().toString() + "-" + String(new Date().getMonth() + 1).padStart(2, '0'),
          mmse: cognitive.mmse,
          moca: cognitive.moca,
          cdr: cognitive.cdr
        }
      ]
    };
    DB.saveCognitiveScores(cognitives);

    // Save Imaging Exam if provided
    if (imaging) {
      const exams = DB.getImagingExams();
      const imagings = DB.getImagingAnalysis();

      exams[newScanId] = {
        id: newScanId,
        scanType: imaging.scanType as any || "MRI 3T",
        scanDate: imaging.scanDate || new Date().toISOString().split('T')[0],
        status: "Completed",
        radiologistNotes: imaging.radiologistNotes || "No anomalies flagged by radiologists.",
        metadata: {
          magneticStrength: "3.0 Tesla",
          sliceThickness: "1.0 mm"
        }
      };
      DB.saveImagingExams(exams);

      // Generate MRI simulated analysis values
      const leftVol = Number((2.0 + Math.random() * 1.2).toFixed(2));
      const rightVol = Number((leftVol + (Math.random() * 0.1 - 0.05)).toFixed(2));
      const ventRatio = Number((0.2 + Math.random() * 0.2).toFixed(2));
      const corticalThick = Number((2.0 + Math.random() * 0.8).toFixed(2));

      imagings[newScanId] = {
        scanId: newScanId,
        status: "Success",
        hippocampalVolumeLeft: leftVol,
        hippocampalVolumeRight: rightVol,
        ventricleEnlargementRatio: ventRatio,
        corticalThicknessAvg: corticalThick,
        findings: [
          `Estimated average cortical thickness of ${corticalThick}mm`,
          `Symmetrical hippocampal indices: L ${leftVol}cm³, R ${rightVol}cm³`,
          `Calculated ventricles enlargement baseline factor of ${ventRatio}`
        ]
      };
      DB.saveImagingAnalysis(imagings);

      // Save AI analysis attributions
      const ais = DB.getAIAnalysis();
      ais[newId] = {
        patientId: newId,
        predictionDate: new Date().toISOString().split('T')[0],
        probability: Number((riskScore / 100).toFixed(2)),
        riskCategory,
        confidenceScore: Number((0.8 + Math.random() * 0.18).toFixed(2)),
        explainability: {
          shapAttributions: [
            { featureName: `MoCA Score (${cognitive.moca}/30)`, attributionValue: Number(((30 - cognitive.moca) * 0.02).toFixed(2)), category: "Cognitive" },
            { featureName: "Hippocampal Index Vol", attributionValue: leftVol < 2.5 ? 0.16 : -0.05, category: "Imaging" },
            { featureName: "ApoE4 Genetic Profile", attributionValue: history.riskFactors.some(f => f.toLowerCase().includes('apoe4')) ? 0.12 : -0.04, category: "Clinical" },
            { featureName: `Age (${demographics.age})`, attributionValue: Number(((demographics.age - 60) * 0.005).toFixed(2)), category: "Demographic" }
          ],
          aiReasoningSummary: `Auto-generated model attribution diagnostic. Risk coefficient predicted at ${riskScore}%. Primary influence matches the cognitive deficit markers alongside neural anatomical attributes in hippocampal sectors.`,
          keyRiskDrivers: [
            cognitive.moca < 24 ? "Compromised cognitive assessment responses" : "Mild diagnostic cognitive latency",
            leftVol < 2.5 ? "Noticeable focal temporal atrophy markers" : "Low structural temporal shrinkage indicators"
          ],
          protectiveFactors: [
            demographics.educationYears >= 16 ? "Elevated neurological cognitive headroom" : "Standard baseline protective profile"
          ]
        }
      };
      DB.saveAIAnalysis(ais);
    }

    return newPatient;
  }
};
