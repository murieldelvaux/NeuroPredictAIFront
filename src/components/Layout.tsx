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
  const { pathname } = useLocation();
  const { isDarkMode, toggleTheme } = useAppThemeMode();

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);
  const currentSection = pathname.startsWith('/patients/') ? 'Perfil do paciente' : pathname === '/workflow' ? 'Fluxo clínico' : 'Fila de diagnóstico';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', overflow: 'hidden' }} id="neuro-app-container">
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: theme.palette.mode === 'light' ? '#ffffff' : '#1e293b' }}>
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
          <Button component={Link} to="/dashboard" color="inherit" sx={{ textTransform: 'none', borderRadius: 2, px: 1, minWidth: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: 16, height: 16, border: 2, borderColor: '#ffffff', borderRadius: '50%' }} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 850, letterSpacing: '-0.02em' }}>
                NeuroPredict <Box component="span" sx={{ color: 'primary.main', fontWeight: 900 }}>AI</Box>
              </Typography>
            </Box>
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
            <Box component="nav" sx={{ display: 'flex', gap: 0.5 }} id="top-nav-tabs">
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={Link}
                  to={item.to}
                  variant={isActive(item.to) ? 'contained' : 'text'}
                  color={isActive(item.to) ? 'primary' : 'inherit'}
                  size="small"
                  startIcon={item.icon}
                  id={`nav-btn-${item.to.replace('/', '') || 'root'}`}
                  sx={{ borderRadius: 2, fontWeight: isActive(item.to) ? 'bold' : 'medium', textTransform: 'none' }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

            <IconButton size="small" onClick={toggleTheme} color="inherit" id="theme-toggler-btn" title={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}>
              {isDarkMode ? <SunIcon fontSize="small" sx={{ color: 'amber.main' }} /> : <MoonIcon fontSize="small" />}
            </IconButton>

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', lineHeight: 1 }}>Dra. Sarah Mitchell</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '9px' }}>Neurologista sênior</Typography>
              </Box>
              <Avatar sx={{ width: 32, height: 32, fontSize: '11px', fontWeight: 'bold', bgcolor: theme.palette.mode === 'light' ? '#f1f5f9' : '#334155', color: 'text.primary', border: 1, borderColor: 'divider' }}>SM</Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: 48, bgcolor: theme.palette.mode === 'light' ? '#1e293b' : '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', px: 3, justifyContent: 'space-between', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>Seção atual:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'primary.light', textTransform: 'uppercase' }}>{currentSection}</Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Chip label="1. Dados clínicos" size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 'bold', bgcolor: pathname === '/workflow' ? 'primary.main' : 'rgba(2, 132, 199, 0.15)', color: pathname === '/workflow' ? '#ffffff' : 'primary.light' }} />
          <Box sx={{ width: 12, height: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Chip label="2. Perfil cognitivo" size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 'bold', bgcolor: pathname.startsWith('/patients/') ? 'primary.main' : 'rgba(2, 132, 199, 0.15)', color: pathname.startsWith('/patients/') ? '#ffffff' : 'primary.light' }} />
        </Box>
      </Box>

      <Box component="main" sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}