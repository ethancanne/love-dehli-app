import { useQuery } from '@tanstack/react-query';
import { getEvent, getEvents } from '../appwrite';

export const useGetEvents = () => {
  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });
  return eventsQuery;
};

export const useGetEvent = (id: string) => {
  const eventsQuery = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id),
    enabled: !!id,
  });
  return eventsQuery;
};
