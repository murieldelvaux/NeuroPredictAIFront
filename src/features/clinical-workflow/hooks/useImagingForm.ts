import { useState } from 'react';

export function useImagingForm() {
  const [scanType, setScanType] = useState<string>('MRI 3T');
  const [scanDate, setScanDate] = useState('2026-06-10');
  const [radiologistNotes, setRadiologistNotes] = useState('Subcortical vascular parameters are constant. No distinct cortical anomalies reported.');
  const [customFileUploaded, setCustomFileUploaded] = useState<File | null>(null);

  return {
    scanType,
    setScanType,
    scanDate,
    setScanDate,
    radiologistNotes,
    setRadiologistNotes,
    customFileUploaded,
    setCustomFileUploaded,
  };
}