import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  Typography,
  Chip,
  IconButton,
  Divider,
  Grid,
  MenuItem,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as PlusIcon,
  Psychology as BrainIcon,
  Medication as MedIcon,
  MedicalServices as ClinicIcon,
  Assignment as NotesIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';

import type { PatientResponse, UpdateClinicalDataPayload } from '../../../../types';
import { useUpdateClinicalData } from '../../react-queries/useUpdateClinicalData';
import { useToast } from '../../../../providers/AppProviders';

interface NewAssessmentModalProps {
  open: boolean;
  onClose: () => void;
  patient: PatientResponse;
}

const COMMON_SYMPTOMS = [
  'Lapsos de memória recente',
  'Desorientação têmporo-espacial',
  'Dificuldade de nomeação (anomia)',
  'Perda de iniciativa / apatia',
  'Dificuldade em tarefas complexas',
  'Alterações de humor / ansiedade',
  'Flutuação cognitiva',
];

const COMMON_MEDICATIONS = [
  'Donepezil 5mg/dia',
  'Donepezil 10mg/dia',
  'Memantina 10mg 2x/dia',
  'Rivastigmina 4.6mg adesivo',
  'Rivastigmina 9.5mg adesivo',
  'Galantamina 8mg/dia',
  'Quetiapina 25mg',
];

const COMMON_COMORBIDITIES = [
  'Hipertensão Arterial',
  'Diabetes Mellitus Tipo 2',
  'Dislipidemia',
  'Depressão',
  'Apneia Obstrutiva do Sono',
];

const COMMON_BIOMARKERS = [
  'ApoE ε4 positivo (heterozigoto)',
  'ApoE ε4 positivo (homozigoto)',
  'Tau fosforilada (p-tau181) elevada',
  'Razão Aβ42/Aβ40 reduzida',
  'Atrofia hipocampal bilateral',
];

const CDR_OPTIONS = [
  { value: 0, label: '0.0 — Normal (Sem demência)' },
  { value: 0.5, label: '0.5 — Demência Questionável / CCL' },
  { value: 1.0, label: '1.0 — Demência Leve' },
  { value: 2.0, label: '2.0 — Demência Moderada' },
  { value: 3.0, label: '3.0 — Demência Grave' },
];

