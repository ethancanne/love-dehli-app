import {
  View,
  Text,
  Image,
  Alert,
  Touchable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import BottomContainer from '@/components/bottom-container.component';
import Button from '@/components/button.component';
import Foundation from '@expo/vector-icons/Foundation';
import InfoList from '@/components/info-list.component';
import {
  useGetEvent,
  useRegisterForEvent,
  useUpdateEvent,
} from '@/lib/state/event-queries';
import { LinearGradient } from 'expo-linear-gradient';
import Loading from '@/components/loading.component';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  FadeOutLeft,
  FadeOutRight,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import EventListing from '@/components/event-listing.component';
import {
  useApplyAsPerformer,
  useChangeApplicationStatus,
  useGetApplicationForEvent,
} from '@/lib/state/application-queries';
import { useCurrentPerformerProfile } from '@/lib/state/performer-profile-queries';
import { useQueryClient } from '@tanstack/react-query';
import PerformerProfileCard from '@/components/performer-profile-card.component';
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import ConfirmationView from '@/components/confirmation-view.component';
import { useCurrentUser } from '@/lib/state/user-queries';
import QRCode from 'react-native-qrcode-svg';
import { Application, InformationList } from '@/types';
import { useUIStore } from '@/lib/state/ui-state';
import ApplicationCard, {
  ApplicationSection,
} from '@/components/application-card.component';
import { applicationEditData } from '@/lib/forms';
import {
  ImageHeaderScrollView,
  TriggeringView,
} from 'react-native-image-header-scroll-view';
import { checkUserRole, groupApplicationsByStatus } from '@/lib/helper';
import StickyHeader from '@/components/sticky-header.component';

const Event = () => {
  const { id } = useLocalSearchParams();

  const queryClient = useQueryClient();
  const { setEditViewOptions } = useUIStore((s) => s);

  const { data: event, isLoading, isFetching } = useGetEvent(id as string);
  const { data: performerProfile, isLoading: performerProfileIsLoading } =
    useCurrentPerformerProfile();

  const { data: user, isLoading: userIsLoading } = useCurrentUser();
  const {
    mutate: submitApplication,
    isPending: submitApplicationPending,
    isSuccess: submitApplicationSuccess,
  } = useApplyAsPerformer();

  const {
    mutate: registerForEvent,
    isPending: registerForEventPending,
    isSuccess: registerForEventSuccess,
  } = useRegisterForEvent();

  const { data: application, isLoading: applicationIsLoading } =
    useGetApplicationForEvent(
      event?.$id as string,
      performerProfile?.$id as string
    );

  const {
    mutate: changeApplicationStatus,
    isPending: changeApplicationStatusPending,
    isSuccess: changeApplicationStatusSuccess,
  } = useChangeApplicationStatus();

  const [selectedActionsView, setSelectedActionView] = useState(0);
  const [eventData, setEventData] = useState<InformationList[]>([]);
  const [actionViews, setActionViews] = useState<any>();

  const actionViewIndices = {
    MAIN: 0,
    LOADING: 1,
    APPLY: 2,
    REGISTER: 3,
    PENDING: 4,

    ACCEPTED: 5,
    DECLINED: 6,
    REGISTERED: 7,
    QR: 8,
  };

  useEffect(() => {
    setActionViews([
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
              {performerProfile && (
                <Button
                  text="Apply to Perform"
                  onPress={() => setSelectedActionView(actionViewIndices.APPLY)}
                  color="red"
                  small
                  icon={
                    <Foundation name="microphone" size={20} color="white" />
                  }
                />
              )}
              <Button
                text="Register to Attend"
                onPress={() =>
                  setSelectedActionView(actionViewIndices.REGISTER)
                }
                color="black"
                small
                icon={
                  <Foundation name="clipboard-pencil" size={20} color="white" />
                }
              />
            </View>
          </Animated.View>
        ),
      },
      {
        name: 'loading',
        showOverlay: true,
        container: <Loading />,
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
                  setSelectedActionView(actionViewIndices.LOADING);
                  submitApplication({
                    eventId: event?.$id as string,
                    performerProfileId: performerProfile?.$id as string,
                  });
                }}
                color="green"
                small
              />
              <Button
                text="No"
                onPress={() => {
                  setSelectedActionView(actionViewIndices.MAIN);
                }}
                color="red"
                small
              />
            </View>
          </Animated.View>
        ),
      },

      {
        name: 'register',
        showOverlay: true,
        title: 'Are you sure you want to register to attend this event?',
        container: (
          <Animated.View
            entering={FadeInLeft.delay(100)}
            exiting={FadeOutRight}
            className={'z-20'}
          >
            <View>
              <EventListing event={event!} center />

              <Button
                text="Yes"
                onPress={() => {
                  setSelectedActionView(actionViewIndices.LOADING);
                  registerForEvent(event?.$id as string);
                }}
                color="green"
                small
              />
              <Button
                text="No"
                onPress={() => {
                  setSelectedActionView(actionViewIndices.MAIN);
                }}
                color="red"
                small
              />
            </View>
          </Animated.View>
        ),
      },

      {
        name: 'pending',
        showOverlay: false,
        container: (
          <ConfirmationView
            icon={<Feather name="clock" size={50} color="#FFBB22" />}
            mainText="Application to perform submitted!"
            subText="Please check back later"
            buttonText="Cancel Application"
            showButton={true}
            onPress={() => {
              Alert.alert(
                'Cancel Application',
                'Are you sure you want to cancel your application to perform at this event?',
                [
                  {
                    text: 'No',
                  },
                  {
                    text: 'Yes',
                    onPress: () => {
                      setSelectedActionView(actionViewIndices.LOADING);
                      changeApplicationStatus({
                        applicationId: application?.$id!,
                        newStatus: 'Cancelled',
                      });
                    },
                  },
                ]
              );
            }}
            buttonColor="red"
          />
        ),
      },
      {
        name: 'accepted',
        showOverlay: false,
        container: (
          <ConfirmationView
            icon={<Feather name="check-circle" size={50} color="#307C47" />}
            mainText="Application to perform accepted!"
            subText="Please arrive on time to get set up."
            buttonText="Show QR Code"
            message={application?.message}
            showButton={true}
            onPress={() => {
              setSelectedActionView(actionViewIndices.QR);
            }}
            buttonColor="black"
          />
        ),
      },

      {
        name: 'declined',
        showOverlay: false,
        container: (
          <ConfirmationView
            icon={<Feather name="x-circle" size={50} color="#AC0000" />}
            mainText="We're sorry, you were not selected to perform at this event."
            subText="Please try again next time."
            buttonText="Back"
            showButton={true}
            onPress={() => {
              setSelectedActionView(actionViewIndices.MAIN);
            }}
            buttonColor="black"
          />
        ),
      },

      {
        name: 'registered',
        showOverlay: false,
        container: (
          <ConfirmationView
            icon={<Feather name="check-circle" size={50} color="#307C47" />}
            mainText="You're registered!"
            subText="We're looking forward to seeing you!"
            buttonText="Show QR Code"
            showButton={true}
            onPress={() => {
              setSelectedActionView(actionViewIndices.QR);
            }}
            buttonColor="black"
          />
        ),
      },
      {
        name: 'registration-qr-code',
        showOverlay: true,
        container: (
          <Animated.View
            entering={FadeInRight.delay(100)}
            exiting={FadeOutLeft}
            className="flex flex-col items-center justify-center gap-10"
          >
            <QRCode value={user?.$id} size={250} />
            <Button
              text="Back"
              onPress={() => {
                setSelectedActionView(actionViewIndices.REGISTERED);
              }}
              color="black"
              small
            />
          </Animated.View>
        ),
      },
      {
        name: 'performer-qr-code',
        showOverlay: true,
        container: (
          <Animated.View
            entering={FadeInRight.delay(100)}
            exiting={FadeOutLeft}
            className="flex flex-col items-center justify-center gap-10"
          >
            <QRCode value={performerProfile?.$id} size={250} />
            <Button
              text="Back"
              onPress={() => {
                setSelectedActionView(actionViewIndices.ACCEPTED);
              }}
              color="black"
              small
            />
          </Animated.View>
        ),
      },
    ]);
  }, [application, event, user, performerProfile]);

  useEffect(() => {
    let selectedActionView = 0;

    if (event?.registrations.includes(user?.$id as string)) {
      setSelectedActionView(actionViewIndices.REGISTERED);
      return;
    }

    if (application) {
      switch (application.status) {
        case 'Pending':
          selectedActionView = actionViewIndices.PENDING;
          break;
        case 'Accepted':
          selectedActionView = actionViewIndices.ACCEPTED;
          break;
        case 'Declined':
          selectedActionView = actionViewIndices.DECLINED;
          break;
        case 'Cancelled':
          selectedActionView = actionViewIndices.MAIN;
          break;

        default:
          break;
      }
    }

    if (actionViews) setSelectedActionView(selectedActionView);
    else {
      setSelectedActionView(0);
    }
  }, [application, event, user, performerProfile, actionViews]);

  useEffect(() => {
    if (!event) return;
    setEventData([
      {
        label: 'title',
        value: event?.title,
        hidden: true,

        formInput: {
          name: 'title',
          title: 'Event Title',
          placeholder: 'Enter your event title',
          rules: { required: 'Event title is required' },
          defaultValue: event?.title,
        },
      },
      {
        label: 'theme',
        value: event?.theme,
        formInput: {
          name: 'theme',
          title: 'Event Theme',
          placeholder: 'Enter your event theme',
          rules: { required: 'Event theme is required' },
          defaultValue: event?.theme,
        },
      },
      {
        label: 'Date',
        value: Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(new Date(event?.startDateTime as string)),

        formInput: {
          name: 'date',
          title: 'Event Date',
          placeholder: 'Enter your event date',
          rules: { required: 'Event date is required' },
          defaultValue: event?.startDateTime,
          hidden: true,
        },
      },
      {
        label: 'Time',
        value: Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }).format(new Date(event?.startDateTime as string)),

        formInput: {
          name: 'time',
          title: 'Event Time',
          placeholder: 'Enter your event time',
          rules: { required: 'Event time is required' },
          defaultValue: event?.startDateTime,
          hidden: true,
        },
      },

      {
        label: 'description',
        value: event?.description,
        hidden: true,
        formInput: {
          name: 'description',
          title: 'Event Description',
          placeholder: 'Enter your event description',
          rules: { required: 'Event description is required' },
          inputType: 'textarea',
          defaultValue: event?.description,
        },
      },
      {
        label: 'image',
        value: event?.image,
        hidden: true,
        formInput: {
          name: 'image',
          title: 'Event Image',
          placeholder: 'Enter your event image',
          rules: { required: 'Event image is required' },
          defaultValue: event?.image,
        },
      },
      {
        label: 'location',
        value: event?.location,
        formInput: {
          name: 'location',
          title: 'Event Location',
          placeholder: 'Enter your event location',
          rules: { required: 'Event location is required' },
          defaultValue: event?.location,
        },
      },
      {
        label: 'startDateTime',
        value: event?.startDateTime,
        hidden: true,
        formInput: {
          name: 'startDateTime',
          title: 'Event Start Date and Time',
          placeholder: 'Enter your event start date and time',
          rules: { required: 'Event start date and time is required' },
          inputType: 'datetime',
          defaultValue: new Date(event?.startDateTime),
        },
      },
    ] as InformationList[]);
  }, [event]);

  const onClickApplication = (application: Application) => {
    Alert.alert(
      'Application for ' + event?.title,
      'What do you want to do with this application?',
      [
        {
          text: 'Update Application',
          onPress: () => {
            setEditViewOptions({
              editDataId: application.$id,
              editMutateFn: useChangeApplicationStatus as any,
              editTitle: 'Update Application',
              editData: applicationEditData(application),
              editViewIsOpen: true,
            });
          },
        },
        {
          text: 'View Performer Profile',
          onPress: () => {
            router.push(
              `/performer-profile/${application.performerProfile.$id}`
            );
          },
        },
        {
          text: 'Cancel',
          onPress: () => {},
        },
      ]
    );
  };

  const submittedApplications = groupApplicationsByStatus(
    event?.applications,
    true
  );

  const HEADER_HEIGHT = 300;

  return (
    <>
      <StickyHeader
        pageTitle={event?.title}
        isLoading={
          isLoading || isFetching || !event || actionViews.length === 0
        }
        contentClassName="bg-gray-300"
        headerHeight={HEADER_HEIGHT}
        headerChildren={
          <LinearGradient colors={['rgba(0,0,0,1)', '#D91111']}>
            <View className="relative flex items-start justify-end h-full">
              <Image
                source={{ uri: event?.image }}
                style={{ width: '100%', height: 400 }}
                className="absolute top-0 left-0 z-[-1] w-full h-full opacity-40 object-contain"
              />
            </View>
          </LinearGradient>
        }
      >
        <View className="mt-[-100px] ">
          <Text className="p-4 text-4xl text-white uppercase font-impact ">
            {event?.title}
          </Text>
          <View className="p-4 mx-2 bg-white rounded-md pb-96 shadow-slate-900 sh">
            <View className="flex flex-col gap-10 ">
              <Text className="text-xl font-sfLight">{event?.description}</Text>
              <InfoList
                data={eventData}
                title="Event Information"
                shouldShowEditButton={checkUserRole(user, 'admin')}
                onClickEdit={() => {
                  setEditViewOptions({
                    editViewIsOpen: true,

                    editData: eventData
                      .map((item) => item.formInput)
                      .filter((item) => item !== undefined),
                    editTitle: 'Update Event Information',
                    editMutateFn: useUpdateEvent as any,
                    editDataId: event?.$id,
                  });
                }}
              />
            </View>

            {checkUserRole(user, 'admin') && (
              <View className="flex flex-col gap-4 p-5">
                <Text className="mb-3 text-3xl uppercase text-primary-400 font-impact">
                  Applications
                </Text>
                <ApplicationSection
                  applications={submittedApplications.accepted || []}
                  status="Accepted"
                  onPress={onClickApplication}
                />
                <ApplicationSection
                  applications={submittedApplications.declined || []}
                  status="Declined"
                  onPress={onClickApplication}
                />
                <ApplicationSection
                  applications={submittedApplications.pending || []}
                  status="Pending"
                  onPress={onClickApplication}
                />
                <ApplicationSection
                  applications={submittedApplications.cancelled || []}
                  status="Cancelled"
                  onPress={onClickApplication}
                />
              </View>
            )}
          </View>
        </View>
      </StickyHeader>
      {actionViews && actionViews[selectedActionsView]?.showOverlay ? (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className="absolute top-0 left-0 z-0 w-full h-full bg-[#00000067]"
        />
      ) : null}

      {actionViews && checkUserRole(user, 'user') ? (
        <BottomContainer
          subtle
          loading={
            submitApplicationPending ||
            performerProfileIsLoading ||
            changeApplicationStatusPending ||
            applicationIsLoading ||
            registerForEventPending
          }
        >
          {actionViews && actionViews[selectedActionsView].title && (
            <Text className="p-10 pb-5 text-2xl text-center font-sfLight">
              {actionViews[selectedActionsView].title}
            </Text>
          )}

          {actionViews[selectedActionsView].container}
        </BottomContainer>
      ) : null}
    </>
  );
};

export default Event;
