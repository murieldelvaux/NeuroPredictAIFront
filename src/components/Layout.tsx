import { AppBar, Avatar, Box, Button, Chip, Divider, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import { DarkMode as MoonIcon, LightMode as SunIcon, People as PatientsIcon, Timeline as PipelineIcon } from '@mui/icons-material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAppThemeMode } from '../providers/AppProviders';

const navItems = [
  { label: 'Fila de pacientes', to: '/dashboard', icon: <PatientsIcon /> },
  { label: 'Assistente de fluxo clínico', to: '/workflow', icon: <PipelineIcon /> },
];

export default function Layout() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { pathname } = useLocation();
  const { isDarkMode, toggleTheme } = useAppThemeMode();

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);
  const currentSection = pathname.startsWith('/patients/')
    ? 'Perfil do paciente'
    : pathname === '/workflow'
    ? 'Fluxo clínico de aquisição'
    : 'Fila de diagnóstico clínico';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', overflow: 'hidden' }} id="neuro-app-container">
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: isDark ? '#111a2e' : '#ffffff',
        }}
      >
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 }, minHeight: 56 }}>
          <Button component={Link} to="/dashboard" color="inherit" sx={{ textTransform: 'none', borderRadius: 2, px: 1, minWidth: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 34, height: 34, bgcolor: 'primary.main', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)' }}>
                <Box sx={{ width: 16, height: 16, border: 2, borderColor: '#ffffff', borderRadius: '50%' }} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: '-0.03em', fontSize: '1.05rem' }}>
                NeuroPredict <Box component="span" sx={{ color: 'primary.main', fontWeight: 900 }}>AI</Box>
              </Typography>
            </Box>
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2.5 } }}>
            <Box component="nav" sx={{ display: 'flex', gap: 0.75 }} id="top-nav-tabs">
              {navItems.map((item) => {
                const active = isActive(item.to);
                return (
                  <Button
                    key={item.to}
                    component={Link}
                    to={item.to}
                    variant={active ? 'contained' : 'text'}
                    color={active ? 'primary' : 'inherit'}
                    size="small"
                    startIcon={item.icon}
                    id={`nav-btn-${item.to.replace('/', '') || 'root'}`}
                    sx={{
                      borderRadius: 2,
                      fontWeight: active ? 800 : 600,
                      fontSize: '12px',
                      textTransform: 'none',
                      px: 1.75,
                      py: 0.75,
                      color: active ? '#ffffff' : isDark ? '#cbd5e1' : 'text.primary',
                      bgcolor: active ? 'primary.main' : 'transparent',
                      '&:hover': {
                        bgcolor: active ? 'primary.dark' : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

            <IconButton
              size="small"
              onClick={toggleTheme}
              color="inherit"
              id="theme-toggler-btn"
              title={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              sx={{
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {isDarkMode ? <SunIcon fontSize="small" sx={{ color: '#fbbf24' }} /> : <MoonIcon fontSize="small" />}
            </IconButton>

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', lineHeight: 1.1, color: 'text.primary' }}>
                  Dra. Sarah Mitchell
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : 'text.secondary', fontSize: '10px' }}>
                  Neurologista sênior
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  fontSize: '12px',
                  fontWeight: 800,
                  bgcolor: isDark ? '#1e293b' : '#f1f5f9',
                  color: 'text.primary',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                SM
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          height: 44,
          bgcolor: isDark ? '#0b1329' : '#0f172a',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          px: 3,
          justifyContent: 'space-between',
          flexShrink: 0,
          borderBottom: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '11px' }}>Seção atual:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.06em', color: '#38bdf8', textTransform: 'uppercase', fontSize: '11px' }}>
            {currentSection}
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Chip
            label="1. Fila Diagnóstica"
            size="small"
            sx={{
              height: 22,
              fontSize: '10px',
              fontWeight: 800,
              bgcolor: pathname === '/dashboard' ? 'primary.main' : 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
            }}
          />
          <Box sx={{ width: 10, height: '1px', bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Chip
            label="2. Perfil & IA"
            size="small"
            sx={{
              height: 22,
              fontSize: '10px',
              fontWeight: 800,
              bgcolor: pathname.startsWith('/patients/') ? 'primary.main' : 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
            }}
          />
        </Box>
      </Box>

      <Box component="main" sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}