import { Box, Chip, Paper, Typography } from '@mui/material';
import type { PatientLastPrediction, PatientResponse, PredictionResponse } from '../../../../types';

type PredictionLike = PredictionResponse | PatientLastPrediction | null;

type PatientSummaryPanelProps = {
  patient: PatientResponse;
  displayRecordId: string;
  prediction: PredictionLike;
  examCount: number;
};

const getPredictionTone = (classification?: string | null) => {
  switch ((classification ?? '').toUpperCase()) {
    case 'AD':
      return { color: 'error.main', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.24)' };
    case 'MCI':
      return { color: 'warning.main', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.24)' };
    default:
      return { color: 'success.main', bg: 'rgba(34, 197, 94, 0.08)', border: 'rgba(34, 197, 94, 0.24)' };
  }
};

const getModelVersion = (prediction: PredictionLike) => {
  return prediction && 'model_version' in prediction ? prediction.model_version : '—';
};

const formatListSummary = (items: string[] | null | undefined, emptyLabel: string) => {
  if (!items || items.length === 0) {
    return emptyLabel;
  }

  return items.join(', ');
};

const DetailChips = ({ items, emptyLabel }: { items: string[] | null | undefined; emptyLabel: string }) => {
  if (!items || items.length === 0) {
    return <Chip label={emptyLabel} size="small" variant="outlined" />;
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
      {items.map((item) => (
        <Chip
          key={item}
          label={item}
          size="small"
          sx={{
            fontWeight: 600,
            bgcolor: 'rgba(14, 165, 233, 0.08)',
            border: '1px solid',
            borderColor: 'rgba(14, 165, 233, 0.14)',
          }}
        />
      ))}
    </Box>
  );
};

const StatCard = ({ eyebrow, title, details }: { eyebrow: string; title: string; details: string[] }) => (
  <Box
    sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2.5,
      p: 2,
      minHeight: 132,
      backgroundImage: 'linear-gradient(180deg, rgba(248,250,252,0.72), rgba(255,255,255,0.98))',
    }}
  >
    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
      {eyebrow}
    </Typography>
    <Typography variant="subtitle1" sx={{ mt: 0.75, fontWeight: 800 }}>
      {title}
    </Typography>
    <Box sx={{ mt: 1.25, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      {details.map((detail) => (
        <Typography key={detail} variant="body2" color="text.secondary">
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
}: {
  eyebrow: string;
  title: string;
  symptoms: string[] | null | undefined;
  comorbidities: string[] | null | undefined;
  biomarkers: string[] | null | undefined;
  medications: string[] | null | undefined;
  familyHistory: boolean | null | undefined;
}) => (
  <Box
    sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2.5,
      p: 2,
      minHeight: 132,
      backgroundImage: 'linear-gradient(180deg, rgba(248,250,252,0.72), rgba(255,255,255,0.98))',
    }}
  >
    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
      {eyebrow}
    </Typography>
    <Typography variant="subtitle1" sx={{ mt: 0.75, fontWeight: 800 }}>
      {title}
    </Typography>
    <Box sx={{ mt: 1.25, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75, fontWeight: 700 }}>
          Sintomas
        </Typography>
        <DetailChips items={symptoms} emptyLabel="não informados" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75, fontWeight: 700 }}>
          Comorbidades
        </Typography>
        <DetailChips items={comorbidities} emptyLabel="não informadas" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75, fontWeight: 700 }}>
          Biomarcadores e fatores
        </Typography>
        <DetailChips items={biomarkers} emptyLabel="não informados" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75, fontWeight: 700 }}>
          Medicações em uso
        </Typography>
        <DetailChips items={medications} emptyLabel="não informadas" />
      </Box>
      <Typography variant="body2" color="text.secondary">
        História familiar: {familyHistory ? 'sim' : 'não'}
      </Typography>
    </Box>
  </Box>
);

export default function PatientSummaryPanel({ patient, displayRecordId, prediction, examCount }: PatientSummaryPanelProps) {
  const clinicalData = patient.clinical_data;
  const riskScore = Math.round(((prediction?.risk_score ?? 0) * 100));
  const confidence = Math.round(((('confidence' in (prediction ?? {}) ? prediction?.confidence : 0) ?? 0) * 100));
  const predictionTone = getPredictionTone(prediction?.classification);
  const symptomCount = clinicalData?.symptoms.length ?? 0;
  const comorbidityCount = clinicalData?.comorbidities.length ?? 0;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, p: { xs: 2.25, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>{patient.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
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
          title={`${patient.sex} • ${patient.age} anos`}
          details={[
            `Nascimento: ${patient.date_of_birth ?? '—'}`,
            `Criado em: ${patient.created_at ? new Date(patient.created_at).toLocaleDateString('pt-BR') : '—'}`,
          ]}
        />
        <StatCard
          eyebrow="Perfil Cognitivo"
          title={`MMSE ${clinicalData?.mmse ?? '—'} • MoCA ${clinicalData?.moca ?? '—'}`}
          details={[
            `CDR: ${clinicalData?.cdr ?? '—'}`,
            `CDR-SB: ${clinicalData?.cdrtot ?? '—'}`,
            `Escolaridade: ${clinicalData?.education_years ?? '—'} anos`,
          ]}
        />
        <ContextStatCard
          eyebrow="Contexto Clínico"
          title={`${symptomCount} sintomas • ${comorbidityCount} comorbidades`}
          symptoms={clinicalData?.symptoms}
          comorbidities={clinicalData?.comorbidities}
          biomarkers={clinicalData?.biomarkers}
          medications={clinicalData?.medications}
          familyHistory={clinicalData?.family_history}
        />
        <StatCard
          eyebrow="Última Inferência"
          title={prediction ? `${prediction.classification} • confiança ${confidence}%` : 'Sem predição completa'}
          details={[
            `Risco estimado: ${riskScore}%`,
            `Data: ${prediction?.prediction_date ? new Date(prediction.prediction_date).toLocaleDateString('pt-BR') : '—'}`,
            `Modelo: ${getModelVersion(prediction)}`,
          ]}
        />
      </Box>
    </Paper>
  );
}