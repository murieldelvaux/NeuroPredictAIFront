import { Box, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { Image as BrainIcon } from '@mui/icons-material';

type MRIUploadStepProps = {
  scanType: string;
  scanDate: string;
  radiologistNotes: string;
  customFileUploaded: File | null;
  onScanTypeChange: (value: string) => void;
  onScanDateChange: (value: string) => void;
  onRadiologistNotesChange: (value: string) => void;
  onCustomFileChange: (file: File | null) => void;
};

export default function MRIUploadStep({
  scanType,
  scanDate,
  radiologistNotes,
  customFileUploaded,
  onScanTypeChange,
  onScanDateChange,
  onRadiologistNotesChange,
  onCustomFileChange,
}: MRIUploadStepProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="workflow-step-four">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
        <BrainIcon sx={{ color: 'primary.main' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Etapa 4: Upload de exame MRI</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="select-scan-type-label">TIPO DE MÉTRICA DE IMAGEM</InputLabel>
            <Select labelId="select-scan-type-label" value={scanType} label="TIPO DE MÉTRICA DE IMAGEM" onChange={(e) => onScanTypeChange(e.target.value)}>
              <MenuItem value="MRI 3T">MRI 3.0 Tesla Structural Scan</MenuItem>
              <MenuItem value="PET-FDG">PET Scan (FDG Metabolic Marker)</MenuItem>
              <MenuItem value="CT Scan">CT Scan Computed Tomography</MenuItem>
            </Select>
          </FormControl>
          <TextField label="DATA DE AQUISIÇÃO DO SCAN" type="date" fullWidth size="small" value={scanDate} onChange={(e) => onScanDateChange(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
        </Box>

        <TextField label="ACHADOS DO RADIOLOGISTA E OBSERVAÇÕES CLÍNICAS" fullWidth multiline rows={4} value={radiologistNotes} onChange={(e) => onRadiologistNotesChange(e.target.value)} placeholder="Declare initial structural findings here..." slotProps={{ inputLabel: { shrink: true } }} />

        <Paper variant="outlined" sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 2, p: 4, textAlign: 'center', position: 'relative', bgcolor: 'background.paper', '&:hover': { borderColor: 'primary.main' } }}>
          <input
            type="file"
            accept=".nii,.nii.gz,.dcm"
            onChange={(e) => onCustomFileChange(e.target.files?.[0] ?? null)}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
          />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {customFileUploaded ? `✓ Arquivo anexado: ${customFileUploaded.name}` : 'Buscar conjuntos de voxels de ressonância (opcional)'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Aceita pastas DICOM e formatos estruturais NIfTI (.nii.gz)
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}