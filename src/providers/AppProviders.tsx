import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Alert, CssBaseline, IconButton, ThemeProvider, createTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query/react-query';

type ToastSeverity = 'success' | 'info' | 'error';

type ToastState = {
  text: string;
  severity: ToastSeverity;
} | null;

type AppThemeContextValue = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

type ToastContextValue = {
  toast: ToastState;
  showToast: (text: string, severity?: ToastSeverity) => void;
  clearToast: () => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);
const ToastContext = createContext<ToastContextValue | null>(null);

export function useAppThemeMode() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error('useAppThemeMode must be used within AppProviders');
  }

  return context;
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within AppProviders');
  }

  return context;
}

export default function AppProviders({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: { main: '#0284c7' },
          secondary: { main: '#1e293b' },
          background: {
            default: isDarkMode ? '#0a0f1d' : '#f8fafc',
            paper: isDarkMode ? '#111827' : '#ffffff',
          },
          divider: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: { borderRadius: 8 },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
                backgroundImage: 'none',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              outlined: {
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              },
            },
          },
        },
      }),
    [isDarkMode],
  );

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const showToast = (text: string, severity: ToastSeverity = 'info') => {
    setToast({ text, severity });
  };

  const clearToast = () => setToast(null);

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeContext.Provider value={{ isDarkMode, toggleTheme: () => setIsDarkMode((value) => !value) }}>
        <ToastContext.Provider value={{ toast, showToast, clearToast }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
            {toast && (
              <Alert
                severity={toast.severity}
                action={
                  <IconButton aria-label="close" color="inherit" size="small" onClick={clearToast}>
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1400, minWidth: 280, boxShadow: 6 }}
              >
                {toast.text}
              </Alert>
            )}
          </ThemeProvider>
        </ToastContext.Provider>
      </AppThemeContext.Provider>
    </QueryClientProvider>
  );
}