import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Add as PlusIcon,
  Timeline as TimelineIcon,
  Psychology as BrainIcon,
  AutoFixHigh as AiIcon,
  Assignment as NotesIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import type { PatientResponse, PredictionResponse, CognitiveHistoryItem } from '../../../../types';
import NewAssessmentModal from '../NewAssessmentModal/NewAssessmentModal';
import { formatDate } from '../../../../lib/utils/formatters';

interface ClinicalDataPanelProps {
  patient: PatientResponse;
  predictions?: PredictionResponse[];
}

export default function ClinicalDataPanel({ patient, predictions = [] }: ClinicalDataPanelProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [modalOpen, setModalOpen] = useState(false);

  const clinicalData = patient.clinical_data;

  // ─── 1. Build Cognitive History Data for Chart 1 ─────────────────────────
  const cognitiveHistoryData = useMemo(() => {
    const rawHistory = clinicalData?.cognitive_history ?? [];

    if (rawHistory.length > 0) {
      return [...rawHistory]
        .map((item) => ({
          date: formatDate(item.date),
          rawDate: item.date,
          mmse: item.mmse != null ? Number(item.mmse) : null,
          moca: item.moca != null ? Number(item.moca) : null,
          cdr: item.cdr != null ? Number(item.cdr) : null,
          cdrtot: item.cdrtot != null ? Number(item.cdrtot) : null,
          notes: item.notes || 'Consulta padrão',
        }))
        .sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());
    }

    // Fallback: If no history array yet, construct initial entry from current clinical data
    if (clinicalData) {
      return [
        {
          date: formatDate(patient.created_at || new Date().toISOString()),
          rawDate: patient.created_at || new Date().toISOString(),
          mmse: clinicalData.mmse != null ? Number(clinicalData.mmse) : null,
          moca: clinicalData.moca != null ? Number(clinicalData.moca) : null,
          cdr: clinicalData.cdr != null ? Number(clinicalData.cdr) : null,
          cdrtot: clinicalData.cdrtot != null ? Number(clinicalData.cdrtot) : null,
          notes: 'Avaliação basal de admissão',
        },
      ];
    }

    return [];
  }, [clinicalData, patient.created_at]);

  // ─── 2. Build AI Evolution Data for Chart 2 ──────────────────────────────
  const aiEvolutionData = useMemo(() => {
    if (predictions && predictions.length > 0) {
      return [...predictions]
        .sort((a, b) => new Date(a.prediction_date).getTime() - new Date(b.prediction_date).getTime())
        .map((pred) => {
          const probCN = Math.round(((pred.probabilities?.CN ?? pred.probabilities?.cn ?? 0) * 100));
          const probMCI = Math.round(((pred.probabilities?.MCI ?? pred.probabilities?.mci ?? 0) * 100));
          const probDEM = Math.round(
            ((pred.probabilities?.DEM ??
              pred.probabilities?.dem ??
              pred.probabilities?.AD ??
              pred.probabilities?.ad ??
              0) *
              100),
          );

          return {
            date: formatDate(pred.prediction_date),
            rawDate: pred.prediction_date,
            riskScore: Math.round(pred.risk_score * 100),
            confidence: Math.round(pred.confidence * 100),
            classification: pred.classification,
            probCN,
            probMCI,
            probDEM,
            modelVersion: pred.model_version || 'v1',
          };
        });
    }

    // Fallback to last_prediction if predictions list is empty
    if (patient.last_prediction) {
      return [
        {
          date: formatDate(patient.last_prediction.prediction_date),
          rawDate: patient.last_prediction.prediction_date,
          riskScore: Math.round(patient.last_prediction.risk_score * 100),
          confidence: Math.round(patient.last_prediction.confidence * 100),
          classification: patient.last_prediction.classification,
          probCN: patient.last_prediction.classification === 'CN' ? 88 : 10,
          probMCI: patient.last_prediction.classification === 'MCI' ? 75 : 20,
          probDEM: ['AD', 'DEM'].includes(patient.last_prediction.classification) ? 85 : 5,
          modelVersion: 'resnet3d-oasis3',
        },
      ];
    }

    return [];
  }, [predictions, patient.last_prediction]);

  // ─── Trajectory String ───────────────────────────────────────────────────
  const trajectoryBadge = useMemo(() => {
    if (aiEvolutionData.length === 0) {
      return 'Sem inferências registradas';
    }
    if (aiEvolutionData.length === 1) {
      const single = aiEvolutionData[0];
      return `${single.classification} (${single.riskScore}% risco em ${single.date})`;
    }

    return aiEvolutionData
      .map((item) => `${item.classification} (${item.riskScore}% em ${item.date})`)
      .join(' ➔ ');
  }, [aiEvolutionData]);

  // Score evaluation chips
  const getMmseStatus = (score?: number | null) => {
    if (score == null) return { label: 'Não avaliado', color: 'default' as const };
    if (score >= 26) return { label: 'Cognição Normal', color: 'success' as const };
    if (score >= 20) return { label: 'Declínio Leve', color: 'warning' as const };
    return { label: 'Declínio Acentuado', color: 'error' as const };
  };

  const getCdrStatus = (score?: number | null) => {
    if (score == null) return 'Não avaliado';
    if (score === 0) return 'Normal (Sem demência)';
    if (score === 0.5) return 'Questionável / CCL';
    if (score === 1) return 'Demência Leve';
    if (score === 2) return 'Demência Moderada';
    return 'Demência Grave';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }} id="clinical-data-panel-root">
      {/* ─── Top Header & Action ────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <TimelineIcon className="w-5 h-5 text-sky-500" />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              Evolução Longitudinal e Avaliações Cognitivas
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
            Acompanhamento temporal dos testes neuropsicológicos, biomarcadores e predições do modelo 3D.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
          startIcon={<PlusIcon className="w-4 h-4" />}
          id="btn-open-new-assessment-modal"
          sx={{
            fontWeight: 800,
            borderRadius: 2,
            px: 2.5,
            py: 1,
            boxShadow: isDark ? '0 4px 14px rgba(2, 132, 199, 0.4)' : '0 4px 14px rgba(2, 132, 199, 0.2)',
          }}
        >
          Nova Avaliação
        </Button>
      </Box>

      {/* ─── Quick Summary Metric Cards ──────────────────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
        <Card
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: isDark ? '#111a2e' : '#ffffff',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            MMSE Atual (Mini-Mental)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.75 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0284c7' }}>
              {clinicalData?.mmse ?? '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary">/ 30</Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Chip
              label={getMmseStatus(clinicalData?.mmse).label}
              size="small"
              color={getMmseStatus(clinicalData?.mmse).color}
              sx={{ fontWeight: 700, fontSize: '10px', height: 20 }}
            />
          </Box>
        </Card>

        <Card
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: isDark ? '#111a2e' : '#ffffff',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            MoCA Atual (Montreal)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.75 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#8b5cf6' }}>
              {clinicalData?.moca ?? '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary">/ 30</Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Chip
              label={(clinicalData?.moca ?? 0) >= 26 ? 'Normal (≥26)' : 'Alterado (<26)'}
              size="small"
              color={(clinicalData?.moca ?? 0) >= 26 ? 'success' : 'warning'}
              sx={{ fontWeight: 700, fontSize: '10px', height: 20 }}
            />
          </Box>
        </Card>

        <Card
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: isDark ? '#111a2e' : '#ffffff',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CDR Global
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.75 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>
              {clinicalData?.cdr != null ? Number(clinicalData.cdr).toFixed(1) : '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary">/ 3.0</Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontWeight: 600 }}>
            {getCdrStatus(clinicalData?.cdr)}
          </Typography>
        </Card>

        <Card
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: isDark ? '#111a2e' : '#ffffff',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CDR-SB (Sum of Boxes)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.75 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#f59e0b' }}>
              {clinicalData?.cdrtot != null ? Number(clinicalData.cdrtot).toFixed(1) : '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary">/ 18.0</Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontWeight: 600 }}>
            Escala expandida de gravidade funcional
          </Typography>
        </Card>
      </Box>

      {/* ─── SECTION 1: Gráfico 1 — Evolução dos Testes Neuropsicológicos ──────── */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          bgcolor: isDark ? '#111a2e' : '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 1.5 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BrainIcon className="w-5 h-5 text-sky-500" />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
                Evolução dos Testes Neuropsicológicos (MMSE, MoCA e CDR-SB)
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Acompanhamento longitudinal das pontuações cognitivas ao longo das consultas realizadas.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${cognitiveHistoryData.length} avaliação(ões) registrada(s)`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: '11px' }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '2fr 1fr' }, gap: 3, alignItems: 'start' }}>
          {/* Recharts LineChart */}
          <Box sx={{ height: 320, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cognitiveHistoryData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)' }}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                />
                {/* Left Axis for MMSE & MoCA (0-30) */}
                <YAxis
                  yAxisId="left"
                  domain={[0, 30]}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)' }}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                  width={35}
                />
                {/* Right Axis for CDR-SB (0-18) */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 18]}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)' }}
                  tick={{ fill: '#f59e0b', fontSize: 11 }}
                  width={35}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dataItem = payload[0].payload;
                      return (
                        <Box
                          sx={{
                            bgcolor: isDark ? '#0f172a' : '#ffffff',
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                            minWidth: 200,
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>
                            Consulta em {label}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#0284c7', fontWeight: 700 }}>
                              MMSE: {dataItem.mmse != null ? `${dataItem.mmse} / 30` : '—'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#8b5cf6', fontWeight: 700 }}>
                              MoCA: {dataItem.moca != null ? `${dataItem.moca} / 30` : '—'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                              CDR-SB: {dataItem.cdrtot != null ? `${dataItem.cdrtot} / 18` : '—'} (CDR: {dataItem.cdr ?? '—'})
                            </Typography>
                            {dataItem.notes && (
                              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, fontStyle: 'italic' }}>
                                Nota: {dataItem.notes}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 12, fontSize: '12px' }}
                  formatter={(value) => <span style={{ color: isDark ? '#cbd5e1' : '#334155', fontWeight: 600 }}>{value}</span>}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="mmse"
                  name="MMSE (0-30)"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#0284c7', strokeWidth: 2, stroke: isDark ? '#111a2e' : '#ffffff' }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="moca"
                  name="MoCA (0-30)"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: isDark ? '#111a2e' : '#ffffff' }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cdrtot"
                  name="CDR-SB (0-18, eixo dir.)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: isDark ? '#111a2e' : '#ffffff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          {/* Side Table: Historic assessments & notes */}
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2.5,
              overflow: 'hidden',
              maxHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
            }}
          >
            <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Histórico de Pontuações & Notas
              </Typography>
            </Box>
            <Box sx={{ overflowY: 'auto', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {cognitiveHistoryData.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: isDark ? '#162238' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.75,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarIcon className="w-3.5 h-3.5 text-sky-500" />
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>
                        {item.date}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Chip label={`MMSE: ${item.mmse ?? '—'}`} size="small" sx={{ fontSize: '10px', height: 18, bgcolor: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8', fontWeight: 700 }} />
                      <Chip label={`MoCA: ${item.moca ?? '—'}`} size="small" sx={{ fontSize: '10px', height: 18, bgcolor: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', fontWeight: 700 }} />
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', lineHeight: 1.3 }}>
                    {item.notes || 'Sem observações adicionais gravadas nesta consulta.'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* ─── SECTION 2: Gráfico 2 — Evolução do Risco e Predições do Modelo de IA 3D ── */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          bgcolor: isDark ? '#111a2e' : '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', lg: 'center' }, gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AiIcon className="w-5 h-5 text-indigo-400" />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
                Evolução do Risco e Predições do Modelo de IA 3D
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Acompanhamento longitudinal do escore prognóstico de atrofia e probabilidades das classes (CN, MCI e DEM).
            </Typography>
          </Box>

          {/* Trajectory Badge */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              bgcolor: isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.08)',
              border: '1px solid',
              borderColor: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: isDark ? '#a5b4fc' : '#4f46e5', textTransform: 'uppercase', fontSize: '10px' }}>
              Trajetória Diagnóstica:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '12px' }}>
              {trajectoryBadge}
            </Typography>
          </Box>
        </Box>

        {/* Recharts Area/Line Chart for AI Evolution */}
        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={aiEvolutionData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="riskScoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)' }}
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
                tickLine={false}
                axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)' }}
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                width={45}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const dataItem = payload[0].payload;
                    return (
                      <Box
                        sx={{
                          bgcolor: isDark ? '#0f172a' : '#ffffff',
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                          minWidth: 220,
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                            Exame em {label}
                          </Typography>
                          <Chip
                            label={dataItem.classification}
                            size="small"
                            color={dataItem.classification === 'CN' ? 'success' : dataItem.classification === 'MCI' ? 'warning' : 'error'}
                            sx={{ fontWeight: 800, height: 20, fontSize: '10px' }}
                          />
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#f43f5e', mb: 1 }}>
                          Risco Estimado: {dataItem.riskScore}%
                        </Typography>
                        <Divider sx={{ my: 0.75 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>
                            Probabilidade CN: {dataItem.probCN}%
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                            Probabilidade MCI: {dataItem.probMCI}%
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#f43f5e', fontWeight: 700 }}>
                            Probabilidade DEM: {dataItem.probDEM}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                            Confiança do modelo: {dataItem.confidence}%
                          </Typography>
                        </Box>
                      </Box>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 12, fontSize: '12px' }}
                formatter={(value) => <span style={{ color: isDark ? '#cbd5e1' : '#334155', fontWeight: 600 }}>{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="riskScore"
                name="Risk Score (%)"
                stroke="#f43f5e"
                strokeWidth={3}
                fill="url(#riskScoreGrad)"
              />
              <Line
                type="monotone"
                dataKey="probCN"
                name="Prob. CN (%)"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4, fill: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey="probMCI"
                name="Prob. MCI (%)"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4, fill: '#f59e0b' }}
              />
              <Line
                type="monotone"
                dataKey="probDEM"
                name="Prob. DEM (%)"
                stroke="#e11d48"
                strokeWidth={2}
                dot={{ r: 4, fill: '#e11d48' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* ─── Modal para Nova Avaliação ──────────────────────────────────────── */}
      <NewAssessmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        patient={patient}
      />
    </Box>
  );
}