import React from 'react';
import { Box, Button, CircularProgress, Paper, Typography, Chip, Tooltip, useTheme } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  VerifiedUser as VerifiedIcon,
  RadioButtonUnchecked as UncheckedIcon,
  AutoGraph as RetrainIcon,
} from '@mui/icons-material';
import type { PatientResponse, ValidatedDiagnosisType } from '../../../../types';
import { useValidateDiagnosis } from '../../react-queries/useValidateDiagnosis';
import { useToast } from '../../../../providers/AppProviders';
import { formatDateTime, getDiagnosisLabel } from '../../../../lib/utils/formatters';

interface DiagnosticValidationBarProps {
  patient: PatientResponse;
}

interface DiagnosisOption {
  code: 'CN' | 'MCI' | 'DEM';
  label: string;
  fullName: string;
  description: string;
  themeColor: {
    base: string;
    hoverBg: string;
    activeBg: string;
    activeText: string;
    activeBorder: string;
    glow: string;
    badgeBg: string;
    badgeText: string;
  };
}

const DIAGNOSIS_OPTIONS: DiagnosisOption[] = [
  {
    code: 'CN',
    label: 'CN',
    fullName: 'Cognitivamente Normal',
    description: 'Sem declínio cognitivo evidente, biomarcadores e testes dentro dos limites normais.',
    themeColor: {
      base: '#10b981', // emerald-500
      hoverBg: 'rgba(16, 185, 129, 0.12)',
      activeBg: '#059669', // emerald-600
      activeText: '#ffffff',
      activeBorder: '#10b981',
      glow: '0 0 15px rgba(16, 185, 129, 0.35)',
      badgeBg: 'rgba(16, 185, 129, 0.18)',
      badgeText: '#34d399',
    },
  },
  {
    code: 'MCI',
    label: 'MCI',
    fullName: 'Comprometimento Leve',
    description: 'Comprometimento cognitivo leve perceptível em testes (MMSE/MoCA), sem perda total de autonomia.',
    themeColor: {
      base: '#f59e0b', // amber-500
      hoverBg: 'rgba(245, 158, 11, 0.12)',
      activeBg: '#d97706', // amber-600
      activeText: '#ffffff',
      activeBorder: '#f59e0b',
      glow: '0 0 15px rgba(245, 158, 11, 0.35)',
      badgeBg: 'rgba(245, 158, 11, 0.18)',
      badgeText: '#fbbf24',
    },
  },
  {
    code: 'DEM',
    label: 'DEM',
    fullName: 'Demência / Alzheimer',
    description: 'Quadro clínico e neuroimagem compatíveis com Doença de Alzheimer ou síndrome demencial.',
    themeColor: {
      base: '#e11d48', // rose-600
      hoverBg: 'rgba(225, 29, 72, 0.12)',
      activeBg: '#be123c', // rose-700
      activeText: '#ffffff',
      activeBorder: '#f43f5e',
      glow: '0 0 15px rgba(225, 29, 72, 0.35)',
      badgeBg: 'rgba(225, 29, 72, 0.18)',
      badgeText: '#fb7185',
    },
  },
];

