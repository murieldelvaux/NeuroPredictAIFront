import type {
  HealthResponse,
  PatientDetailResponse,
  PatientCreatePayload,
  PredictPayload,
  PredictionResponse,
  PatientResponse,
} from '../types';

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://127.0.0.1:8000';

// ─── Core fetch helper ───────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
    const message =
      typeof err.detail === 'string'
        ? err.detail
        : Array.isArray(err.detail)
        ? err.detail.map((e: any) => e.msg).join(', ')
        : `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ─── Health ────────────────────────────────────────────────────────────

export const healthService = {
  check(): Promise<HealthResponse> {
    return apiFetch<HealthResponse>('/health');
  },
};

// ─── Patients ───────────────────────────────────────────────────────────

export const patientApiService = {
  /** GET /patients — returns list of all patients */
  getPatients(): Promise<PatientResponse[]> {
    return apiFetch<PatientResponse[]>('/patients');
  },

  /** GET /patients/{patient_id} — returns full patient detail */
  getPatient(id: string): Promise<PatientDetailResponse> {
    return apiFetch<PatientDetailResponse>(`/patients/${id}`);
  },

  /** POST /patients — creates a new patient record */
  createPatient(payload: PatientCreatePayload): Promise<PatientResponse> {
    return apiFetch<PatientResponse>('/patients', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// ─── Prediction ──────────────────────────────────────────────────────────

export const predictionApiService = {
  /**
   * POST /predict — multipart/form-data
   *
   * Backend signature (prediction.py):
   *   patient_id : str        (Form, required)
   *   mri_file   : UploadFile (File, required for real inference)
   *   age        : float      (Form, optional)
   *   mmse       : float      (Form, optional)
   *   cdr        : float      (Form, optional)
   *   cdrtot     : float      (Form, optional)
   *
   * The browser must set the Content-Type boundary automatically,
   * so we must NOT include 'Content-Type: application/json' here.
   */
  predict(payload: PredictPayload): Promise<PredictionResponse> {
    const form = new FormData();

    form.append('patient_id', payload.patient_id);

    if (payload.mri_file instanceof File) {
      form.append('mri_file', payload.mri_file);
    }

    if (payload.age != null)    form.append('age',    String(payload.age));
    if (payload.mmse != null)   form.append('mmse',   String(payload.mmse));
    if (payload.cdr != null)    form.append('cdr',    String(payload.cdr));
    if (payload.cdrtot != null) form.append('cdrtot', String(payload.cdrtot));

    // Use fetch directly — apiFetch forces Content-Type: application/json
    // which would break multipart. Let the browser set the boundary.
    return fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      body: form,
      // No Content-Type header — browser sets it with the correct boundary
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
        const message =
          typeof err.detail === 'string'
            ? err.detail
            : Array.isArray(err.detail)
            ? err.detail.map((e: any) => e.msg).join(', ')
            : `HTTP ${res.status}`;
        throw new Error(message);
      }
      return res.json() as Promise<PredictionResponse>;
    });
  },
};


