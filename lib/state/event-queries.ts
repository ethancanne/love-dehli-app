import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createEvent,
  getEvent,
  getEvents,
  getRegisteredEvents,
  registerForEvent,
  updateEvent,
} from '../appwrite';
import { queryClientContext } from '@/app/_layout';

const queryClient = queryClientContext;

export const useCreateEvent = () => {
  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      //Invalidate query
      queryClient.invalidateQueries();
    },
  });
  return createEventMutation;
};

export const useUpdateEvent = () => {
  const createUpdateMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      //Invalidate query
      queryClient.invalidateQueries();
    },
  });
  return createUpdateMutation;
};

export const useGetEvents = () => {
  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });
  return eventsQuery;
};

export const useGetRegisteredEvents = () => {
  const registeredEventsQuery = useQuery({
    queryKey: ['registeredEvents'],
    queryFn: getRegisteredEvents,
  });
  return registeredEventsQuery;
};

export const useGetEvent = (id: string) => {
  const eventsQuery = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id),
    enabled: !!id,
  });
  return eventsQuery;
};

export const useRegisterForEvent = () => {
  const registerForEventMutation = useMutation({
    mutationFn: registerForEvent,
    onSuccess: () => {
      //Invalidate query
      queryClient.invalidateQueries();
    },
  });
  return registerForEventMutation;
};
