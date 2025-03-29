import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createPerformerProfile,
  editPerformerProfile,
  getAllPerformerProfiles,
  getCurrentPerformerProfile,
  getPerformerProfile,
} from '../appwrite';
import { queryClientContext } from '@/app/_layout';
import { useUIStore } from './ui-state';

const queryClient = queryClientContext;

export const usePerformerProfile = (id: string) => {
  const performerProfileQuery = useQuery({
    queryKey: ['performerProfile', id],
    queryFn: () => getPerformerProfile(id),
    enabled: !!id,
  });
  return performerProfileQuery;
};

export const useCurrentPerformerProfile = () => {
  const currentPerformerProfileQuery = useQuery({
    queryKey: ['currentPerformerProfile'],
    queryFn: getCurrentPerformerProfile,
  });
  return currentPerformerProfileQuery;
};

export const useGetAllPerformerProfiles = (search?: string) => {
  console.log(search);

  const allPerformerProfilesQuery = useQuery({
    queryKey: ['allPerformerProfiles', search],
    queryFn: () => getAllPerformerProfiles(search),
  });
  return allPerformerProfilesQuery;
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
    onSuccess: () => {
      //Invalidate query
      queryClient.invalidateQueries();
    },
  });
  return editPerformerProfileMutation;
};
