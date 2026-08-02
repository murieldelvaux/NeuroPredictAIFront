import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MRIFileMetadata } from '@/src/types';
import { getPatientsQueryKey } from '../../dashboard/react-queries/useGetPatients';
import { updatePatientMri } from '../requests/updatePatientMri';
import { getPatientQueryKey } from './useGetPatient';

type UpdatePatientMriVariables = {
  patientId: string;
  mriFile: File;
};

export const useUpdatePatientMri = () => {
  const queryClient = useQueryClient();

  return useMutation<MRIFileMetadata, Error, UpdatePatientMriVariables>({
    mutationFn: ({ patientId, mriFile }) => updatePatientMri(patientId, mriFile),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: [getPatientsQueryKey] });
      await queryClient.invalidateQueries({ queryKey: [getPatientQueryKey, variables.patientId] });
    },
  });
};