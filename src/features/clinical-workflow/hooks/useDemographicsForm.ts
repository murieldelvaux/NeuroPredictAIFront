import { useState } from 'react';
import type { PatientSex } from '../../../types';

export function useDemographicsForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<number>(70);
  const [sex, setSex] = useState<PatientSex>('M');
  const [dateOfBirth, setDateOfBirth] = useState('1956-06-20');
  const [mrn] = useState<string>(() => `MRN-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(10 + Math.random() * 89)}Z`);
  const [educationYears, setEducationYears] = useState<number>(14);

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    age,
    setAge,
    sex,
    setSex,
    dateOfBirth,
    setDateOfBirth,
    mrn,
    educationYears,
    setEducationYears,
  };
}