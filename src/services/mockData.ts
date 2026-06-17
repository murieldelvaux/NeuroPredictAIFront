import { Patient, PatientDemographics, ClinicalHistory, CognitiveEvaluation, ImagingExam, ImagingAnalysisResult, AIAnalysisResult } from '../types';

export const initialPatients: Patient[] = [
  {
    id: "pat-01",
    name: "Arthur Pendelton",
    age: 74,
    gender: "Male",
    mrn: "MRN-39832-1A",
    riskScore: 78,
    riskCategory: "High",
    lastEvaluated: "2026-05-12",
    status: "Completed"
  },
  {
    id: "pat-02",
    name: "Eleanor Vance",
    age: 69,
    gender: "Female",
    mrn: "MRN-84221-3F",
    riskScore: 42,
    riskCategory: "Moderate",
    lastEvaluated: "2026-06-02",
    status: "Completed"
  },
  {
    id: "pat-03",
    name: "Dr. Robert Chen",
    age: 81,
    gender: "Male",
    mrn: "MRN-10943-7G",
    riskScore: 18,
    riskCategory: "Low",
    lastEvaluated: "2026-06-12",
    status: "Completed"
  },
  {
    id: "pat-04",
    name: "Miriam Sterling",
    age: 72,
    gender: "Female",
    mrn: "MRN-65103-9Z",
    riskScore: 0,
    riskCategory: "Low",
    lastEvaluated: "2026-06-15",
    status: "Awaiting MRI"
  }
];

export const initialDemographics: Record<string, PatientDemographics> = {
  "pat-01": {
    id: "pat-01",
    name: "Arthur Pendelton",
    age: 74,
    gender: "Male",
    mrn: "MRN-39832-1A",
    dob: "1952-03-14",
    phone: "(555) 234-9081",
    email: "a.pendelton@nhs-health.net",
    educationYears: 16
  },
  "pat-02": {
    id: "pat-02",
    name: "Eleanor Vance",
    age: 69,
    gender: "Female",
    mrn: "MRN-84221-3F",
    dob: "1957-09-21",
    phone: "(555) 872-4521",
    email: "e.vance@vancemail.org",
    educationYears: 12
  },
  "pat-03": {
    id: "pat-03",
    name: "Dr. Robert Chen",
    age: 81,
    gender: "Male",
    mrn: "MRN-10943-7G",
    dob: "1945-11-05",
    phone: "(555) 431-7649",
    email: "rchen.md@uc-clinical.edu",
    educationYears: 20
  },
  "pat-04": {
    id: "pat-04",
    name: "Miriam Sterling",
    age: 72,
    gender: "Female",
    mrn: "MRN-65103-9Z",
    dob: "1954-07-08",
    phone: "(555) 901-2311",
    email: "miriam.s@sterlingco.com",
    educationYears: 14
  }
};

export const initialHistories: Record<string, ClinicalHistory> = {
  "pat-01": {
    symptoms: ["Anterograde short-term memory deficit", "Word-finding difficulties", "Disorientation in unfamiliar surroundings"],
    familyHistory: {
      alzheimersRelation: ["Father (onset age 78)", "Paternal Aunt"],
      dementiaCount: 2
    },
    riskFactors: ["ApoE4 ε4/ε4 homozygous", "Hypertension", "Sedentary lifestyle"],
    comorbidities: ["Type 2 Diabetes mellitus", "Hypercholesterolemia"],
    medications: ["Donepezil 10mg QD", "Metformin 1000mg BID", "Atorvastatin 20mg QD"]
  },
  "pat-02": {
    symptoms: ["Mild mental fatigue", "Misplacing keys or utensils", "Occasional mild focus issues"],
    familyHistory: {
      alzheimersRelation: ["Maternal Grandmother (onset age 84)"],
      dementiaCount: 1
    },
    riskFactors: ["ApoE4 ε3/ε4 heterozygous", "Elevated systolic BP"],
    comorbidities: ["Osteoarthritis"],
    medications: ["Lisinopril 10mg QD", "Glucosamine daily"]
  },
  "pat-03": {
    symptoms: ["Slight subjective memory complaints but normal operational performance"],
    familyHistory: {
      alzheimersRelation: [],
      dementiaCount: 0
    },
    riskFactors: ["ApoE4 ε3/ε3 standard risk"],
    comorbidities: ["Controlled stage-1 hypertension"],
    medications: ["Amlodipine 5mg QD"]
  },
  "pat-04": {
    symptoms: ["Mild memory loss reported by spouse", "Repeating questions during evening hours"],
    familyHistory: {
      alzheimersRelation: ["Mother"],
      dementiaCount: 1
    },
    riskFactors: ["ApoE4 ε4 carrier status unknown"],
    comorbidities: ["Mild thyroid issues"],
    medications: ["Levothyroxine 50mcg"]
  }
};

