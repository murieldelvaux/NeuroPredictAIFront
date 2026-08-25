import { Box, Chip, Paper, Typography, useTheme } from '@mui/material';
import type { PatientLastPrediction, PatientResponse, PredictionResponse } from '../../../../types';
import { capitalizeName, formatDate } from '../../../../lib/utils/formatters';

type PredictionLike = PredictionResponse | PatientLastPrediction | null;

type PatientSummaryPanelProps = {
  patient: PatientResponse;
  displayRecordId: string;
  prediction: PredictionLike;
  examCount: number;
};

const getPredictionTone = (classification?: string | null, isDark = false) => {
  switch ((classification ?? '').toUpperCase()) {
    case 'AD':
    case 'DEM':
      return {
        color: isDark ? '#fb7185' : '#e11d48',
        bg: isDark ? 'rgba(244, 63, 94, 0.16)' : 'rgba(239, 68, 68, 0.08)',
        border: isDark ? 'rgba(244, 63, 94, 0.35)' : 'rgba(239, 68, 68, 0.24)',
      };
    case 'MCI':
      return {
        color: isDark ? '#fbbf24' : '#d97706',
        bg: isDark ? 'rgba(245, 158, 11, 0.16)' : 'rgba(245, 158, 11, 0.08)',
        border: isDark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.24)',
      };
    default:
      return {
        color: isDark ? '#34d399' : '#059669',
        bg: isDark ? 'rgba(16, 185, 129, 0.16)' : 'rgba(34, 197, 94, 0.08)',
        border: isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(34, 197, 94, 0.24)',
      };
  }
};

const getModelVersion = (prediction: PredictionLike) => {
  return prediction && 'model_version' in prediction ? prediction.model_version : 'resnet3d-oasis3';
};

const DetailChips = ({ items, emptyLabel, isDark }: { items: string[] | null | undefined; emptyLabel: string; isDark: boolean }) => {
  if (!items || items.length === 0) {
    return <Chip label={emptyLabel} size="small" variant="outlined" sx={{ fontSize: '11px', color: 'text.secondary' }} />;
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
      {items.map((item) => (
        <Chip
          key={item}
          label={item}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '11px',
            bgcolor: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.08)',
            color: isDark ? '#7dd3fc' : '#0369a1',
            border: '1px solid',
            borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.18)',
          }}
        />
      ))}
    </Box>
  );
};

const StatCard = ({
  eyebrow,
  title,
  details,
  isDark,
}: {
  eyebrow: string;
  title: string;
  details: string[];
  isDark: boolean;
}) => (
  <Box
    sx={{
      border: '1px solid',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
      borderRadius: 2.5,
      p: 2,
      minHeight: 132,
      background: isDark
        ? 'linear-gradient(180deg, rgba(22, 34, 56, 0.7) 0%, rgba(17, 26, 46, 0.95) 100%)'
        : 'linear-gradient(180deg, rgba(248, 250, 252, 0.85) 0%, rgba(255, 255, 255, 0.98) 100%)',
    }}
  >
    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
      {eyebrow}
    </Typography>
    <Typography variant="subtitle1" sx={{ mt: 0.75, fontWeight: 800, color: 'text.primary' }}>
      {title}
    </Typography>
    <Box sx={{ mt: 1.25, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      {details.map((detail) => (
        <Typography key={detail} variant="body2" sx={{ color: isDark ? '#cbd5e1' : 'text.secondary' }}>
          {detail}
        </Typography>
      ))}
    </Box>
  </Box>
);

const ContextStatCard = ({
  eyebrow,
  title,
  symptoms,
  comorbidities,
  biomarkers,
  medications,
  familyHistory,
  isDark,
}: {
  eyebrow: string;
  title: string;
  symptoms: string[] | null | undefined;
  comorbidities: string[] | null | undefined;
  biomarkers: string[] | null | undefined;
  medications: string[] | null | undefined;
  familyHistory: boolean | null | undefined;
  isDark: boolean;
}) => (
  <Box
    sx={{
      border: '1px solid',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
      borderRadius: 2.5,
      p: 2,
      minHeight: 132,
      background: isDark
        ? 'linear-gradient(180deg, rgba(22, 34, 56, 0.7) 0%, rgba(17, 26, 46, 0.95) 100%)'
        : 'linear-gradient(180deg, rgba(248, 250, 252, 0.85) 0%, rgba(255, 255, 255, 0.98) 100%)',
    }}
  >
    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
      {eyebrow}
    </Typography>
    <Typography variant="subtitle1" sx={{ mt: 0.75, fontWeight: 800, color: 'text.primary' }}>
      {title}
    </Typography>
    <Box sx={{ mt: 1.25, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      <Box>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 700, color: isDark ? '#94a3b8' : 'text.secondary' }}>
          Sintomas
        </Typography>
        <DetailChips items={symptoms} emptyLabel="não informados" isDark={isDark} />
      </Box>
      <Box>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 700, color: isDark ? '#94a3b8' : 'text.secondary' }}>
          Comorbidades
        </Typography>
        <DetailChips items={comorbidities} emptyLabel="não informadas" isDark={isDark} />
      </Box>
      <Box>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 700, color: isDark ? '#94a3b8' : 'text.secondary' }}>
          Biomarcadores e fatores
        </Typography>
        <DetailChips items={biomarkers} emptyLabel="não informados" isDark={isDark} />
      </Box>
      <Box>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 700, color: isDark ? '#94a3b8' : 'text.secondary' }}>
          Medicações em uso
        </Typography>
        <DetailChips items={medications} emptyLabel="não informadas" isDark={isDark} />
      </Box>
      <Typography variant="body2" sx={{ color: isDark ? '#cbd5e1' : 'text.secondary' }}>
        História familiar de demência: <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{familyHistory ? 'Sim' : 'Não'}</Box>
      </Typography>
    </Box>
  </Box>
);

