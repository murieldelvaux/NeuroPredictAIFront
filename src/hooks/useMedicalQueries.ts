/**
 * Re-exports das queries/mutations de pacientes.
 * Mantido por compatibilidade com imports existentes nos componentes.
 * Prefira importar diretamente de features/patients/react-queries/.
 */
export { useGetPatients as usePatients } from '../features/dashboard/react-queries/useGetPatients';
export { useGetPatient as usePatient } from '../features/patient-profile/react-queries/useGetPatient';
export { useCreatePatient } from '../features/patients/react-queries/useCreatePatient';
