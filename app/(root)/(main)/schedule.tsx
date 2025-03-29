import { View, Text, SafeAreaView, SectionList } from 'react-native';
import React from 'react';
import { useGetRegisteredEvents } from '@/lib/state/event-queries';
import Loading from '@/components/loading.component';
import EventListing from '@/components/event-listing.component';
import { useCurrentPerformerProfile } from '@/lib/state/performer-profile-queries';

const Schedule = () => {
  const { data: events, isLoading: eventsLoading } = useGetRegisteredEvents();
  const { data: performerProfile, isLoading: performerProfileLoading } =
    useCurrentPerformerProfile();

  if (eventsLoading || performerProfileLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="h-full bg-white">
      {(events && events?.length > 0) || performerProfile?.applications ? (
        <SectionList
          className="mb-14"
          renderSectionHeader={({ section: { title } }) => (
            <Text className="pl-4 text-2xl text-white uppercase bg-red-700 font-sfHeavy">
              {title}
            </Text>
          )}
          sections={[
            {
              title: 'Registered',
              data: events ? events : [],
            },
            {
              title: 'Applied',
              data: performerProfile
                ? performerProfile?.applications
                    .map((a) => ({
                      ...a.event,
                      status: a.status,
                    }))
                    .sort((a, b) => {
                      if (a.status === 'Accepted') {
                        return -1;
                      }
                      if (b.status === 'Accepted') {
                        return 1;
                      }
                      return 0;
                    })
                : [],
            },
          ]}
          renderItem={({ item }) => <EventListing event={item} touchable />}
        />
      ) : (
        <View className="flex flex-col items-center justify-center h-full text-gray-900">
          <Text className="w-3/4 text-3xl text-centerfont-sfLight">
            You have not registered or applied for any events yet
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Schedule;
