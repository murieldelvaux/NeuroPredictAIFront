/**
 * NeuroPredict AI - Clinical Core Layout Frame styled with Material-UI
 */
import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  Divider, 
  Avatar, 
  Chip,
  Container,
  Paper,
  useTheme
} from '@mui/material';
import { 
  LightMode as SunIcon, 
  DarkMode as MoonIcon,
  People as PatientsIcon,
  Timeline as PipelineIcon,
  AssignmentTurnedIn as AnalysisIcon,
  Terminal as ConsoleIcon,
  Timer as LatencyIcon
} from '@mui/icons-material';
import { LayoutProps } from '../types/components';

export default function Layout({ 
  children, 
  activeView, 
  onNavigate, 
  selectedPatientName,
  isDarkMode,
  onToggleTheme
}: LayoutProps) {
  const theme = useTheme();
  const currentTime = "2026-06-16 18:22:31";

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: 'screen', 
        height: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: 'background-color 0.2s, color 0.2s',
        overflow: 'hidden'
      }}
      id="neuro-app-container"
    >
      {/* Top Clinical Header Bar */}
      <AppBar 
        position="static" 
        color="inherit" 
        elevation={0}
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: theme.palette.mode === 'light' ? '#ffffff' : '#1e293b'
        }}
        id="global-hospital-header"
      >
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
          {/* Logo Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box 
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: 'primary.main', 
                borderRadius: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Box sx={{ width: 16, height: 16, border: 2, borderColor: '#ffffff', borderRadius: '50%' }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 850, letterSpacing: '-0.02em' }}>
              NeuroPredict <Box component="span" sx={{ color: 'primary.main', fontWeight: 900 }}>AI</Box>
            </Typography>
          </Box>
          
          {/* Nav Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
            <Box component="nav" sx={{ display: 'flex', gap: 0.5 }} id="top-nav-tabs">
              <Button 
                variant={activeView === 'dashboard' ? 'contained' : 'text'}
                color={activeView === 'dashboard' ? 'primary' : 'inherit'}
                onClick={() => onNavigate('dashboard')}
                size="small"
                startIcon={<PatientsIcon />}
                id="nav-btn-dashboard"
                sx={{ 
                  borderRadius: 2, 
                  fontWeight: activeView === 'dashboard' ? 'bold' : 'medium',
                  textTransform: 'none'
                }}
              >
                Patients Queue
              </Button>
              <Button 
                variant={activeView === 'workflow' ? 'contained' : 'text'}
                color={activeView === 'workflow' ? 'primary' : 'inherit'}
                onClick={() => onNavigate('workflow')}
                size="small"
                startIcon={<PipelineIcon />}
                id="nav-btn-workflow"
                sx={{ 
                  borderRadius: 2, 
                  fontWeight: activeView === 'workflow' ? 'bold' : 'medium',
                  textTransform: 'none'
                }}
              >
                Clinical Pipeline Wizard
              </Button>
              <Button 
                variant={activeView === 'profile' ? 'contained' : 'text'}
                color={activeView === 'profile' ? 'primary' : 'inherit'}
                onClick={() => onNavigate('profile')}
                size="small"
                startIcon={<AnalysisIcon />}
                id="nav-btn-profile"
                sx={{ 
                  borderRadius: 2, 
                  fontWeight: activeView === 'profile' ? 'bold' : 'medium',
                  textTransform: 'none'
                }}
              >
                Patient Analysis
              </Button>
            </Box>
            
            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />
            
            {/* Theme Toggle Button */}
            <IconButton 
              size="small" 
              onClick={onToggleTheme} 
              color="inherit"
              id="theme-toggler-btn"
              title={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              {isDarkMode ? <SunIcon fontSize="small" sx={{ color: 'amber.main' }} /> : <MoonIcon fontSize="small" />}
            </IconButton>

            {/* Clinician Profile Badge */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }} id="clinician-badge">
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', lineHeight: 1 }}>
                  Dr. Sarah Mitchell
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '9px' }}>
                  Senior Neurologist
                </Typography>
              </Box>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  fontSize: '11px', 
                  fontWeight: 'bold', 
                  bgcolor: theme.palette.mode === 'light' ? '#f1f5f9' : '#334155', 
                  color: 'text.primary',
                  border: 1,
                  borderColor: 'divider'
                }}
              >
                SM
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sub-Header: Active Cohort Information and Process Stepper */}
      <Box 
        sx={{ 
          height: 48, 
          bgcolor: theme.palette.mode === 'light' ? '#1e293b' : '#0f172a', 
          color: '#ffffff', 
          display: 'flex', 
          alignItems: 'center', 
          px: 3, 
          justifyContent: 'space-between',
          flexShrink: 0
        }}
        id="sub-header-workflow-banner"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>Active Patient:</Typography>
          <Typography 
            variant="caption" 
            sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'primary.light', textTransform: 'uppercase' }}
            id="selected-patient-badge-indicator"
          >
            {selectedPatientName || 'NONE SELECTED - CHOOSE FROM QUEUE'}
          </Typography>
        </Box>
        
        {/* Horizontal Pipeline Steps */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }} id="stepper-horizontal-gauge">
          <Chip 
            label="1. Clinical Data" 
            size="small" 
            sx={{ 
              height: 20,
              fontSize: '10px',
              fontWeight: 'bold',
              bgcolor: activeView === 'workflow' ? 'primary.main' : 'rgba(2, 132, 199, 0.15)',
              color: activeView === 'workflow' ? '#ffffff' : 'primary.light',
              border: 1,
              borderColor: activeView === 'workflow' ? 'primary.main' : 'rgba(2, 132, 199, 0.3)'
            }}
          />
          <Box sx={{ width: 12, height: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Chip 
            label="2. Cognitive Profile" 
            size="small" 
            sx={{ 
              height: 20,
              fontSize: '10px',
              fontWeight: 'bold',
              bgcolor: activeView === 'profile' ? 'primary.main' : 'rgba(2, 132, 199, 0.15)',
              color: activeView === 'profile' ? '#ffffff' : 'primary.light',
              border: 1,
              borderColor: activeView === 'profile' ? 'primary.main' : 'rgba(2, 132, 199, 0.3)'
            }}
          />
          <Box sx={{ width: 12, height: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Chip 
            label="3. Imaging Metrics" 
            size="small" 
            sx={{ 
              height: 20,
              fontSize: '10px',
              fontWeight: 'bold',
              bgcolor: activeView === 'profile' ? 'primary.main' : 'rgba(2, 132, 199, 0.15)',
              color: activeView === 'profile' ? '#ffffff' : 'primary.light',
              border: 1,
              borderColor: activeView === 'profile' ? 'primary.main' : 'rgba(2, 132, 199, 0.3)'
            }}
          />
          <Box sx={{ width: 12, height: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Chip 
            label="4. AI Predictor" 
            size="small" 
            sx={{ 
              height: 20,
              fontSize: '10px',
              fontWeight: 'bold',
              bgcolor: activeView === 'profile' ? 'primary.main' : 'rgba(2, 132, 199, 0.15)',
              color: activeView === 'profile' ? '#ffffff' : 'primary.light',
              border: 1,
              borderColor: activeView === 'profile' ? 'primary.main' : 'rgba(2, 132, 199, 0.3)'
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline' } }}>Pipeline Status:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'emerald.main' }}>
            <Box 
              sx={{ 
                width: 6, 
                height: 6, 
                bgcolor: '#10b981', 
                borderRadius: '50%',
                animation: 'pulse 2s infinite' 
              }} 
            />
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#34d399', fontSize: '9px', tracking: '0.05em' }}>
              MONAI & PYTORCH ACTIVE
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main clinical canvas stage */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          p: { xs: 2, md: 3 },
          bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : '#0b1329'
        }}
        id="clinical-main-stage"
      >
        <Container maxWidth="lg" disableGutters sx={{ height: '100%' }}>
          {children}
        </Container>
      </Box>

      {/* Bottom Status Footer */}
      <Paper 
        component="footer" 
        square 
        variant="outlined"
        sx={{ 
          height: 32, 
          borderLeft: 0, 
          borderRight: 0, 
          borderBottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          px: 2,
          flexShrink: 0,
          bgcolor: 'background.paper'
        }}
        id="system-status-footer"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Box sx={{ width: 6, height: 6, bgcolor: '#10b981', borderRadius: '50%' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>
              System Online: GPU_NODE_01
            </Typography>
          </Box>
          <Divider orientation="vertical" variant="middle" flexItem sx={{ height: 12, my: 'auto' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <LatencyIcon sx={{ fontSize: 10 }} />
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '9px' }}>
              API_LATENCY: 142ms
            </Typography>
          </Box>
          <Divider orientation="vertical" variant="middle" flexItem sx={{ height: 12, my: 'auto', display: { xs: 'none', sm: 'block' } }} />
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <ConsoleIcon sx={{ fontSize: 10 }} />
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '9px' }}>
              UTC: {currentTime}
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '9px' }}>
          NEUROPREDICT_AI CORE v2.4.0-STABLE
        </Typography>
      </Paper>
    </Box>
  );
}