export default function PatientSummaryPanel({ patient, displayRecordId, prediction, examCount }: PatientSummaryPanelProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const clinicalData = patient.clinical_data;
  const riskScore = Math.round(((prediction?.risk_score ?? 0) * 100));
  const confidence = Math.round(((('confidence' in (prediction ?? {}) ? prediction?.confidence : 0) ?? 0) * 100));
  const predictionTone = getPredictionTone(prediction?.classification, isDark);
  const symptomCount = clinicalData?.symptoms.length ?? 0;
  const comorbidityCount = clinicalData?.comorbidities.length ?? 0;

  const formattedName = capitalizeName(patient.name);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: { xs: 2.25, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        bgcolor: isDark ? '#111a2e' : '#ffffff',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.03em', color: 'text.primary' }}>
            {formattedName}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, color: isDark ? '#94a3b8' : 'text.secondary' }}>
            Perfil consolidado do paciente para leitura clínica, interpretação do exame e acompanhamento da última inferência de IA.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-start', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <Chip label={`Registro: ${displayRecordId}`} sx={{ fontWeight: 800 }} />
          <Chip label={`${examCount} exame(s) MRI`} variant="outlined" sx={{ fontWeight: 800 }} />
          {prediction && (
            <Chip
              label={`Última IA: ${prediction.classification} • risco ${riskScore}%`}
              sx={{
                fontWeight: 800,
                color: predictionTone.color,
                bgcolor: predictionTone.bg,
                border: '1px solid',
                borderColor: predictionTone.border,
              }}
            />
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' }, gap: 2 }}>
        <StatCard
          eyebrow="Demografia"
          title={`${patient.sex === 'M' || patient.sex === 'Male' ? 'Masculino' : 'Feminino'} • ${patient.age} anos`}
          details={[
            `Nascimento: ${formatDate(patient.date_of_birth)}`,
            `Criado em: ${formatDate(patient.created_at)}`,
          ]}
          isDark={isDark}
        />
        <StatCard
          eyebrow="Perfil Cognitivo"
          title={`MMSE ${clinicalData?.mmse ?? '—'} • MoCA ${clinicalData?.moca ?? '—'}`}
          details={[
            `CDR: ${clinicalData?.cdr != null ? Number(clinicalData.cdr).toFixed(1) : '—'}`,
            `CDR-SB: ${clinicalData?.cdrtot != null ? Number(clinicalData.cdrtot).toFixed(1) : '—'}`,
            `Escolaridade: ${clinicalData?.education_years ?? '—'} anos`,
          ]}
          isDark={isDark}
        />
        <ContextStatCard
          eyebrow="Contexto Clínico"
          title={`${symptomCount} sintomas • ${comorbidityCount} comorbidades`}
          symptoms={clinicalData?.symptoms}
          comorbidities={clinicalData?.comorbidities}
          biomarkers={clinicalData?.biomarkers}
          medications={clinicalData?.medications}
          familyHistory={clinicalData?.family_history}
          isDark={isDark}
        />
        <StatCard
          eyebrow="Última Inferência"
          title={prediction ? `${prediction.classification} • confiança ${confidence}%` : 'Sem predição completa'}
          details={[
            `Risco estimado: ${riskScore}%`,
            `Data: ${prediction?.prediction_date ? formatDate(prediction.prediction_date) : '—'}`,
            `Modelo: ${getModelVersion(prediction)}`,
          ]}
          isDark={isDark}
        />
      </Box>
    </Paper>
  );
}