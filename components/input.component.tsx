import { View, Text, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type Props = {
  control: any;
  placeholder: string;
  name: string;
  title: string;
  rules?: RegisterOptions;
  error?: string;
  focused?: boolean;
};

const Input = (props: Props) => {
  return (
    <View className="w-full mb-6">
      <Text className="w-full text-lg text-black font-sfLight ">
        {props.title}
      </Text>
      <Controller
        control={props.control}
        rules={props.rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`p-4 bg-gray-100 border-none rounded-md focus:border-b-primary-200 focus:border-2 ${
              props.error && 'bg-red-200'
            }`}
            placeholder={props.placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name={props.name}
      />
      {props.error && (
        <Text className="w-full mt-2 text-sm text-red-500">{props.error}</Text>
      )}
    </View>
  );
};

export default Input;
