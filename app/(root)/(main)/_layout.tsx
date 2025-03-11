import { View, Text, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import React from 'react';
import { Tabs, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import images from '@/constants/images';

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: React.ReactNode;
  title: string;
}) => (
  <View className={`flex flex-col items-center justify-center flex-1`}>
    <View
      className={`${
        focused ? 'bg-primary-300 h-4 w-20 mb-2 rounded-full' : 'border-none'
      }`}
    ></View>
    {icon}
  </View>
);

const Layout = () => {
  const pathname = usePathname();

  // Map route names to titles
  const getPageTitle = () => {
    switch (pathname.split('/').pop()) {
      case '':
        return 'Upcoming Events';
      case 'schedule':
        return 'Schedule';
      case 'users':
        return 'Users';
      case 'account':
        return 'Account';
      default:
        return 'App'; // Default title
    }
  };

  return (
    <>
      <SafeAreaView className="">
        <View className="flex items-start justify-end p-4 h-36">
          <Image
            source={images.LoveDelhiLong}
            contentFit="contain"
            className="w-full h-40"
          />
          <Text className="w-full text-3xl text-white uppercase font-impact">
            {getPageTitle()}
          </Text>
        </View>
      </SafeAreaView>
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: 'white',
            position: 'absolute',
            borderTopColor: '#0061FF1A',
            borderTopWidth: 1,
            minHeight: 90,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: 'Events',

            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={
                  <Octicons
                    name="home"
                    size={24}
                    color={focused ? '#D91111' : '#EA7B7B'}
                  />
                }
                title="Events"
              />
            ),
          }}
        />
        <Tabs.Screen name="schedule" />
        <Tabs.Screen name="users" />
        <Tabs.Screen name="account" />
      </Tabs>
    </>
  );
};

export default Layout;
