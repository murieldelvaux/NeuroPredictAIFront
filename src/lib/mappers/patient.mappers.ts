// API-direct mapper functions — no UI-only abstractions
// Use API types directly; minimal transformation only where needed

import type {
  PatientListItem,
  PatientDetailResponse,
  PatientSex,
} from '../../types';

/** Normalize sex from API variants */
export const mapSexFromApi = (raw: unknown): PatientSex => {
  if (raw === 'M' || raw === 'F') return raw;
  if (raw === 'Male') return 'M';
  if (raw === 'Female') return 'F';
  return 'M';
};
