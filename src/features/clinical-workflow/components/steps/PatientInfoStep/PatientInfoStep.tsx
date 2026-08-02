import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Person as DemographicIcon } from '@mui/icons-material';
import type { PatientSex } from '../../../../../types';

type PatientInfoStepProps = {
  firstName: string;
  lastName: string;
  age: number;
  sex: PatientSex;
  dateOfBirth: string;
  educationYears: number;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onAgeChange: (value: number) => void;
  onSexChange: (value: PatientSex) => void;
  onDateOfBirthChange: (value: string) => void;
  onEducationYearsChange: (value: number) => void;
};

export default function PatientInfoStep({
  firstName,
  lastName,
  age,
  sex,
  dateOfBirth,
  educationYears,
  onFirstNameChange,
  onLastNameChange,
  onAgeChange,
  onSexChange,
  onDateOfBirthChange,
  onEducationYearsChange,
}: PatientInfoStepProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="workflow-step-one">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
        <DemographicIcon sx={{ color: 'primary.main' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Etapa 1: Variáveis demográficas do paciente</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
        <TextField required label="PRIMEIRO NOME" fullWidth size="small" value={firstName} onChange={(e) => onFirstNameChange(e.target.value)} placeholder="Arthur" slotProps={{ inputLabel: { shrink: true } }} />
        <TextField required label="SOBRENOME" fullWidth size="small" value={lastName} onChange={(e) => onLastNameChange(e.target.value)} placeholder="Pendelton" slotProps={{ inputLabel: { shrink: true } }} />
        <TextField label="IDADE (ANOS)" type="number" fullWidth size="small" value={age} onChange={(e) => onAgeChange(Math.max(1, parseInt(e.target.value) || 0))} slotProps={{ inputLabel: { shrink: true } }} />
        <FormControl fullWidth size="small">
          <InputLabel id="select-gender-label">SEXO BIOLÓGICO</InputLabel>
          <Select labelId="select-gender-label" value={sex} label="SEXO BIOLÓGICO" onChange={(e) => onSexChange(e.target.value as PatientSex)}>
            <MenuItem value="M">Masculino</MenuItem>
            <MenuItem value="F">Feminino</MenuItem>
          </Select>
        </FormControl>
        <TextField label="DATA DE NASCIMENTO" type="date" fullWidth size="small" value={dateOfBirth} onChange={(e) => onDateOfBirthChange(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
        <TextField label="ANOS DE ESTUDO" type="number" fullWidth size="small" value={educationYears} onChange={(e) => onEducationYearsChange(Math.max(0, parseInt(e.target.value) || 0))} slotProps={{ inputLabel: { shrink: true } }} />
      </Box>
    </Box>
  );
}