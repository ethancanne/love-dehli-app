import { SafeAreaView, FlatList } from 'react-native';
import React from 'react';

import { useCreateEvent, useGetEvents } from '@/lib/state/event-queries';
import type { InformationList } from '@/types';
import Loading from '@/components/loading.component';
import { useUIStore } from '@/lib/state/ui-state';
import Button from '@/components/button.component';
import EventListing from '@/components/event-listing.component';
import { checkUserRole } from '@/lib/helper';
import { useCurrentUser } from '@/lib/state/user-queries';

const EventListings = () => {
  const { data: events, isLoading: eventsLoading } = useGetEvents();

  const { data: user, isLoading: userIsLoading } = useCurrentUser();

  const { setEditViewOptions } = useUIStore((s) => s);

  const eventEdit = [
    {
      formInput: {
        name: 'title',
        title: 'Event Title',
        placeholder: 'Enter your event title',
        rules: { required: 'Event title is required' },
      },
    },
    {
      formInput: {
        name: 'theme',
        title: 'Event Theme',
        placeholder: 'Enter your event theme',
        rules: { required: 'Event theme is required' },
      },
    },
    {
      formInput: {
        name: 'description',
        title: 'Event Description',
        placeholder: 'Enter your event description',
        rules: { required: 'Event description is required' },
        inputType: 'textarea',
      },
    },
    {
      formInput: {
        name: 'image',
        title: 'Event Image',
        placeholder: 'Enter your event image',
        rules: { required: 'Event image is required' },
      },
    },
    {
      formInput: {
        name: 'location',
        title: 'Event Location',
        placeholder: 'Enter your event location',
        rules: { required: 'Event location is required' },
      },
    },
    {
      formInput: {
        name: 'startDateTime',
        title: 'Event Start Date and Time',
        placeholder: 'Enter your event start date and time',
        rules: { required: 'Event start date and time is required' },
        inputType: 'datetime',
      },
    },
  ] as InformationList[];

  if (eventsLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={events}
        className="w-full h-full"
        renderItem={({ item }) => <EventListing event={item} touchable />}
      />
      {checkUserRole(user, 'admin') && (
        <Button
          color="red"
          fab
          text="+"
          onPress={() => {
            setEditViewOptions({
              editViewIsOpen: true,
              editData: eventEdit
                .map((item) => item.formInput)
                .filter((i) => i !== undefined),
              editTitle: 'Create an event',
              editMutateFn: useCreateEvent as any,
              editDataId: '',
            });
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default EventListings;
