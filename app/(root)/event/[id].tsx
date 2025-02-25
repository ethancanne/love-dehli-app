import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const Event = () => {
    const {id} = useLocalSearchParams();
  return (
    <View>
      <Text>HELLO: {id}</Text>
    </View>
  );
};

export default Event
