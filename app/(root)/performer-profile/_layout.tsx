import { Stack } from 'expo-router';

const PerformerProfileLayout = () => {
  return (
    <Stack
      screenOptions={{ headerShown: true, animation: 'slide_from_bottom' }}
    >
      <Stack.Screen
        name="[performerProfileId]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default PerformerProfileLayout;
