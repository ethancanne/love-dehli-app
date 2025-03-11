import { useMutation, useQuery } from '@tanstack/react-query';
import {
  applyAsPerformer,
  changeApplicationStatus,
  getApplicationForEvent,
  getEvent,
  getEvents,
} from '../appwrite';

export const useApplyAsPerformer = () => {
  const applyAsPerformerMutation = useMutation({
    mutationFn: applyAsPerformer,
  });

  return applyAsPerformerMutation;
};

export const useChangeApplicationStatus = () => {
  const changeApplicationStatusMutation = useMutation({
    mutationFn: changeApplicationStatus,
  });

  return changeApplicationStatusMutation;
};

export const useGetApplicationForEvent = (eventId: string) => {
  const getApplicationForEventQuery = useQuery({
    queryKey: ['application', eventId],
    queryFn: () => getApplicationForEvent(eventId),
    enabled: !!eventId,
  });
  return getApplicationForEventQuery;
};
