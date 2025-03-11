import { View, Text } from 'react-native';
import React from 'react';
import { Event } from '@/types';

type Props = {
  event: Event;
  center: boolean;
};
const EventListing = (props: Props) => {
  return (
    <View
      className={`flex flex-row items-center p-5 bg-white ${
        props.center ? 'justify-center' : 'justify-between'
      }`}
    >
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
    </View>
  );
};

export default EventListing;
