import { useState } from 'react';

export function useCognitiveTestsForm() {
  const [mmseScore, setMmseScore] = useState<number>(24);
  const [mocaScore, setMocaScore] = useState<number>(22);
  const [cdrScore, setCdrScore] = useState<number>(0.5);
  const [cdrtotScore, setCdrtotScore] = useState<number>(0.5);

  return {
    mmseScore,
    setMmseScore,
    mocaScore,
    setMocaScore,
    cdrScore,
    setCdrScore,
    cdrtotScore,
    setCdrtotScore,
  };
}