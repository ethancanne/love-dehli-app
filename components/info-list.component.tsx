import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { InformationList } from '@/types';
import Loading from './loading.component';

type Props = {
  data?: InformationList[];
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
      {props.title ? (
        <View className="flex flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-sfLight ">{props.title}</Text>
          {props.shouldShowEditButton ? (
            <TouchableOpacity
              onPress={props.onClickEdit}
              className="p-1.5 rounded-full bg-primary-200"
            >
              <MaterialIcons name="edit" size={15} color="white" />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
      <View className="w-full bg-white shadow-xl shadow-gray-200">
        {props.isLoading ? (
          <Loading />
        ) : props.overrideView && props.shouldShowOverrideView ? (
          props.overrideView
        ) : (
          props.data
            ?.filter((i) => i.hidden !== true)
            .map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={item.onPress ? 0.5 : 1}
                  onPress={item.onPress && item.onPress}
                  key={index}
                  className={`flex flex-row items-center justify-start gap-4 border-gray-200 border-b-hairline ${
                    item.component ? '' : ' px-5 py-3'
                  }`}
                >
                  {item.component ? (
                    item.component
                  ) : (
                    <>
                      <Text className="flex-grow-0 text-xl uppercase font-impact">
                        {item.label}:
                      </Text>
                      <Text className="flex-1 w-full text-xl font-sfLight">
                        {item.value}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              );
            })
        )}
      </View>
    </View>
  );
};

export default InfoList;
