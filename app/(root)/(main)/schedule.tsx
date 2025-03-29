import { View, Text, SafeAreaView, SectionList } from 'react-native';
import React from 'react';
import { useGetRegisteredEvents } from '@/lib/state/event-queries';
import Loading from '@/components/loading.component';
import EventListing from '@/components/event-listing.component';
import { useCurrentPerformerProfile } from '@/lib/state/performer-profile-queries';
import { getApplicationStyle, groupApplicationsByStatus } from '@/lib/helper';
import { Application } from '@/types';

const Schedule = () => {
  const { data: registeredEvents, isLoading: eventsLoading } =
    useGetRegisteredEvents();
  const { data: performerProfile, isLoading: performerProfileLoading } =
    useCurrentPerformerProfile();

  if (eventsLoading || performerProfileLoading) {
    return <Loading />;
  }

  const getSectionData = () => {
    let sections: any[] = [];

    if (registeredEvents && registeredEvents?.length > 0) {
      sections.push({
        title: 'Registered',
        data: registeredEvents.map((e) => ({
          event: e,
        })),
      });
    }

    const submittedApplications = groupApplicationsByStatus(
      performerProfile?.applications,
      true
    );

    if (
      submittedApplications.accepted &&
      submittedApplications.accepted?.length > 0
    ) {
      sections.push({
        title: 'Accepted',
        data: submittedApplications.accepted,
      });
    }

    if (
      submittedApplications.declined &&
      submittedApplications.declined?.length > 0
    ) {
      sections.push({
        title: 'Declined',
        data: submittedApplications.declined,
      });
    }

    if (
      submittedApplications.pending &&
      submittedApplications.pending?.length > 0
    ) {
      sections.push({
        title: 'Pending',
        data: submittedApplications.pending,
      });
    }

    if (
      submittedApplications.cancelled &&
      submittedApplications.cancelled?.length > 0
    ) {
      sections.push({
        title: 'Cancelled',
        data: submittedApplications.cancelled,
      });
    }

    return sections;
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <SectionList
        className="mb-14"
        ListEmptyComponent={
          <View className="flex flex-col items-center justify-center h-full text-gray-900">
            <Text className="w-3/4 text-3xl text-centerfont-sfLight">
              You have not registered or applied for any events yet
            </Text>
          </View>
        }
        renderSectionHeader={({ section: { title, data } }) => (
          <Text
            className={`pl-4 py-2 text-xl uppercase font-sfHeavy ${
              getApplicationStyle(title).textColor
            } ${getApplicationStyle(title).style}`}
          >
            {title}
          </Text>
        )}
        sections={getSectionData()}
        renderItem={(data: { item: Application }) => (
          <EventListing event={data.item.event} touchable />
        )}
      />
    </SafeAreaView>
  );
};

export default Schedule;
