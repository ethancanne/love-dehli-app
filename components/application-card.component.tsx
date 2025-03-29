import { View, Text, Touchable, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { Application } from '@/types';
import { FontAwesome } from '@expo/vector-icons';
import { useUIStore } from '@/lib/state/ui-state';
import { checkUserRole } from '@/lib/helper';
import { useCurrentUser } from '@/lib/state/user-queries';
import { router } from 'expo-router';
import EventListing from './event-listing.component';
import { useChangeApplicationStatus } from '@/lib/state/application-queries';
import { applicationEditData } from '@/lib/forms';

export const applicationColor = (status: string) => {
  switch (status) {
    case 'Accepted':
      return {
        style: 'bg-green-100',
        secondStyle: 'bg-green-600',
        textColor: 'text-green-400',
        icon: <FontAwesome name="check-circle" size={20} color="green" />,
      };
    case 'Declined':
      return {
        style: 'bg-red-50',
        secondStyle: 'bg-red-200',
        textColor: 'text-red-300',
        icon: <FontAwesome name="close" size={20} color="red" />,
      };
    case 'Pending':
      return {
        style: 'bg-yellow-100',
        secondStyle: 'bg-yellow',
        textColor: 'text-yellow-200',
        icon: <FontAwesome name="clock-o" size={20} color="#D5B345" />,
      };
    case 'Cancelled':
      return {
        style: 'bg-slate-100 opacity-50',
        secondStyle: 'bg-black',
        textColor: 'text-gray-700 ',
        icon: <FontAwesome name="ban" size={20} color="black" />,
      };
    default:
      return {
        icon: <FontAwesome name="ban" size={20} color="gray" />,
      };
  }
};

type Props = {
  application: Application;
  onPress?: (a: Application) => void;
};

type SectionProps = {
  applications?: Application[];
  status: 'Accepted' | 'Declined' | 'Pending' | 'Cancelled';
  onPress?: (a: Application) => void;
  showEvent?: boolean;
};

export const ApplicationSection = (props: SectionProps) => {
  if (props.applications === undefined || props.applications.length === 0) {
    return null;
  }
  return (
    <View className="mb-4">
      <View className="flex flex-row items-center justify-start gap-2 mb-2 w-fit">
        {applicationColor(props.status).icon}
        <Text
          className={`text-lg text-left ${
            applicationColor(props.status).textColor
          } uppercase font-sfBold`}
        >
          {props.status}
        </Text>
      </View>
      <View className="flex flex-col gap-4">
        {props.applications.map((a: Application) =>
          props.showEvent ? (
            <ApplicationEventCard
              application={a}
              key={a.$id}
              onPress={props.onPress}
            />
          ) : (
            <ApplicationCard
              key={a.$id}
              application={a}
              onPress={props.onPress}
            />
          )
        )}
      </View>
    </View>
  );
};

export const ApplicationCard = (props: Props) => {
  const { setEditViewOptions } = useUIStore((s) => s);

  const { data: user, isLoading } = useCurrentUser();

  const onClickEditApplication = () => {
    if (checkUserRole(user, 'user')) {
      Alert.alert(
        props.application.event.title,
        'What do you want to do with this application?',
        [
          {
            text: 'Update Application',
            onPress: () => {
              setEditViewOptions({
                editDataId: props.application.$id,
                editMutateFn: useChangeApplicationStatus as any,
                editTitle: 'Update Application',
                editData: applicationEditData(props.application),
                editViewIsOpen: true,
              });
            },
          },
          {
            text: 'View Event',
            onPress: () => {
              router.push(
                `/performer-profile/${props.application.performerProfile.$id}`
              );
            },
          },
          {
            text: 'Cancel',
            onPress: () => {},
          },
        ]
      );
    } else {
      router.push(
        `/performer-profile/${props.application.performerProfile.$id}`
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress
          ? props.onPress(props.application)
          : onClickEditApplication();
      }}
      className={`flex flex-row items-center justify-between py-2 px-4 w-full rounded-lg ${
        applicationColor(props.application.status).style
      }`}
    >
      <Text className="text-xl text-black uppercase font-impact">
        {props.application.performerProfile.stageName}
      </Text>
      <View className="flex flex-row items-center justify-center gap-3 px-4 py-2">
        {applicationColor(props.application.status).icon}
        <Text className="font-sfBold">{props.application.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const ApplicationEventCard = (props: Props) => {
  const { setEditViewOptions } = useUIStore((s) => s);

  const { data: user } = useCurrentUser();

  const onClickEditApplication = () => {
    if (checkUserRole(user, 'admin')) {
      Alert.alert(
        'Application for ' + props.application.event.title,
        'What do you want to do with this application?',
        [
          {
            text: 'Update Application',
            onPress: () => {
              setEditViewOptions({
                editDataId: props.application.$id,
                editMutateFn: useChangeApplicationStatus as any,
                editTitle: 'Update Application',
                editData: applicationEditData(props.application),
                editViewIsOpen: true,
              });
            },
          },
          {
            text: 'View Event',
            onPress: () => {
              router.push(`/event/${props.application.event.$id}`);
            },
          },
          {
            text: 'Cancel',
            onPress: () => {},
          },
        ]
      );
    } else {
      router.push(`/event/${props.application.event.$id}`);
    }
  };

  return (
    <TouchableOpacity
      className={`flex flex-row gap-10 items-center justify-between mb-5 rounded-lg ${
        applicationColor(props.application.status).style
      }`}
      onPress={() => {
        props.onPress
          ? props.onPress(props.application)
          : onClickEditApplication();
      }}
    >
      <EventListing
        event={props.application.event}
        center
        onPress={() => onClickEditApplication()}
      />
    </TouchableOpacity>
  );
};

export default ApplicationCard;
