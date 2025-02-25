import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const Layout = () => {
  return (
      <Tabs>
        <Tabs.Screen name="event-list" />
        <Tabs.Screen name="schedule" />
        <Tabs.Screen name="users" />
        <Tabs.Screen name="account" />
      </Tabs>
  );
};

export default Layout;
