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

const THEME_STORAGE_KEY = 'neuropredict_theme_mode';

export default function AppProviders({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore in environments where localStorage is restricted
    }
  }, [isDarkMode]);


  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#0284c7',
            light: '#38bdf8',
            dark: '#0369a1',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#64748b',
            light: '#94a3b8',
            dark: '#334155',
          },
          success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
          },
          warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
          },
          error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
          },
          text: {
            primary: isDarkMode ? '#f8fafc' : '#0f172a',
            secondary: isDarkMode ? '#94a3b8' : '#475569',
          },
          background: {
            default: isDarkMode ? '#090e1a' : '#f8fafc',
            paper: isDarkMode ? '#111a2e' : '#ffffff',
          },
          divider: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: { borderRadius: 10 },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
                backgroundImage: 'none',
                backgroundColor: isDarkMode ? '#111a2e' : '#ffffff',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
              outlined: {
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                backgroundColor: isDarkMode ? '#111a2e' : '#ffffff',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
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