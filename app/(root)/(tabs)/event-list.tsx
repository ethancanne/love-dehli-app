import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const EventListings = () => {
  return (
    <View>
      <Link href="/event/1"><Text>Event 1</Text></Link>
    </View>
  );
};

export default EventListings;
