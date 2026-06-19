import type { PatientOut } from '@/types/api';
import type { Patient } from '@/types';

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

  const sex =
    p.sex === 'Male' || p.sex === 'Female' || p.sex === 'Other' ? p.sex : 'Other';

  return {
    id: p.id,
    name: p.name,
    age: p.age,
    sex,
    mrn: p.mrn ?? '—',
    riskScore: Math.round(score * 100),
    riskCategory: category,
    lastEvaluated: p.last_evaluated ?? '—',
    status: p.status ?? 'Pending Interpretation',
  };
}
