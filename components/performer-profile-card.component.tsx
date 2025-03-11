import { View, Text } from 'react-native';
import React from 'react';
import { PerformerProfile } from '@/types';

type Props = {
  performerProfile: PerformerProfile;
};
const PerformerProfileCard = (props: Props) => {
  return (
    <View className="flex items-start justify-center w-full p-5 border-gray-400 rounded-md border-hairline">
      <Text className="text-md font-sfLight">
        {props.performerProfile.stageName}
      </Text>
    </View>
  );
};

export default PerformerProfileCard;
