import { View, Text, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import BottomContainer from '@/components/bottom-container.component';
import Button from '@/components/button.component';
import Foundation from '@expo/vector-icons/Foundation';
import InfoList from '@/components/info-list.component';
import { useGetEvent } from '@/lib/state/event-queries';
import { LinearGradient } from 'expo-linear-gradient';
import Loading from '@/components/loading.component';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  FadeOutLeft,
  FadeOutRight,
} from 'react-native-reanimated';
import EventListing from '@/components/event-listing.component';
import {
  useApplyAsPerformer,
  useChangeApplicationStatus,
  useGetApplicationForEvent,
} from '@/lib/state/application-queries';
import { usePerformerProfile } from '@/lib/state/performer-profile-queries';
import { useQueryClient } from '@tanstack/react-query';
import PerformerProfileCard from '@/components/performer-profile-card.component';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Application } from '@/types';

const Event = () => {
  const { id } = useLocalSearchParams();

  const queryClient = useQueryClient();
  const { data: event, isLoading } = useGetEvent(id as string);
  const { data: performerProfile, isLoading: performerProfileIsLoading } =
    usePerformerProfile();
  const {
    mutate: submitApplication,
    isPending: submitApplicationPending,
    isSuccess: submitApplicationSuccess,
  } = useApplyAsPerformer();

  const { data: application, isLoading: applicationIsLoading } =
    useGetApplicationForEvent(event?.$id as string);

  const {
    mutate: changeApplicationStatus,
    isPending: changeApplicationStatusPending,
    isSuccess: changeApplicationStatusSuccess,
  } = useChangeApplicationStatus();

  const [selectedActionsView, setSelectedActionsView] = useState(0);

  useEffect(() => {
    let selectedActionView = 'main';

    if (application) {
      switch (application.status) {
        case 'Submitted':
          selectedActionView = 'submitted';
          break;
        case 'Accepted':
          selectedActionView = 'main';
          break;
        case 'Not Selected':
          selectedActionView = 'main';
          break;
        case 'Cancelled':
          selectedActionView = 'main';
          break;

        default:
          break;
      }

      setSelectedActionsView(
        actionsViews.findIndex((view) => view.name === selectedActionView)
      );
    }
  }, [application]);

  if (isLoading) {
    return <Loading />;
  }

  if (submitApplicationSuccess || changeApplicationStatusSuccess) {
    queryClient.invalidateQueries();
  }

  const eventData = [
    {
      label: 'theme',
      value: event?.theme,
    },
    {
      label: 'Date',
      value: Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(event?.startDateTime as string)),
    },
    {
      label: 'Time',
      value: Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(new Date(event?.startDateTime as string)),
    },
    {
      label: 'Location',
      value: event?.location,
    },
  ];

  const actionsViews = [
    {
      name: 'loading',
      showOverlay: true,
      container: <Loading />,
    },
    {
      name: 'main',
      showOverlay: false,
      container: (
        <Animated.View
          entering={FadeInLeft.delay(200)}
          exiting={FadeOutLeft}
          className={'z-20'}
        >
          <View>
            <Button
              text="Apply to Perform"
              onPress={() =>
                setSelectedActionsView(
                  actionsViews.findIndex((view) => view.name === 'apply')
                )
              }
              color="red"
              small
              icon={<Foundation name="microphone" size={20} color="white" />}
            />
          </View>
        </Animated.View>
      ),
    },

    {
      name: 'apply',
      showOverlay: true,
      title: 'Are you sure you want to apply to perform at this event?',
      container: (
        <Animated.View
          entering={FadeInLeft.delay(100)}
          exiting={FadeOutRight}
          className={'z-20'}
        >
          <View>
            <EventListing event={event!} center />

            <View className="my-10">
              <Text className="mb-2 text-md font-sfLight">
                Performer Profile
              </Text>
              <PerformerProfileCard performerProfile={performerProfile!} />
            </View>

            <Button
              text="Yes"
              onPress={() => {
                submitApplication({
                  eventId: event?.$id as string,
                  performerProfileId: performerProfile?.$id as string,
                });
                setSelectedActionsView(
                  actionsViews.findIndex((view) => view.name === 'loading')
                );
              }}
              color="green"
              small
            />
            <Button
              text="No"
              onPress={() => {
                setSelectedActionsView(
                  actionsViews.findIndex((view) => view.name === 'main')
                );
              }}
              color="red"
              small
            />
          </View>
        </Animated.View>
      ),
    },

    {
      name: 'submitted',
      showOverlay: false,
      container: (
        <Animated.View
          entering={FadeInRight.delay(100)}
          exiting={FadeOutLeft}
          className={'z-20'}
        >
          <View className="flex flex-row items-center justify-center max-w-full gap-5 mb-10">
            <Feather name="clock" size={50} color="#FFBB22" />
            <View className="flex flex-col items-start justify-center ">
              <Text className="text-lg font-sfBold">
                Application to perform submitted!
              </Text>
              <Text className="text-lg font-sfLight">
                Please check back later
              </Text>
            </View>
          </View>
          <Button
            text="Cancel Application"
            onPress={() => {
              Alert.alert(
                'Cancel Application',
                'Are you sure you want to cancel your application to perform at this event?',
                [
                  {
                    text: 'Yes',
                    onPress: () => {
                      changeApplicationStatus({
                        applicationId: application?.$id!,
                        newStatus: 'Cancelled',
                      });
                      setSelectedActionsView(
                        actionsViews.findIndex(
                          (view) => view.name === 'loading'
                        )
                      );
                    },
                  },
                  {
                    text: 'No',
                  },
                ]
              );
            }}
            color="red"
            small
          />
        </Animated.View>
      ),
    },
  ];

  return (
    <View className="h-full">
      <LinearGradient colors={['rgba(0,0,0,1)', '#D91111']}>
        <View className="flex items-start justify-end h-52">
          <Image
            source={{ uri: event?.image }}
            className="absolute top-0 left-0 z-[-1] w-full h-full opacity-40"
          />
          <Text className="mb-4 ml-4 text-4xl text-white uppercase font-impact">
            {event?.title}
          </Text>
        </View>
      </LinearGradient>
      <View className="flex flex-col gap-10 p-4">
        <Text className="text-xl font-sfLight">{event?.description}</Text>

        <InfoList data={eventData} title="Event Information" />
      </View>
      {actionsViews[selectedActionsView].showOverlay && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className="absolute top-0 left-0 z-0 w-full h-full bg-[#00000067]"
        />
      )}

      <BottomContainer
        subtle
        loading={
          submitApplicationPending ||
          performerProfileIsLoading ||
          changeApplicationStatusPending ||
          applicationIsLoading
        }
      >
        {actionsViews[selectedActionsView].title && (
          <Text className="p-10 pb-5 text-2xl text-center font-sfLight">
            {actionsViews[selectedActionsView].title}
          </Text>
        )}

        {actionsViews[selectedActionsView].container}
      </BottomContainer>
    </View>
  );
};

export default Event;
