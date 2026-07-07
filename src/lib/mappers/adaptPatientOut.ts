import type { Patient, PatientSex, PatientStatus } from '@/src/types';

type PatientOut = {
  id: string;
  name: string;
  age: number;
  sex?: string | null;
  mrn?: string | null;
  risk_score?: number | null;
  risk_category?: string | null;
  last_evaluated?: string | null;
  status?: string | null;
};

const normalizeSex = (raw?: string | null): PatientSex => {
  if (raw === 'M' || raw === 'F') return raw;
  if (raw === 'Male') return 'M';
  if (raw === 'Female') return 'F';
  return 'M';
};

const normalizeStatus = (raw?: string | null): PatientStatus => {
  const value = String(raw ?? 'Pending Interpretation').toLowerCase();
  if (value.includes('complete')) return 'Completed';
  if (value.includes('awaiting')) return 'Awaiting MRI';
  return 'Pending Interpretation';
};

export function adaptPatientOut(p: PatientOut): Patient {
  const score = p.risk_score ?? 0;
  const rawCategory = p.risk_category ?? '';

  const normalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const category = (['High', 'Moderate', 'Low'] as const).includes(
    normalize(rawCategory) as 'High' | 'Moderate' | 'Low',
  )
    ? (normalize(rawCategory) as 'High' | 'Moderate' | 'Low')
    : score >= 0.6
      ? 'High'
      : score >= 0.3
        ? 'Moderate'
        : 'Low';

  return {
    id: p.id,
    name: p.name,
    age: p.age,
    sex: normalizeSex(p.sex),
    mrn: p.mrn ?? '—',
    riskScore: Math.round(score * 100),
    riskCategory: category,
    lastEvaluated: p.last_evaluated ?? '—',
    status: normalizeStatus(p.status),
  };
}
