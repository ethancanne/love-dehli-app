import { useCurrentUser } from '@/lib/state/user-queries';
import { QueryClient } from '@tanstack/react-query';
import { Redirect, Slot, Stack } from 'expo-router';
import React, { Children } from 'react';
import { Text, View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

const AuthLayout = (props: Props) => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Text>Loading</Text>;
  }

  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <View className="h-full">
      <Slot
        screenOptions={{
          headerShown: false,
        }}
      />
    </View>
  );
};

export default AuthLayout;
