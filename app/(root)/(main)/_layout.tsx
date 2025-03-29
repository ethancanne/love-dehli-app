import { View, Text, SafeAreaView, Image } from 'react-native';
import React from 'react';
import { Tabs, usePathname } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';
import { Images } from '@/constants/images';
import { useCurrentUser } from '@/lib/state/user-queries';
import { checkUserRole } from '@/lib/helper';
import { Feather, FontAwesome6, MaterialIcons } from '@expo/vector-icons';

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: React.ReactNode;
  title: string;
}) => (
  <View
    className={`flex flex-col items-center justify-center flex-1 relative `}
  >
    <View
      className={`${
        focused
          ? 'bg-primary-100 h-2 w-20 absolute top-[-5px] rounded-b-md'
          : 'border-none'
      }`}
    ></View>
    <View className="mt-2">{icon}</View>
  </View>
);

const Layout = () => {
  const pathname = usePathname();

  const { data: user, isLoading: userIsLoading } = useCurrentUser();
  // Map route names to titles
  const getPageTitle = () => {
    switch (pathname.split('/').pop()) {
      case '':
        return 'Upcoming Events';
      case 'schedule':
        return 'Schedule';
      case 'performers':
        return 'Performers';
      case 'account':
        return 'Account';
      default:
        return 'App'; // Default title
    }
  };

  return (
    <>
      <SafeAreaView className="border-b-8 border-primary-100">
        <View className="flex items-start justify-end p-4 h-36">
          <Image
            source={Images.LoveDelhiLong}
            resizeMode="contain"
            className="w-56 h-14"
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
            borderTopColor: 'lightgray',
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
                    size={20}
                    color={focused ? '#E51515' : '#EA7B7B'}
                  />
                }
                title="Events"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            tabBarLabel: 'Events',

            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={
                  <Octicons
                    name="check-circle"
                    size={20}
                    color={focused ? '#E51515' : '#EA7B7B'}
                  />
                }
                title="Schedule"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="performers"
          options={{
            tabBarLabel: 'Events',

            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={
                  <MaterialIcons
                    name="groups"
                    size={20}
                    color={focused ? '#E51515' : '#EA7B7B'}
                  />
                }
                title="Performers"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="account"
          options={{
            tabBarLabel: 'Events',

            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={
                  <Octicons
                    name="person"
                    size={20}
                    color={focused ? '#E51515' : '#EA7B7B'}
                  />
                }
                title="Account"
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default Layout;
