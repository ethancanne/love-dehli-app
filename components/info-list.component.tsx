import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { InformationList } from '@/types';
import Loading from './loading.component';

type Props = {
  data: InformationList[];
  title?: string;
  onClickEdit?: () => void;
  overrideView?: React.ReactNode;
  isLoading?: boolean;
  shouldShowOverrideView?: boolean;
  shouldShowEditButton?: boolean;
};
const InfoList = (props: Props) => {
  return (
    <View className="w-full mb-4">
      {props.title && (
        <View className="flex flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-sfLight ">{props.title}</Text>
          {props.shouldShowEditButton && (
            <TouchableOpacity
              onPress={props.onClickEdit}
              className="p-1.5 rounded-full bg-primary-200"
            >
              <MaterialIcons name="edit" size={15} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}
      <View className="w-full bg-white shadow-xl shadow-gray-200">
        {props.isLoading ? (
          <Loading />
        ) : props.overrideView && props.shouldShowOverrideView ? (
          props.overrideView
        ) : (
          props.data.map((item, index) => {
            if (item.value && item.label) {
              return (
                <View
                  key={index}
                  className="flex flex-row items-center justify-start gap-4 px-5 py-3 border-gray-200 border-b-hairline"
                >
                  <Text className="flex-grow-0 text-xl uppercase font-impact">
                    {item.label}:
                  </Text>
                  <Text className="flex-1 w-full text-xl font-sfLight">
                    {item.value}
                  </Text>
                </View>
              );
            }
          })
        )}
      </View>
    </View>
  );
};

export default InfoList;
