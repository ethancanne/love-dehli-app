import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Event } from '@/types';
import { router } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { applicationColor } from './application-card.component';

type Props = {
  event: Event;
  center?: boolean;
  touchable?: boolean;
  onPress?: () => void;
};

const EventListing = (props: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={props.touchable ? 0.5 : props.onPress ? 0.5 : 1}
      className={`${
        props.touchable ? 'border-b-hairline border-gray-300 bg-white' : ''
      }`}
      onPress={
        props.touchable
          ? () => {
              router.push(`/event/${props.event.$id}`);
            }
          : props.onPress
      }
    >
      <View
        className={`flex flex-row items-center p-5 ${
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
          <View className={`flex flex-col items-start justify-center flex-1`}>
            <Text className="mb-[-5px] text-4xl uppercase font-sfBlack text-wrap">
              {props.event.title}
            </Text>
            <Text className="text-xl font-sfLight">{props.event.theme}</Text>
          </View>

          {props.touchable ? (
            <Entypo name="chevron-right" size={24} color="#01011133" />
          ) : null}
        </View>
      </View>
      {props.event.status && (
        <View className={`flex flex-row items-end justify-end mb-5 mx-5`}>
          <View
            className={`rounded-full px-5 py-1 flex gap-2 flex-row w-fit overflow-hidden flex-1 justify-start items-center ${
              applicationColor(props.event.status).style
            }`}
          >
            {applicationColor(props.event.status).icon}
            <Text className="text-lg ont-sfHeavy">{props.event.status}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default EventListing;
