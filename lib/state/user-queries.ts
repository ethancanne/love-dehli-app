import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getCurrentUser,
  login,
  logout,
  registerUser,
  updateUser,
} from '../appwrite';

import { queryClientContext } from '@/app/_layout';

const queryClient = queryClientContext;

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

export const useLogin = () => {
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
  return loginMutation;
};

export const useLogout = () => {
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
  return logoutMutation;
};

export const useRegisterUser = () => {
  const registerUserMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
  return registerUserMutation;
};
