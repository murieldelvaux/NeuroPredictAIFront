import { useState } from 'react';

export function useClinicalHistoryForm() {
  const [symptomsInput, setSymptomsInput] = useState<string>('');
  const [symptomsList, setSymptomsList] = useState<string[]>(['Mild word retrieval delays', 'Subjective short term recall deficits']);
  const [hasFamilyHistory, setHasFamilyHistory] = useState<boolean>(true);
  const [familyRelation, setFamilyRelation] = useState<string>('Grandmother');
  const [dementiaCount, setDementiaCount] = useState<number>(1);
  const [selectedRiskFactors, setSelectedRiskFactors] = useState<string[]>(['ApoE4 positive (ε3/ε4)']);
  const [selectedComorbidities, setSelectedComorbidities] = useState<string[]>(['Hypertension']);
  const [medicationsInput, setMedicationsInput] = useState<string>('');
  const [medicationsList, setMedicationsList] = useState<string[]>(['Lisinopril 10mg daily']);

  const addSymptom = () => {
    if (symptomsInput.trim()) {
      setSymptomsList([...symptomsList, symptomsInput.trim()]);
      setSymptomsInput('');
    }
  };

  const removeSymptom = (index: number) => {
    setSymptomsList(symptomsList.filter((_, i) => i !== index));
  };

  const addMedication = () => {
    if (medicationsInput.trim()) {
      setMedicationsList([...medicationsList, medicationsInput.trim()]);
      setMedicationsInput('');
    }
  };

  const removeMedication = (index: number) => {
    setMedicationsList(medicationsList.filter((_, i) => i !== index));
  };

  const toggleRiskFactor = (factor: string) => {
    if (selectedRiskFactors.includes(factor)) {
      setSelectedRiskFactors(selectedRiskFactors.filter((item) => item !== factor));
      return;
    }

    setSelectedRiskFactors([...selectedRiskFactors, factor]);
  };

  const toggleComorbidity = (item: string) => {
    if (selectedComorbidities.includes(item)) {
      setSelectedComorbidities(selectedComorbidities.filter((value) => value !== item));
      return;
    }

    setSelectedComorbidities([...selectedComorbidities, item]);
  };

  return {
    symptomsInput,
    setSymptomsInput,
    symptomsList,
    addSymptom,
    removeSymptom,
    hasFamilyHistory,
    setHasFamilyHistory,
    familyRelation,
    setFamilyRelation,
    dementiaCount,
    setDementiaCount,
    selectedRiskFactors,
    toggleRiskFactor,
    selectedComorbidities,
    toggleComorbidity,
    medicationsInput,
    setMedicationsInput,
    medicationsList,
    addMedication,
    removeMedication,
  };
}