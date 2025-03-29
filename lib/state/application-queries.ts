import { useMutation, useQuery } from '@tanstack/react-query';
import {
  applyAsPerformer,
  changeApplicationStatus,
  getApplicationForEvent,
} from '../appwrite';
import { queryClientContext } from '@/app/_layout';

const queryClient = queryClientContext;

export const useApplyAsPerformer = () => {
  const applyAsPerformerMutation = useMutation({
    mutationFn: applyAsPerformer,
    onSuccess: () => {
      //Invalidate query
      queryClient.invalidateQueries();
    },
  });

  return applyAsPerformerMutation;
};

export const useChangeApplicationStatus = () => {
  const changeApplicationStatusMutation = useMutation({
    mutationFn: changeApplicationStatus,
    onSuccess: () => {
      //Invalidate query
      queryClient.invalidateQueries();
    },
  });

  return changeApplicationStatusMutation;
};

export const useGetApplicationForEvent = (
  eventId: string,
  performerProfileId: string
) => {
  const getApplicationForEventQuery = useQuery({
    queryKey: ['application', eventId, performerProfileId],
    queryFn: () => getApplicationForEvent(eventId, performerProfileId),
    enabled: !!eventId && !!performerProfileId,
  });
  return getApplicationForEventQuery;
};
