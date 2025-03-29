import {
  View,
  Text,
  Touchable,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { usePerformerProfile } from '@/lib/state/performer-profile-queries';
import Loading from '@/components/loading.component';
import InfoList from '@/components/info-list.component';
import { useChangeApplicationStatus } from '@/lib/state/application-queries';
import { Application, EditData } from '@/types';
import { useUIStore } from '@/lib/state/ui-state';
import { FontAwesome } from '@expo/vector-icons';
import EventListing from '@/components/event-listing.component';
import {
  applicationColor,
  ApplicationSection,
} from '@/components/application-card.component';
import { applicationEditData } from '@/lib/forms';
import { checkUserRole } from '@/lib/helper';
import { useCurrentUser } from '@/lib/state/user-queries';
import StickyHeader from '@/components/sticky-header.component';

const PerformerProfile = () => {
  const { performerProfileId: id } = useLocalSearchParams();

  const { data: user, isLoading: userIsLoading } = useCurrentUser();

  const {
    data: performerProfile,
    isLoading,
    isFetching,
  } = usePerformerProfile(id as string);

  const submittedApplications = {
    accepted: performerProfile?.applications.filter(
      (a) => a.status === 'Accepted'
    ),
    declined: performerProfile?.applications.filter(
      (a) => a.status === 'Declined'
    ),
    pending: performerProfile?.applications.filter(
      (a) => a.status === 'Pending'
    ),
    cancelled: performerProfile?.applications.filter(
      (a) => a.status === 'Cancelled'
    ),
  };

  return (
    <StickyHeader
      headerHeight={400}
      className="bg-slate-200"
      headerChildren={
        <View className="flex items-start justify-end w-full h-full p-5 bg-white"></View>
      }
    >
      <View className="mt-[-100px] p-5 h-full">
        <View>
          <Text className="text-3xl font-impact">
            {performerProfile?.stageName}
          </Text>
        </View>
        <View className="p-5 mt-5 bg-white rounded-md border-hairline">
          {checkUserRole(user, 'admin') &&
          performerProfile &&
          performerProfile?.applications.length > 0 ? (
            <>
              <ApplicationSection
                applications={submittedApplications.accepted}
                status="Accepted"
                showEvent
              />
              <ApplicationSection
                applications={submittedApplications.declined}
                status="Declined"
                showEvent
              />
              <ApplicationSection
                applications={submittedApplications.pending}
                status="Pending"
                showEvent
              />
              <ApplicationSection
                applications={submittedApplications.cancelled}
                status="Cancelled"
                showEvent
              />
            </>
          ) : (
            <ApplicationSection
              applications={submittedApplications.accepted}
              status="Accepted"
              showEvent
            />
          )}
        </View>
      </View>
    </StickyHeader>
  );
};

export default PerformerProfile;
