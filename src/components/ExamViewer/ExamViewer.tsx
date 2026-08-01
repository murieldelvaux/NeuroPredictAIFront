import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Alert, Button, Chip, CircularProgress, Paper, Typography } from '@mui/material';
import { CloudUpload as UploadIcon, FolderOpen as FolderIcon, Visibility as ViewerIcon } from '@mui/icons-material';
import { Niivue } from '@niivue/niivue';

type ExamFileSource = {
  type: 'file';
  file: File;
};

type ExamUrlSource = {
  type: 'url';
  urls: string[];
};

export type ExamSource = {
  id: string;
  label: string;
  description?: string;
  source: ExamFileSource | ExamUrlSource;
};

export type ExamViewerProps = {
  title?: string;
  description?: string;
  initialExams?: ExamSource[];
  allowUpload?: boolean;
  accept?: string;
  height?: number | string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
};

const createExamId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function ExamViewer({
  title = 'Visualizador de exames',
  description = 'Carregue arquivos locais ou selecione um exame previamente disponibilizado para visualização em NiiVue.',
  initialExams = [],
  allowUpload = true,
  accept = '.nii,.nii.gz,.hdr,.img',
  height = 560,
  emptyStateTitle = 'Nenhum exame carregado',
  emptyStateDescription = 'Use o botão de envio para carregar um arquivo de exame e alternar entre os exames disponíveis.',
}: ExamViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewerRef = useRef<Niivue | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [examItems, setExamItems] = useState<ExamSource[]>(initialExams);
  const [activeExamId, setActiveExamId] = useState<string | null>(initialExams[0]?.id ?? null);
  const [isViewerReady, setIsViewerReady] = useState(false);
  const [isLoadingExam, setIsLoadingExam] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const activeExam = useMemo(
    () => examItems.find((exam) => exam.id === activeExamId) ?? null,
    [activeExamId, examItems],
  );

  useEffect(() => {
    setExamItems(initialExams);
    setActiveExamId(initialExams[0]?.id ?? null);
  }, [initialExams]);

  useEffect(() => {
    if (!canvasRef.current || viewerRef.current) {
      return;
    }

    const viewer = new Niivue();
    viewerRef.current = viewer;
    viewer.attachToCanvas(canvasRef.current, true);
    setIsViewerReady(true);

    return () => {
      viewerRef.current = null;
      setIsViewerReady(false);
    };
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !activeExam) {
      return;
    }

    let cancelled = false;

    const loadExam = async () => {
      setIsLoadingExam(true);
      setLoadError(null);

      try {
        if (activeExam.source.type === 'file') {
          await viewer.loadFromFile(activeExam.source.file);
        } else {
          let lastError: unknown = null;
          for (const candidateUrl of activeExam.source.urls) {
            try {
              await viewer.loadFromUrl(candidateUrl);
              lastError = null;
              break;
            } catch (candidateError) {
              lastError = candidateError;
            }
          }

          if (lastError) {
            throw lastError;
          }
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Não foi possível abrir o exame selecionado.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingExam(false);
        }
      }
    };

    void loadExam();

    return () => {
      cancelled = true;
    };
  }, [activeExam]);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    const nextExams = selectedFiles.map((file) => ({
      id: createExamId(),
      label: file.name,
      description: `${Math.round(file.size / 1024)} KB`,
      source: { type: 'file' as const, file },
    }));

    setExamItems((currentItems) => [...currentItems, ...nextExams]);
    setActiveExamId(nextExams[nextExams.length - 1]?.id ?? null);
    event.target.value = '';
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minHeight: height,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            {description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          <Chip
            icon={<ViewerIcon />}
            label={isViewerReady ? 'NiiVue conectado' : 'Inicializando viewer'}
            size="small"
            color={isViewerReady ? 'success' : 'default'}
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label={`${examItems.length} exame(s)`}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          position: 'relative',
          minHeight: 360,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: '#050816',
          backgroundImage: 'radial-gradient(circle at top, rgba(14,165,233,0.12), transparent 45%), linear-gradient(180deg, rgba(15,23,42,0.95), rgba(2,6,23,1))',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', minHeight: 360, display: 'block' }}
        />

        {!activeExam && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 3,
              textAlign: 'center',
              bgcolor: 'rgba(2,6,23,0.7)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Box sx={{ maxWidth: 420 }}>
              <FolderIcon sx={{ color: 'primary.main', fontSize: 42, mb: 1 }} />
              <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 700 }}>
                {emptyStateTitle}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)', mt: 1 }}>
                {emptyStateDescription}
              </Typography>
            </Box>
          </Box>
        )}

        {isLoadingExam && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(2,6,23,0.45)',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <CircularProgress size={28} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>
                Carregando exame no NiiVue...
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {loadError && <Alert severity="error">{loadError}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {examItems.map((exam) => (
            <Button
              key={exam.id}
              size="small"
              variant={exam.id === activeExamId ? 'contained' : 'outlined'}
              onClick={() => setActiveExamId(exam.id)}
              startIcon={<ViewerIcon />}
              sx={{ fontWeight: 700, textTransform: 'none' }}
            >
              {exam.label}
            </Button>
          ))}
        </Box>

        {activeExam?.description && (
          <Typography variant="caption" color="text.secondary">
            Exame ativo: {activeExam.description}
          </Typography>
        )}
      </Box>

      {allowUpload && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: { xs: 'stretch', sm: 'center' } }}>
          <input ref={fileInputRef} type="file" accept={accept} multiple onChange={handleFileSelection} style={{ display: 'none' }} />
          <Button variant="contained" color="primary" startIcon={<UploadIcon />} onClick={handleUpload} sx={{ fontWeight: 700 }}>
            Carregar novos exames
          </Button>
          <Typography variant="caption" color="text.secondary">
            Envie arquivos `.nii` ou `.nii.gz` para alternar entre diferentes exames no mesmo viewer.
          </Typography>
        </Box>
      )}
    </Paper>
  );
}