import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createPerformerProfile,
  editPerformerProfile,
  getPerformerProfile,
} from '../appwrite';

export const usePerformerProfile = () => {
  const performerProfileQuery = useQuery({
    queryKey: ['performerProfile'],
    queryFn: getPerformerProfile,
  });
  return performerProfileQuery;
};

export const useCreatePerformerProfile = () => {
  const createPerformerProfileMutation = useMutation({
    mutationFn: createPerformerProfile,
  });
  return createPerformerProfileMutation;
};

export const useEditPerformerProfile = () => {
  const editPerformerProfileMutation = useMutation({
    mutationFn: editPerformerProfile,
  });
  return editPerformerProfileMutation;
};
