// Funções puras de mapeamento entre tipos de API (snake_case) e tipos de domínio (UI)
// Importe sempre daqui — nunca coloque lógica de formatação dentro de hooks.

import type {
  PatientSex,
  RiskCategory,
  Patient,
  PatientDemographics,
  ClinicalHistory,
  CognitiveEvaluation,
  ImagingExam,
  ImagingAnalysisResult,
} from '../../types/patient.types';
import type { AIAnalysisResult } from '../../types/prediction.types';
import type {
  PatientListItem,
  PatientDetailResponse,
} from '../../types/api/patient.api.types';

// ---------------------------------------------------------------------------
// Sex
// ---------------------------------------------------------------------------

/** Frontend domain ('M' | 'F') → API string ('M' | 'F') — identidade, mas explicita a intenção */
export const mapSexToApi = (sex: PatientSex): PatientSex => sex;

/** API string → frontend domain */
export const mapSexFromApi = (raw: unknown): PatientSex => {
  if (raw === 'M' || raw === 'F') return raw;
  // legado: alguns endpoints ainda retornam 'Male' / 'Female'
  if (raw === 'Male') return 'M';
  if (raw === 'Female') return 'F';
  return 'M'; // fallback seguro
};

// ---------------------------------------------------------------------------
// Risk category
// ---------------------------------------------------------------------------

export const mapRiskCategory = (raw: unknown, score = 0): RiskCategory => {
  const normalize = (s: string) =>
    (s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()) as RiskCategory;
  const candidates: RiskCategory[] = ['High', 'Moderate', 'Low'];
  const normalized = normalize(String(raw ?? ''));
  if (candidates.includes(normalized)) return normalized;
  if (score >= 0.6) return 'High';
  if (score >= 0.3) return 'Moderate';
  return 'Low';
};

// ---------------------------------------------------------------------------
// Cognitive status
// ---------------------------------------------------------------------------

export const mapCognitiveStatus = (
  score: number,
  kind: 'mmse' | 'moca' | 'cdr',
): 'Normal' | 'Mild Cognitive Impairment' | 'Severe' => {
  if (kind === 'cdr') {
    if (score >= 2) return 'Severe';
    if (score >= 0.5) return 'Mild Cognitive Impairment';
    return 'Normal';
  }
  if (score <= 17) return 'Severe';
  if (score <= 25) return 'Mild Cognitive Impairment';
  return 'Normal';
};

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

const toList = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String).filter(Boolean) : [];

// ---------------------------------------------------------------------------
// PatientListItem → Patient (usado em usePatients)
// ---------------------------------------------------------------------------

export const mapPatientListItem = (p: PatientListItem): Patient => ({
  id: p.id,
  name: p.name,
  age: p.age,
  sex: mapSexFromApi(p.sex),
  mrn: p.mrn ?? '—',
  riskScore: Math.round((p.riskScore ?? 0) * 100),
  riskCategory: mapRiskCategory(p.riskCategory, p.riskScore),
  lastEvaluated: p.lastEvaluated ?? '—',
  status: p.status ?? 'Pending Interpretation',
});

// ---------------------------------------------------------------------------
// PatientDetailResponse → sub-types (usado em usePatient)
// ---------------------------------------------------------------------------

export const mapDemographics = (detail: PatientDetailResponse): PatientDemographics => {
  const d = detail.demographics ?? {};
  const p = detail.patient;
  return {
    id: p.id,
    name: (d.name ?? p.name) as string,
    age: Number(d.age ?? p.age ?? 0),
    sex: mapSexFromApi(d.sex ?? p.sex),
    mrn: (d.mrn ?? '—') as string,
    date_of_birth: (p.date_of_birth ?? d.date_of_birth ?? '—') as string,
    phone: (d.phone ?? d.telephone ?? '—') as string,
    email: (d.email ?? '—') as string,
    educationYears: Number(d.education_years ?? d.educationYears ?? 0),
  };
};

export const mapHistory = (detail: PatientDetailResponse): ClinicalHistory => {
  const h = detail.history ?? {};
  return {
    symptoms: toList(h.symptoms ?? h.active_presenting_symptoms),
    familyHistory: {
      alzheimersRelation: toList(h.alzheimers_relation ?? h.family_history_relations),
      dementiaCount: Number(h.dementia_count ?? (h.family_history ? 1 : 0)),
    },
    riskFactors: toList(h.risk_factors ?? h.apoe_biomarkers_risk_vectors),
    comorbidities: toList(h.comorbidities ?? h.registered_comorbidities),
    medications: toList(h.medications ?? h.admitted_medications),
  };
};

