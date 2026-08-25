/**
 * Utility functions for medical data formatting and UI display.
 */

export function capitalizeName(name?: string | null): string {
  if (!name) return '—';
  const lowerPrepositions = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);
  
  return name
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && lowerPrepositions.has(lower)) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  
  // If already in DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return dateStr;
  }
  
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function getDiagnosisLabel(code?: string | null): string {
  switch ((code ?? '').toUpperCase()) {
    case 'CN':
      return 'Cognitivamente Normal';
    case 'MCI':
      return 'Comprometimento Cognitivo Leve';
    case 'DEM':
    case 'AD':
      return 'Demência / Alzheimer';
    default:
      return code || 'Não validado';
  }
}