export const initialCognitiveScores: Record<string, CognitiveEvaluation> = {
  "pat-01": {
    patientId: "pat-01",
    mmse: { score: 19, maxScore: 30, status: "Mild Cognitive Impairment", assessmentDate: "2026-05-12" },
    moca: { score: 16, maxScore: 30, status: "Mild Cognitive Impairment", assessmentDate: "2026-05-12" },
    cdr: { score: 1.0, status: "Mild Dementia", assessmentDate: "2026-05-12" },
    history: [
      { date: "2024-05", mmse: 26, moca: 23, cdr: 0.5 },
      { date: "2025-05", mmse: 22, moca: 19, cdr: 1.0 },
      { date: "2026-05", mmse: 19, moca: 16, cdr: 1.0 }
    ]
  },
  "pat-02": {
    patientId: "pat-02",
    mmse: { score: 26, maxScore: 30, status: "Normal", assessmentDate: "2026-06-02" },
    moca: { score: 24, maxScore: 30, status: "Mild Cognitive Impairment", assessmentDate: "2026-06-02" },
    cdr: { score: 0.5, status: "Prodromal / Very Mild", assessmentDate: "2026-06-02" },
    history: [
      { date: "2025-06", mmse: 28, moca: 26, cdr: 0 },
      { date: "2026-06", mmse: 26, moca: 24, cdr: 0.5 }
    ]
  },
  "pat-03": {
    patientId: "pat-03",
    mmse: { score: 29, maxScore: 30, status: "Normal", assessmentDate: "2026-06-12" },
    moca: { score: 28, maxScore: 30, status: "Normal", assessmentDate: "2026-06-12" },
    cdr: { score: 0.0, status: "Normal", assessmentDate: "2026-06-12" },
    history: [
      { date: "2024-06", mmse: 30, moca: 29, cdr: 0 },
      { date: "2025-06", mmse: 29, moca: 29, cdr: 0 },
      { date: "2026-06", mmse: 29, moca: 28, cdr: 0 }
    ]
  },
  "pat-04": {
    patientId: "pat-04",
    mmse: { score: 25, maxScore: 30, status: "Mild Cognitive Impairment", assessmentDate: "2026-06-15" },
    moca: { score: 22, maxScore: 30, status: "Mild Cognitive Impairment", assessmentDate: "2026-06-15" },
    cdr: { score: 0.5, status: "Prodromal / Very Mild", assessmentDate: "2026-06-15" },
    history: [
      { date: "2026-06", mmse: 25, moca: 22, cdr: 0.5 }
    ]
  }
};

export const initialImagingExams: Record<string, ImagingExam> = {
  "pat-01": {
    id: "img-01",
    scanType: "MRI 3T",
    scanDate: "2026-05-10",
    status: "Completed",
    radiologistNotes: "Bilateral ventricular enlargement noted. Symmetrical medial temporal lobe atrophy, elevated Scheltens Scale to Grade 3.",
    metadata: {
      magneticStrength: "3.0 Tesla",
      sliceThickness: "0.9 mm",
      repetitionTime: "1900 ms",
      echoTime: "2.1 ms"
    }
  },
  "pat-02": {
    id: "img-02",
    scanType: "MRI 3T",
    scanDate: "2026-06-01",
    status: "Completed",
    radiologistNotes: "Mild parietal lobe volume loss. Hipocampal structures appear borderline for age group, trace subcortical ischemic changes.",
    metadata: {
      magneticStrength: "3.0 Tesla",
      sliceThickness: "1.0 mm",
      repetitionTime: "2000 ms",
      echoTime: "2.5 ms"
    }
  },
  "pat-03": {
    id: "img-03",
    scanType: "MRI 3T",
    scanDate: "2026-06-10",
    status: "Completed",
    radiologistNotes: "Cortical volumes within normal reference limits for age. Medial temporal parameters stable; no microbleeds or critical infarcts detected.",
    metadata: {
      magneticStrength: "3.0 Tesla",
      sliceThickness: "1.0 mm"
    }
  }
};

export const initialImagingAnalysis: Record<string, ImagingAnalysisResult> = {
  "pat-01": {
    scanId: "img-01",
    status: "Success",
    hippocampalVolumeLeft: 2.12,
    hippocampalVolumeRight: 2.08,
    ventricleEnlargementRatio: 0.38,
    corticalThicknessAvg: 2.14,
    findings: [
      "Significant hippocampal structure volume reduction (approx >24% reduction relative to normal references)",
      "Severe local lateral ventricle enlargement index (0.38 ratio)",
      "Medial Temporal Lobe Atrophy (MTA) score: Left 3.0, Right 3.0"
    ]
  },
  "pat-02": {
    scanId: "img-02",
    status: "Success",
    hippocampalVolumeLeft: 2.68,
    hippocampalVolumeRight: 2.72,
    ventricleEnlargementRatio: 0.29,
    corticalThicknessAvg: 2.38,
    findings: [
      "Moderate symmetric reduction of medial temporal structures",
      "Ventricle enlargement index is borderline (0.29)",
      "Minimal grey matter shrinkage within primary visual cortical structures"
    ]
  },
  "pat-03": {
    scanId: "img-03",
    status: "Success",
    hippocampalVolumeLeft: 3.15,
    hippocampalVolumeRight: 3.19,
    ventricleEnlargementRatio: 0.21,
    corticalThicknessAvg: 2.62,
    findings: [
      "Hippocampal volumes correspond optimally with 85th percentile of matching age group",
      "Ventricles are non-enlarged and well-aligned within baseline thresholds"
    ]
  }
};

