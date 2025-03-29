import Loading from '@/components/loading.component';
import { useGetAllPerformerProfiles } from '@/lib/state/performer-profile-queries';
import { PerformerProfile } from '@/types';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import Search from '@/components/search.component';
import { useUIStore } from '@/lib/state/ui-state';
import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';

type PerformerProfileProps = {
  performerProfile: PerformerProfile;
};
const PerformerProfileCard = (props: PerformerProfileProps) => {
  return (
    <TouchableOpacity
      className="flex flex-col items-start justify-center w-full p-5 bg-white border-gray-300 border-hairline"
      onPress={() => {
        router.push(`/performer-profile/${props.performerProfile.$id}`);
      }}
    >
      <Text className="text-lg font-sfRegular">
        {props.performerProfile.stageName}
      </Text>
    </TouchableOpacity>
  );
};

const Performers = () => {
  const { search, setSearch } = useUIStore((state) => state);
  const { data: allPerformerProfiles, isLoading } =
    useGetAllPerformerProfiles(search);

  return (
    <SafeAreaView className="bg-white">
      <Search queryKey="allPerformerProfiles" />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={allPerformerProfiles}
          className="w-full h-full"
          renderItem={({ item }) => (
            <PerformerProfileCard performerProfile={item} />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Performers;
