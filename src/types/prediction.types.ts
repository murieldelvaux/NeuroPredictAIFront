export type FeatureImportance = {
  feature: string;
  impact: number;
  direction: 'risk' | 'protective';
};

export type AIAnalysisResult = {
  patientId: string;
  predictionDate: string;
  probability: number;
  riskCategory: 'High' | 'Moderate' | 'Low';
  confidenceScore: number;
  explainability: {
    shapAttributions: {
      featureName: string;
      attributionValue: number;
      category: 'Cognitive' | 'Imaging' | 'Clinical' | 'Demographic';
    }[];
    aiReasoningSummary: string;
    keyRiskDrivers: string[];
    protectiveFactors: string[];
  };
};