export const initialAIAnalysis: Record<string, AIAnalysisResult> = {
  "pat-01": {
    patientId: "pat-01",
    predictionDate: "2026-05-12",
    probability: 0.78,
    riskCategory: "High",
    confidenceScore: 0.94,
    explainability: {
      shapAttributions: [
        { featureName: "MoCA Score (16/30)", attributionValue: 0.28, category: "Cognitive" },
        { featureName: "Hippocampal Volume Reduction", attributionValue: 0.22, category: "Imaging" },
        { featureName: "ApoE4 Positive (ε4/ε4)", attributionValue: 0.18, category: "Clinical" },
        { featureName: "Age (74)", attributionValue: 0.08, category: "Demographic" },
        { featureName: "Type 2 Diabetes History", attributionValue: 0.06, category: "Clinical" },
        { featureName: "Education (16 Years)", attributionValue: -0.04, category: "Demographic" }
      ],
      aiReasoningSummary: "Deep learning fusion model predicts high risk for conversion to Alzheimer's pathology driven primarily by poor cognitive scores (MoCA 16, MMSE 19) and high-confidence neural feature maps of medial temporal atrophy (hippocampal volume is in the bottom 5% for matching cohort). Status is highly compounded by homozygous ApoE4 genetics.",
      keyRiskDrivers: [
        "Severe temporal lobe regional voxel shrinkage detected via PyTorch-MONAI pipeline",
        "Multiple cognitive evaluation subtest failure (retrieval & executive function subscores)",
        "Double-allele ApoE4 genetic predisposition"
      ],
      protectiveFactors: [
        "16 years formal education providing elevated neuropsychological reservation threshold",
        "Active prescription regime of cholinesterase inhibitor (Donepezil)"
      ]
    }
  },
  "pat-02": {
    patientId: "pat-02",
    predictionDate: "2026-06-02",
    probability: 0.42,
    riskCategory: "Moderate",
    confidenceScore: 0.88,
    explainability: {
      shapAttributions: [
        { featureName: "MoCA Score (24/30)", attributionValue: 0.14, category: "Cognitive" },
        { featureName: "ApoE4 Heterozygous (ε3/ε4)", attributionValue: 0.11, category: "Clinical" },
        { featureName: "Age (69)", attributionValue: 0.04, category: "Demographic" },
        { featureName: "Hippocampal Preservation", attributionValue: -0.05, category: "Imaging" },
        { featureName: "Normal MMSE (26/30)", attributionValue: -0.02, category: "Cognitive" }
      ],
      aiReasoningSummary: "Moderate clinical conversion indication. Sub-optimal MoCA executive function score is offset by solid relative hippocampal architecture protection (near 45th percentile). Heterozygous genetics is the primary biological driver.",
      keyRiskDrivers: [
        "Single ε4 ApoE allele predisposition",
        "Minor executive latency on clock-drawing items"
      ],
      protectiveFactors: [
        "Stable structural medial temporal dimensions",
        "Adequately preserved global cognitive capacity (MMSE 26)"
      ]
    }
  },
  "pat-03": {
    patientId: "pat-03",
    predictionDate: "2026-06-12",
    probability: 0.18,
    riskCategory: "Low",
    confidenceScore: 0.91,
    explainability: {
      shapAttributions: [
        { featureName: "Excellent MMSE (29/30)", attributionValue: -0.15, category: "Cognitive" },
        { featureName: "Optimal Hippocampal Size", attributionValue: -0.12, category: "Imaging" },
        { featureName: "High Education (20 Years)", attributionValue: -0.09, category: "Demographic" },
        { featureName: "Negative ApoE4 ε3/ε3", attributionValue: -0.06, category: "Clinical" },
        { featureName: "Advanced Age (81)", attributionValue: 0.05, category: "Demographic" }
      ],
      aiReasoningSummary: "Clear low risk category. Robust cognitive test performance has remained stable for three continuous years. Neural structural volumes are well-preserved and no genetic liability has been verified.",
      keyRiskDrivers: [
        "Advanced seniority (+81 years of age is independent baseline risk factor)"
      ],
      protectiveFactors: [
        "High degree of cognitive reserve (M.D. profile, 20 education years)",
        "Absence of genetic risks",
        "Preserved ventricular and hippocampal proportions"
      ]
    }
  }
};