export const mapCognitive = (detail: PatientDetailResponse): CognitiveEvaluation => {
  const c = detail.cognitive ?? {};
  const assessmentDate =
    (c.assessment_date as string | undefined) ??
    detail.patient.date_of_birth ??
    new Date().toISOString().split('T')[0];

  const mmse = Number(c.mmse ?? 0);
  const moca = Number(c.moca ?? 0);
  const cdr  = Number(c.cdr  ?? 0);

  return {
    patientId: detail.patient.id,
    mmse: {
      score: mmse,
      maxScore: 30,
      status: mapCognitiveStatus(mmse, 'mmse'),
      assessmentDate,
    },
    moca: {
      score: moca,
      maxScore: 30,
      status: mapCognitiveStatus(moca, 'moca'),
      assessmentDate,
    },
    cdr: {
      score: cdr,
      status: mapCognitiveStatus(cdr, 'cdr'),
      assessmentDate,
    },
    history:
      Array.isArray(c.history) && (c.history as unknown[]).length
        ? (c.history as Record<string, unknown>[]).map((item) => ({
            date: (item.date as string) ?? assessmentDate,
            mmse: Number(item.mmse ?? mmse),
            moca: Number(item.moca ?? moca),
            cdr:  Number(item.cdr  ?? cdr),
          }))
        : [{ date: assessmentDate, mmse, moca, cdr }],
  };
};

export const mapExam = (detail: PatientDetailResponse): ImagingExam | undefined => {
  const e  = detail.exam ?? {};
  const ia = detail.imaging_analysis ?? {};
  if (!Object.keys(e).length && !Object.keys(ia).length) return undefined;

  return {
    id: String((e.id as string | undefined) ?? `${detail.patient.id}-mri`),
    scanType: ((e.scan_type as ImagingExam['scanType']) ?? 'MRI 3T'),
    scanDate: (e.scan_date as string | undefined) ?? detail.patient.date_of_birth ?? '—',
    radiologistNotes: (e.radiologist_notes as string | undefined) ?? 'MRI uploaded for AI processing.',
    status: ((e.status as ImagingExam['status']) ?? 'Completed'),
    metadata: {
      magneticStrength: (e.magnetic_strength as string | undefined) ?? '3T',
      sliceThickness:   (e.slice_thickness   as string | undefined) ?? '1mm',
      repetitionTime:   e.repetition_time as string | undefined,
      echoTime:         e.echo_time        as string | undefined,
    },
  };
};

export const mapImagingAnalysis = (
  detail: PatientDetailResponse,
): ImagingAnalysisResult | undefined => {
  const ia = detail.imaging_analysis ?? {};
  if (!Object.keys(ia).length) return undefined;

  return {
    scanId: String((ia.scan_id as string | undefined) ?? `${detail.patient.id}-mri`),
    status: ((ia.status as ImagingAnalysisResult['status']) ?? 'Success'),
    hippocampalVolumeLeft:    Number(ia.hippocampal_volume_left    ?? ia.left_hippocampal_volume  ?? 0),
    hippocampalVolumeRight:   Number(ia.hippocampal_volume_right   ?? ia.right_hippocampal_volume ?? 0),
    ventricleEnlargementRatio: Number(ia.ventricle_enlargement_ratio ?? ia.ventricle_ratio ?? 0),
    corticalThicknessAvg:     Number(ia.cortical_thickness_avg     ?? ia.cortical_thickness       ?? 0),
    findings: toList(ia.findings),
  };
};

export const mapAIAnalysis = (detail: PatientDetailResponse): AIAnalysisResult | null => {
  const ia = detail.ai_analysis ?? {};
  if (!Object.keys(ia).length) return null;

  return {
    patientId:      detail.patient.id,
    predictionDate: (ia.prediction_date as string | undefined) ?? (ia.date as string | undefined) ?? new Date().toISOString(),
    probability:    Number(ia.probability ?? ia.score ?? 0),
    riskCategory:   (ia.risk_category as string | undefined) ?? (ia.risk as string | undefined) ?? 'Low',
    modelVersion:   (ia.model_version  as string | undefined) ?? (ia.version as string | undefined) ?? 'unknown',
    explanation:    (ia.explanation ?? ia.explain ?? null) as AIAnalysisResult['explanation'],
  };
};

// ---------------------------------------------------------------------------
// Patient list adapter (GET /patients — resposta como PatientListItem[])
// ---------------------------------------------------------------------------

export const mapPatientFromApi = (p: PatientListItem): Patient => ({
  id: p.id,
  name: p.name,
  age: p.age,
  sex: mapSexFromApi(p.sex),
  mrn: p.mrn ?? '—',
  riskScore: Math.round((p.riskScore ?? 0) * 100),
  riskCategory: mapRiskCategory(p.riskCategory, p.riskScore),
  lastEvaluated: p.lastEvaluated ?? '—',
  status: p.status ?? 'Pending Interpretation',
});