export default function DiagnosticValidationBar({ patient }: DiagnosticValidationBarProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { showToast } = useToast();
  const { mutateAsync: validate, isPending } = useValidateDiagnosis(patient.id);

  const currentValidated = patient.validated_diagnosis?.toUpperCase();
  // Map AD to DEM for visual equivalence if needed
  const normalizedCurrent = currentValidated === 'AD' ? 'DEM' : currentValidated;

  const handleValidate = async (diagnosis: 'CN' | 'MCI' | 'DEM') => {
    if (isPending) return;

    try {
      await validate({ diagnosis });
      showToast(`Diagnóstico validado como [${diagnosis}] e registrado no dataset de re-treinamento!`, 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao validar diagnóstico';
      showToast(message, 'error');
    }
  };

  const activeOption = DIAGNOSIS_OPTIONS.find((opt) => opt.code === normalizedCurrent);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: { xs: 2, md: 2.5 },
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', lg: 'center' },
        gap: 2.5,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: activeOption
          ? activeOption.themeColor.activeBorder
          : isDark
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.08)',
        background: isDark
          ? 'linear-gradient(135deg, rgba(17, 26, 46, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
        boxShadow: activeOption ? (isDark ? activeOption.themeColor.glow : '0 4px 20px rgba(0,0,0,0.05)') : 'none',
        transition: 'all 0.3s ease-in-out',
      }}
      id="diagnostic-validation-bar"
    >
      {/* Left Title & Info */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: activeOption
              ? isDark
                ? activeOption.themeColor.badgeBg
                : activeOption.themeColor.hoverBg
              : isDark
              ? 'rgba(2, 132, 199, 0.15)'
              : 'rgba(2, 132, 199, 0.08)',
            color: activeOption ? activeOption.themeColor.base : 'primary.main',
            border: '1px solid',
            borderColor: activeOption
              ? activeOption.themeColor.activeBorder
              : isDark
              ? 'rgba(2, 132, 199, 0.3)'
              : 'rgba(2, 132, 199, 0.2)',
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          {activeOption ? <VerifiedIcon fontSize="medium" /> : <RetrainIcon fontSize="medium" />}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'text.primary',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
              }}
            >
              Validar diagnóstico do paciente como:
            </Typography>

            {patient.validated_diagnosis && (
              <Chip
                icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                label={
                  patient.validated_at
                    ? `Confirmado em: ${formatDateTime(patient.validated_at)}`
                    : `Confirmado: ${getDiagnosisLabel(patient.validated_diagnosis)}`
                }
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '11px',
                  bgcolor: activeOption ? activeOption.themeColor.badgeBg : 'rgba(2, 132, 199, 0.15)',
                  color: activeOption ? (isDark ? activeOption.themeColor.badgeText : activeOption.themeColor.base) : 'primary.main',
                  border: '1px solid',
                  borderColor: activeOption ? activeOption.themeColor.activeBorder : 'primary.light',
                  '& .MuiChip-icon': {
                    color: 'inherit',
                  },
                }}
              />
            )}
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.8125rem',
              lineHeight: 1.4,
            }}
          >
            Confirmação pelo especialista para <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>ground-truth</Box> e re-treinamento contínuo do modelo de IA.
          </Typography>
        </Box>
      </Box>

      {/* 3 Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.25,
          alignItems: 'center',
          justifyContent: { xs: 'stretch', sm: 'flex-start', lg: 'flex-end' },
        }}
      >
        {DIAGNOSIS_OPTIONS.map((option) => {
          const isSelected = normalizedCurrent === option.code;

          return (
            <Tooltip key={option.code} title={option.description} arrow placement="top">
              <Button
                variant={isSelected ? 'contained' : 'outlined'}
                onClick={() => handleValidate(option.code)}
                disabled={isPending}
                id={`btn-validate-${option.code.toLowerCase()}`}
                sx={{
                  flex: { xs: 1, sm: 'none' },
                  minWidth: { xs: 90, sm: 110 },
                  height: 42,
                  borderRadius: 2,
                  px: 2,
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  ...(isSelected
                    ? {
                        bgcolor: option.themeColor.activeBg,
                        color: option.themeColor.activeText,
                        borderColor: option.themeColor.activeBorder,
                        boxShadow: `0 2px 10px ${option.themeColor.base}40`,
                        '&:hover': {
                          bgcolor: option.themeColor.activeBg,
                          filter: 'brightness(1.1)',
                        },
                      }
                    : {
                        color: isDark ? '#f1f5f9' : 'text.primary',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.15)',
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                        '&:hover': {
                          bgcolor: option.themeColor.hoverBg,
                          borderColor: option.themeColor.base,
                          color: option.themeColor.base,
                          transform: 'translateY(-1px)',
                        },
                      }),
                }}
              >
                {isPending && isSelected ? (
                  <CircularProgress size={16} color="inherit" />
                ) : isSelected ? (
                  <CheckCircleIcon sx={{ fontSize: 18 }} />
                ) : (
                  <UncheckedIcon sx={{ fontSize: 18, opacity: 0.6 }} />
                )}

                <Box component="span" sx={{ letterSpacing: '0.02em' }}>
                  {option.label}
                </Box>
              </Button>
            </Tooltip>
          );
        })}
      </Box>
    </Paper>
  );
}
