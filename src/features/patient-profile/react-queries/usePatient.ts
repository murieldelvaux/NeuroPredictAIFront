import { useQuery } from '@tanstack/react-query';
import type { QueryFnOptions } from '../../../lib/react-query/react-query';
import type { PatientDetailOut } from '../../../types/api';
import type {
  PatientRecord,
  PatientDemographics,
  ClinicalHistory,
  CognitiveEvaluation,
  ImagingExam,
  ImagingAnalysisResult,
  AIAnalysisResult,
} from '../../../types';
import { getPatient } from '../requests/getPatient';
import { adaptPatientOut } from '../../dashboard/utils/adaptPatientOut';

export const patientQueryKey = 'patient';

type UsePatientOptions<TData = PatientRecord> = {
  options?: QueryFnOptions<PatientRecord, TData>;
};

const mapGender = (value: unknown): PatientDemographics['sex'] => {
  if (value === 'Male' || value === 'Female' || value === 'Other') return value;
  if (value === 'M') return 'Male';
  if (value === 'F') return 'Female';
  return 'Other';
};

const normalizeList = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String).filter(Boolean) : [];

/**
 * FIX: mapDemographics now falls back to root-level PatientDetailOut fields
 * when the demographics sub-object is empty or missing — which happens when
 * the backend GET /patients/{id} returns a flat PatientOut-compatible structure
 * without nesting demographic details.
 */
const mapDemographics = (detail: PatientDetailOut): PatientDemographics => {
  const d = detail.demographics ?? {};
  console.log('Mapping demographics with detail:', d);
  return {
    id: detail.patient.id,
    // name: prefer sub-object, fall back to root
    name: d.name ?? detail.patient.name,
    // age: prefer sub-object, fall back to root
    age: Number(d.age ?? detail.patient.age ?? 0),
    sex: mapGender(d.sex ?? detail.patient.sex),
    mrn: d.mrn ?? detail.patient.mrn ?? '—',
    dob: d.date_of_birth ?? d.dob ?? '—',
    phone: d.phone ?? d.telephone ?? d.phone_encrypted ?? '—',
    email: d.email ?? d.secure_email ?? '—',
    educationYears: Number(d.education_years ?? d.educationYears ?? 0),
  };
};

/**
 * FIX: mapHistory falls back gracefully when history sub-object is empty.
 */
const mapHistory = (detail: PatientDetailOut): ClinicalHistory => {
  const h = detail.history ?? {};
  return {
    symptoms: normalizeList(h.symptoms ?? h.active_presenting_symptoms),
    familyHistory: {
      alzheimersRelation: normalizeList(h.alzheimers_relation ?? h.family_history_relations),
      dementiaCount: Number(h.dementia_count ?? (h.family_history ? 1 : 0)),
    },
    riskFactors: normalizeList(h.risk_factors ?? h.apoe_biomarkers_risk_vectors),
    comorbidities: normalizeList(h.comorbidities ?? h.registered_comorbidities),
    medications: normalizeList(h.medications ?? h.admitted_medications),
  };
};

const statusFromScore = (
  score: number,
  kind: 'mmse' | 'moca' | 'cdr',
): 'Normal' | 'Mild Cognitive Impairment' | 'Severe' | string => {
  if (kind === 'cdr') {
    if (score >= 2) return 'Severe';
    if (score >= 0.5) return 'Mild Cognitive Impairment';
    return 'Normal';
  }
  if (score <= 17) return 'Severe';
  if (score <= 25) return 'Mild Cognitive Impairment';
  return 'Normal';
};

/**
 * FIX: mapCognitive falls back to root-level cognitive score fields
 * (e.g. detail.mmse, detail.cdr) when the cognitive sub-object is empty.
 * Also tolerates a flat API response without a nested cognitive object.
 */
