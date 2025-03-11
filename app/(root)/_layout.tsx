import BottomContainer from '@/components/bottom-container.component';
import EditContainer from '@/components/edit-container.component';
import { useUIStore } from '@/lib/state/ui-state';
import { useCurrentUser } from '@/lib/state/user-queries';
import { Redirect, Slot, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';

const RootLayout = () => {
  const { data: user, isLoading } = useCurrentUser();

  const { editViewIsOpen } = useUIStore((s) => s);

  if (isLoading) {
    return <Text>Loading</Text>;
  }

  if (!user) {
    return <Redirect href="/start" />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'ios_from_right',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen
          name="event"
          options={{ headerShown: false, presentation: 'modal' }}
        />
      </Stack>
      {editViewIsOpen && <EditContainer />}
    </>
  );
};

export default RootLayout;
