import { View, Text, TextInput, TextInputProps } from 'react-native';
import React from 'react';
import { Controller } from 'react-hook-form';

import DateTimePicker from '@react-native-community/datetimepicker';
import { EditData } from '@/types';
import { Picker } from '@react-native-picker/picker';
import PhoneInput from 'react-phone-number-input/react-native-input';

interface Props extends EditData {
  control: any;
  textProps?: TextInputProps;
}

const Input = (props: Props) => {
  return (
    <View className="w-full mb-6">
      <Text className="w-full text-lg text-black font-sfLight ">
        {props.title}
      </Text>
      <Controller
        control={props.control}
        rules={props.rules}
        render={({ field: { onChange, onBlur, value } }) => {
          if (props.inputType === 'datetime') {
            return (
              <DateTimePicker
                value={value || new Date()}
                mode="datetime"
                display="default"
                className="text-black"
                accentColor="#D91111"
                textColor="#000000"
                onChange={(event, selectedDate) => {
                  onChange(selectedDate);
                }}
              />
            );
          }

          if (props.inputType === 'select') {
            return (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                onBlur={onBlur}
              >
                {props.options?.map((option) => (
                  <Picker.Item
                    color="#000000"
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            );
          }

          if (props.inputType === 'phone') {
            return (
              <View
                className={`p-4 bg-gray-100 border-none rounded-md focus:border-b-primary-200 focus:border-2 ${
                  props.error && 'bg-red-200'
                }`}
              >
                <PhoneInput
                  onBlur={onBlur}
                  defaultCountry="IN"
                  onChange={onChange}
                  value={value}
                  placeholder={props.placeholder}
                />
              </View>
            );
          }

          return (
            <TextInput
              className={`p-4 bg-gray-100 border-none rounded-md focus:border-b-primary-200 focus:border-2   ${
                props.error && 'bg-red-200'
              }`}
              {...props.textProps}
              placeholder={props.placeholder}
              onBlur={onBlur}
              multiline={props.inputType === 'textarea'}
              onChangeText={onChange}
              value={value}
            />
          );
        }}
        name={props.name}
      />
      {props.error ? (
        <Text className="w-full mt-2 text-sm text-red-500">{props.error}</Text>
      ) : null}
    </View>
  );
};

export default Input;
