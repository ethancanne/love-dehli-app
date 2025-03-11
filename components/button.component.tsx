import { View, Text, Button, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link, RelativePathString } from 'expo-router';

type Props = {
  text: React.ReactNode;
  href?: RelativePathString;
  onPress: () => void;
  color: 'red' | 'black' | 'white' | 'green';
  small?: boolean;
  icon?: React.ReactNode;
  className?: string;
};

const TheButton = (props: Props) => {
  let color;
  switch (props.color) {
    case 'red':
      color = 'bg-primary-300';
      break;
    case 'black':
      color = 'bg-black';
      break;
    case 'white':
      color = 'bg-white';
      break;
    case 'green':
      color = 'bg-green';
      break;
  }
  const classname = `w-full flex flex-row items-center justify-center gap-2 rounded-full shadow-gray-100 my-2 ${color} ${
    props.small ? 'p-2' : 'p-4'
  } ${props.className}`;

  const textClassname = `text-center font-sfHeavy  ${
    props.color === 'white' ? 'text-black' : 'text-white'
  } ${props.small ? 'text-xl' : 'text-xl'}`;

  if (props.href) {
    return (
      <Link href={props.href} className={classname}>
        {props.icon && props.icon}
        <Text className={textClassname}>{props.text}</Text>
      </Link>
    );
  } else {
    return (
      <TouchableOpacity className={classname} onPress={props.onPress}>
        {props.icon && props.icon}
        <Text className={textClassname}>{props.text}</Text>
      </TouchableOpacity>
    );
  }
};

export default TheButton;
