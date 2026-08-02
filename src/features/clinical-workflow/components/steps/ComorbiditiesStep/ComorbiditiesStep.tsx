import { Box, Button, Checkbox, FormControlLabel, Paper, TextField, Typography, Chip } from '@mui/material';
import { Add as AddIcon, MedicalServices as SymptomsIcon } from '@mui/icons-material';

type ComorbiditiesStepProps = {
  symptomsInput: string;
  symptomsList: string[];
  selectedRiskFactors: string[];
  selectedComorbidities: string[];
  medicationsInput: string;
  medicationsList: string[];
  hasFamilyHistory: boolean;
  familyRelation: string;
  dementiaCount: number;
  onSymptomsInputChange: (value: string) => void;
  onAddSymptom: () => void;
  onRemoveSymptom: (index: number) => void;
  onToggleRiskFactor: (value: string) => void;
  onToggleComorbidity: (value: string) => void;
  onMedicationsInputChange: (value: string) => void;
  onAddMedication: () => void;
  onRemoveMedication: (index: number) => void;
  onHasFamilyHistoryChange: (value: boolean) => void;
  onFamilyRelationChange: (value: string) => void;
  onDementiaCountChange: (value: number) => void;
};

export default function ComorbiditiesStep({
  symptomsInput,
  symptomsList,
  selectedRiskFactors,
  selectedComorbidities,
  medicationsInput,
  medicationsList,
  hasFamilyHistory,
  familyRelation,
  dementiaCount,
  onSymptomsInputChange,
  onAddSymptom,
  onRemoveSymptom,
  onToggleRiskFactor,
  onToggleComorbidity,
  onMedicationsInputChange,
  onAddMedication,
  onRemoveMedication,
  onHasFamilyHistoryChange,
  onFamilyRelationChange,
  onDementiaCountChange,
}: ComorbiditiesStepProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="workflow-step-three">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
        <SymptomsIcon sx={{ color: 'primary.main' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Etapa 3: Sintomas, comorbidades e histórico familiar</Typography>
      </Box>

      <Box id="wrapper-symptoms-input-block">
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>PRESENTING SYMPTOMS</Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField fullWidth size="small" placeholder="e.g. Mild word retrieval delays, subjective short term recall deficits" value={symptomsInput} onChange={(e) => onSymptomsInputChange(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddSymptom())} />
          <Button variant="contained" color="secondary" onClick={onAddSymptom} startIcon={<AddIcon />} sx={{ shrink: 0 }}>Add</Button>
        </Box>
        {symptomsList.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {symptomsList.map((tag, index) => <Chip key={tag + index} label={tag} size="small" onDelete={() => onRemoveSymptom(index)} sx={{ fontWeight: 'bold' }} />)}
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3.5 }}>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: '800', mb: 1.5 }}>HISTÓRICO FAMILIAR</Typography>
          <FormControlLabel control={<Checkbox size="small" checked={hasFamilyHistory} onChange={(e) => onHasFamilyHistoryChange(e.target.checked)} />} label={<Typography variant="body2">Possui histórico familiar?</Typography>} />
          <TextField fullWidth size="small" sx={{ mt: 2 }} value={familyRelation} onChange={(e) => onFamilyRelationChange(e.target.value)} label="Relação familiar" />
          <TextField fullWidth size="small" sx={{ mt: 2 }} type="number" value={dementiaCount} onChange={(e) => onDementiaCountChange(Math.max(0, parseInt(e.target.value) || 0))} label="Casos de demência" />
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: '800', mb: 1.5 }}>MARCADORES APOE E CARACTERÍSTICAS GENÉTICAS</Typography>
          {['ApoE4 positive (ε3/ε4)', 'ApoE4 positive (ε4/ε4)', 'Family history of early onset AD', 'Sedentary lifestyle habits'].map((factor) => (
            <FormControlLabel key={factor} control={<Checkbox size="small" checked={selectedRiskFactors.includes(factor)} onChange={() => onToggleRiskFactor(factor)} />} label={<Typography variant="body2">{factor}</Typography>} />
          ))}
        </Paper>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: '800', mb: 1.5 }}>COMORBIDADES GLOBAIS</Typography>
        {['Hypertension', 'Type 2 Diabetes mellitus', 'Hypercholesterolemia', 'Chronic Kidney Disease'].map((item) => (
          <FormControlLabel key={item} control={<Checkbox size="small" checked={selectedComorbidities.includes(item)} onChange={() => onToggleComorbidity(item)} />} label={<Typography variant="body2">{item}</Typography>} />
        ))}
      </Paper>

      <Box id="wrapper-medications-input-block">
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>MEDICAMENTOS PRESCRITOS</Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField fullWidth size="small" placeholder="e.g. Donepezil 10mg once daily at bedtime" value={medicationsInput} onChange={(e) => onMedicationsInputChange(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddMedication())} />
          <Button variant="contained" color="secondary" onClick={onAddMedication} startIcon={<AddIcon />} sx={{ shrink: 0 }}>Add</Button>
        </Box>
        {medicationsList.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {medicationsList.map((tag, index) => <Chip key={tag + index} label={tag} size="small" onDelete={() => onRemoveMedication(index)} sx={{ fontWeight: 'bold' }} />)}
          </Box>
        )}
      </Box>
    </Box>
  );
}