export default function NewAssessmentModal({ open, onClose, patient }: NewAssessmentModalProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { showToast } = useToast();
  const { mutateAsync: updateClinical, isPending } = useUpdateClinicalData(patient.id);

  const initialData = patient.clinical_data;

  // Form states
  const todayIso = new Date().toISOString().split('T')[0];
  const [assessmentDate, setAssessmentDate] = useState<string>(todayIso);
  const [mmse, setMmse] = useState<string>(initialData?.mmse != null ? String(initialData.mmse) : '');
  const [moca, setMoca] = useState<string>(initialData?.moca != null ? String(initialData.moca) : '');
  const [cdr, setCdr] = useState<number>(initialData?.cdr ?? 0.5);
  const [cdrtot, setCdrtot] = useState<string>(initialData?.cdrtot != null ? String(initialData.cdrtot) : '2.5');
  const [educationYears, setEducationYears] = useState<string>(
    initialData?.education_years != null ? String(initialData.education_years) : '12',
  );

  // Dynamic tags
  const [symptoms, setSymptoms] = useState<string[]>(initialData?.symptoms ?? []);
  const [medications, setMedications] = useState<string[]>(initialData?.medications ?? []);
  const [comorbidities, setComorbidities] = useState<string[]>(initialData?.comorbidities ?? []);
  const [biomarkers, setBiomarkers] = useState<string[]>(initialData?.biomarkers ?? []);

  // Tag inputs
  const [symptomInput, setSymptomInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');
  const [comorbidityInput, setComorbidityInput] = useState('');
  const [biomarkerInput, setBiomarkerInput] = useState('');
  const [notes, setNotes] = useState('');

  // Add tag helpers
  const addTag = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    const trimmed = val.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
  };

  const removeTag = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, target: string) => {
    setList(list.filter((item) => item !== target));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format assessment_date into DD/MM/YYYY or send ISO
    let formattedDate = assessmentDate;
    if (/^\d{4}-\d{2}-\d{2}$/.test(assessmentDate)) {
      const [year, month, day] = assessmentDate.split('-');
      formattedDate = `${day}/${month}/${year}`;
    }

    const payload: UpdateClinicalDataPayload = {
      assessment_date: formattedDate,
      mmse: mmse !== '' ? Number(mmse) : null,
      moca: moca !== '' ? Number(moca) : null,
      cdr: cdr != null ? Number(cdr) : null,
      cdrtot: cdrtot !== '' ? Number(cdrtot) : null,
      education_years: educationYears !== '' ? Number(educationYears) : null,
      symptoms,
      medications,
      comorbidities,
      biomarkers,
      notes: notes.trim() || undefined,
    };

    try {
      await updateClinical(payload);
      showToast('Nova avaliação clínica registrada com sucesso!', 'success');
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao salvar avaliação';
      showToast(message, 'error');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            bgcolor: isDark ? '#111a2e' : '#ffffff',
            backgroundImage: 'none',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
            boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.6)' : '0 20px 40px rgba(0,0,0,0.1)',
          },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
            pb: 2,
            pt: 2.5,
            px: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: isDark ? 'rgba(2, 132, 199, 0.2)' : 'rgba(2, 132, 199, 0.1)',
                color: 'primary.main',
              }}
            >
              <ClinicIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Nova Avaliação Clínica e Cognitiva
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Paciente: <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{patient.name}</Box> • Registro: {patient.id}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3.5 }} dividers>
          {/* Seção 1: Data e Escores Cognitivos */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BrainIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }} color="primary">
                1. Data da Consulta & Testes Neuropsicológicos
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <TextField
                label="Data da Avaliação"
                type="date"
                required
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                size="small"
                fullWidth
              />

              <TextField
                label="MMSE (Mini-Mental)"
                type="number"
                slotProps={{ htmlInput: { min: 0, max: 30, step: 1 } }}
                value={mmse}
                onChange={(e) => setMmse(e.target.value)}
                helperText="Escala de 0 a 30"
                size="small"
                fullWidth
              />

              <TextField
                label="MoCA (Avaliação Cognitiva)"
                type="number"
                slotProps={{ htmlInput: { min: 0, max: 30, step: 1 } }}
                value={moca}
                onChange={(e) => setMoca(e.target.value)}
                helperText="Escala de 0 a 30"
                size="small"
                fullWidth
              />

              <TextField
                label="CDR-SB (Sum of Boxes)"
                type="number"
                slotProps={{ htmlInput: { min: 0, max: 18, step: 0.5 } }}
                value={cdrtot}
                onChange={(e) => setCdrtot(e.target.value)}
                helperText="Escala de 0 a 18"
                size="small"
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
              <TextField
                select
                label="CDR Global (Clinical Dementia Rating)"
                value={cdr}
                onChange={(e) => setCdr(Number(e.target.value))}
                size="small"
                fullWidth
              >
                {CDR_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Escolaridade (Anos de estudo)"
                type="number"
                slotProps={{ htmlInput: { min: 0, max: 30 } }}
                value={educationYears}
                onChange={(e) => setEducationYears(e.target.value)}
                size="small"
                fullWidth
              />

            </Box>
          </Box>

          <Divider />

          {/* Seção 2: Sintomas e Medicações */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <MedIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }} color="primary">
                2. Sintomas Atuais & Medicamentos em Uso
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Sintomas */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block' }} color="text.secondary">
                  Sintomas Referidos ou Observados
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    placeholder="Digite um sintoma e pressione Enter ou clique em Adicionar"
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(symptoms, setSymptoms, symptomInput);
                        setSymptomInput('');
                      }
                    }}
                    size="small"
                    fullWidth
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      addTag(symptoms, setSymptoms, symptomInput);
                      setSymptomInput('');
                    }}
                    startIcon={<PlusIcon />}
                    sx={{ flexShrink: 0 }}
                  >
                    Adicionar
                  </Button>
                </Box>

                {/* Selected Symptoms Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.25 }}>
                  {symptoms.map((symptom) => (
                    <Chip
                      key={symptom}
                      label={symptom}
                      size="small"
                      onDelete={() => removeTag(symptoms, setSymptoms, symptom)}
                      color="primary"
                      variant="filled"
                      sx={{ fontWeight: 600 }}
                    />
                  ))}
                  {symptoms.length === 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Nenhum sintoma adicionado ainda.
                    </Typography>
                  )}
                </Box>

                {/* Quick Suggestion Chips */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary', mr: 0.5 }}>
                    Sugestões rápidas:
                  </Typography>
                  {COMMON_SYMPTOMS.map((sug) => {
                    const isAdded = symptoms.includes(sug);
                    if (isAdded) return null;
                    return (
                      <Chip
                        key={sug}
                        label={`+ ${sug}`}
                        size="small"
                        onClick={() => addTag(symptoms, setSymptoms, sug)}
                        sx={{
                          fontSize: '10px',
                          height: 22,
                          cursor: 'pointer',
                          bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                          '&:hover': { bgcolor: 'primary.light', color: '#fff' },
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>

              {/* Medicações */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block' }} color="text.secondary">
                  Medicamentos em Uso
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    placeholder="Digite a medicação e dosagem (ex: Donepezil 5mg/dia)"
                    value={medicationInput}
                    onChange={(e) => setMedicationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(medications, setMedications, medicationInput);
                        setMedicationInput('');
                      }
                    }}
                    size="small"
                    fullWidth
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      addTag(medications, setMedications, medicationInput);
                      setMedicationInput('');
                    }}
                    startIcon={<PlusIcon />}
                    sx={{ flexShrink: 0 }}
                  >
                    Adicionar
                  </Button>
                </Box>

                {/* Selected Medications Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.25 }}>
                  {medications.map((med) => (
                    <Chip
                      key={med}
                      label={med}
                      size="small"
                      onDelete={() => removeTag(medications, setMedications, med)}
                      color="secondary"
                      variant="filled"
                      sx={{ fontWeight: 600 }}
                    />
                  ))}
                  {medications.length === 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Nenhum medicamento informado.
                    </Typography>
                  )}
                </Box>

                {/* Quick Medications */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary', mr: 0.5 }}>
                    Sugestões:
                  </Typography>
                  {COMMON_MEDICATIONS.map((sug) => {
                    if (medications.includes(sug)) return null;
                    return (
                      <Chip
                        key={sug}
                        label={`+ ${sug}`}
                        size="small"
                        onClick={() => addTag(medications, setMedications, sug)}
                        sx={{
                          fontSize: '10px',
                          height: 22,
                          cursor: 'pointer',
                          bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                          '&:hover': { bgcolor: 'secondary.light', color: '#fff' },
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Seção 3: Comorbidades, Biomarcadores e Notas */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <NotesIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }} color="primary">
                3. Observações Clínicas da Consulta
              </Typography>
            </Box>

            <TextField
              label="Notas da Consulta / Evolução Clínica"
              placeholder="Descreva a evolução do quadro, adesão medicamentosa, impressões da equipe multidisciplinar..."
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={onClose} color="inherit" disabled={isPending} sx={{ fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : <ClinicIcon />}
            sx={{ fontWeight: 800, px: 3 }}
          >
            {isPending ? 'Salvando Avaliação...' : 'Salvar Nova Avaliação'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