const mapCognitive = (detail: PatientDetailOut): CognitiveEvaluation => {
  const c = detail.cognitive ?? {};
  const rootAny = detail as any;
  const assessmentDate =
    c.assessment_date ?? detail.patient.last_evaluated ?? new Date().toISOString().split('T')[0];

  // Prefer nested, fall back to root-level fields that some backends return flat
  const mmse = Number(c.mmse ?? rootAny.mmse ?? 0);
  const moca = Number(c.moca ?? rootAny.moca ?? 0);
  const cdr  = Number(c.cdr  ?? rootAny.cdr  ?? 0);

  return {
    patientId: detail.patient.id,
    mmse: {
      score: mmse,
      maxScore: 30,
      status: statusFromScore(mmse, 'mmse') as 'Normal' | 'Mild Cognitive Impairment' | 'Severe',
      assessmentDate,
    },
    moca: {
      score: moca,
      maxScore: 30,
      status: statusFromScore(moca, 'moca') as 'Normal' | 'Mild Cognitive Impairment' | 'Severe',
      assessmentDate,
    },
    cdr: {
      score: cdr,
      status: statusFromScore(cdr, 'cdr'),
      assessmentDate,
    },
    history:
      Array.isArray(c.history) && c.history.length
        ? c.history.map((item: any) => ({
            date: item.date ?? assessmentDate,
            mmse: Number(item.mmse ?? mmse),
            moca: Number(item.moca ?? moca),
            cdr: Number(item.cdr ?? cdr),
          }))
        : [{ date: assessmentDate, mmse, moca, cdr }],
  };
};

const mapExam = (detail: PatientDetailOut): ImagingExam | undefined => {
  const e = detail.exam ?? {};
  const ia = detail.imaging_analysis ?? {};
  const hasExam = Object.keys(e).length > 0 || Object.keys(ia).length > 0;
  if (!hasExam) return undefined;

  return {
    id: String(e.id ?? `${detail.patient.id}-mri`),
    scanType: (e.scan_type ?? 'MRI 3T') as ImagingExam['scanType'],
    scanDate: e.scan_date ?? detail.patient.last_evaluated ?? '—',
    radiologistNotes: e.radiologist_notes ?? 'MRI uploaded for AI processing.',
    status: (e.status ?? 'Completed') as ImagingExam['status'],
    metadata: {
      magneticStrength: e.metadata?.magnetic_strength ?? e.magnetic_strength ?? '3T',
      sliceThickness: e.metadata?.slice_thickness ?? e.slice_thickness ?? '1mm',
      repetitionTime: e.metadata?.repetition_time ?? e.repetition_time,
      echoTime: e.metadata?.echo_time ?? e.echo_time,
    },
  };
};

const mapImagingAnalysis = (detail: PatientDetailOut): ImagingAnalysisResult | undefined => {
  const ia = detail.imaging_analysis ?? {};
  if (!Object.keys(ia).length) return undefined;

  return {
    scanId: String(ia.scan_id ?? `${detail.patient.id}-mri`),
    status: (ia.status ?? 'Success') as ImagingAnalysisResult['status'],
    hippocampalVolumeLeft: Number(ia.hippocampal_volume_left ?? ia.left_hippocampal_volume ?? 0),
    hippocampalVolumeRight: Number(ia.hippocampal_volume_right ?? ia.right_hippocampal_volume ?? 0),
    ventricleEnlargementRatio: Number(ia.ventricle_enlargement_ratio ?? ia.ventricle_ratio ?? 0),
    corticalThicknessAvg: Number(ia.cortical_thickness_avg ?? ia.cortical_thickness ?? 0),
    findings: normalizeList(ia.findings),
  };
};

const mapAIAnalysis = (detail: PatientDetailOut): AIAnalysisResult | null => {
  const ia = detail.ai_analysis ?? {};
  if (!Object.keys(ia).length) return null;

  return {
    patientId: detail.patient.id,
    predictionDate: ia.prediction_date ?? ia.date ?? new Date().toISOString(),
    probability: Number(ia.probability ?? ia.score ?? 0),
    riskCategory: ia.risk_category ?? ia.risk ?? 'Low',
    modelVersion: ia.model_version ?? ia.version ?? 'unknown',
    explanation: ia.explanation ?? ia.explain ?? null,
  } as unknown as AIAnalysisResult;
};

export const usePatient = <TData = PatientRecord>(
  id: string,
  { options = {} }: UsePatientOptions<TData> = {},
) => {
  return useQuery({
    ...options,
    queryKey: [patientQueryKey, id],
    queryFn: async () => {
      const detail = await getPatient(id);
      console.log("detail before return:", detail);
      return {
        patient: adaptPatientOut(detail.patient),
        demographics: mapDemographics(detail),
        history: mapHistory(detail),
        cognitive: mapCognitive(detail),
        exam: mapExam(detail),
        imagingAnalysis: mapImagingAnalysis(detail),
        aiAnalysis: mapAIAnalysis(detail),
      } satisfies PatientRecord;
    },
    // FIX: only run query when id is a non-empty string
    enabled: typeof id === 'string' && id.trim().length > 0,
    staleTime: 5000,
  });
};
