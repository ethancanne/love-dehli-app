import { useCurrentUser } from '@/lib/state/user-queries';
import { Redirect, Slot, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';

const EventLayout = () => {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <Stack
      screenOptions={{ headerShown: true, animation: 'slide_from_bottom' }}
    >
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default EventLayout;
