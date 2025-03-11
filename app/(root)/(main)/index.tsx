import {
  View,
  Text,
  Button,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Link, router } from 'expo-router';
import { logout } from '@/lib/appwrite';
import { useCurrentUser } from '@/lib/state/user-queries';
import { useQueryClient } from '@tanstack/react-query';
import { useGetEvents } from '@/lib/state/event-queries';
import type { Event } from '@/types';
import Entypo from '@expo/vector-icons/Entypo';

type EventListingProps = {
  event: Event; // Define the prop type for EventListing
};
const EventListing = (props: EventListingProps) => {
  return (
    <TouchableOpacity
      className="border-b border-gray-200"
      onPress={() => {
        router.push(`/event/${props.event.$id}`);
      }}
    >
      <View className="flex flex-row items-center justify-between p-5 bg-white">
        <View className="flex flex-row items-center justify-start gap-4">
          <View className="flex flex-col items-center justify-center">
            <Text className="text-4xl uppercase font-impact color-primary-100 mb-[-10px]">
              {Intl.DateTimeFormat('en-US', {
                month: 'short',
              }).format(new Date(props.event.startDateTime))}
            </Text>
            <Text className="w-full text-4xl text-center uppercase font-signPainter">
              {Intl.DateTimeFormat('en-US', {
                day: 'numeric',
              }).format(new Date(props.event.startDateTime))}
            </Text>
          </View>
          <View className="flex flex-col items-start justify-center">
            <Text className="mb-[-5px] text-4xl uppercase font-sfBlack">
              {props.event.title}
            </Text>
            <Text className="text-xl font-sfLight">{props.event.theme}</Text>
          </View>
        </View>

        <Entypo name="chevron-right" size={24} color="#01011133" />
      </View>
    </TouchableOpacity>
  );
};
const EventListings = () => {
  const queryClient = useQueryClient();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: events, isLoading: eventsLoading } = useGetEvents();

  if (userLoading) {
    return <Text>Loading</Text>;
  }

  if (user) {
    return (
      <SafeAreaView>
        <FlatList
          data={events}
          className="w-full h-full"
          renderItem={({ item }) => <EventListing event={item} />}
        />
      </SafeAreaView>
    );
  } else {
    return (
      <View>
        <Text>Not logged in</Text>
        <Link href="/start">
          <Text>Sign In</Text>
        </Link>
      </View>
    );
  }
};

export default EventListings;
