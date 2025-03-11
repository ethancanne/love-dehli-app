import { useMutation, useQuery } from '@tanstack/react-query';
import { getCurrentUser, updateUser } from '../appwrite';

export const useCurrentUser = () => {
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
  });
  return userQuery;
};

export const useUpdateCurrentUser = () => {
  const userMutation = useMutation({
    mutationFn: updateUser,
  });
  return userMutation;
};
