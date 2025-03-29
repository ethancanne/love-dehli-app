import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import Loading from './loading.component';
import { router, Stack } from 'expo-router';
import { Entypo } from '@expo/vector-icons';

type Props = {
  isLoading?: boolean;
  headerChildren: React.ReactNode;
  children: React.ReactNode;
  pageTitle?: string;
  headerHeight: number;
  className?: string;
  contentClassName?: string;
  hideSecondHeader?: boolean;
};
const StickyHeader = (props: Props) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [0, props.headerHeight / 1.5],
        [0, 1]
      ),
    };
  });
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-props.headerHeight, 0, props.headerHeight],
            [-props.headerHeight / 2, 0, props.headerHeight * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-props.headerHeight, 0, props.headerHeight],
            [2, 1, 1]
          ),
        },
      ],
    };
  });
  return (
    <>
      {!props.hideSecondHeader && (
        <Stack.Screen
          options={{
            headerShown: true,
            headerTransparent: true,

            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Entypo name="chevron-left" size={24} color="white" />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Animated.Text
                className="text-2xl font-bold text-white"
                style={headerAnimatedStyle}
              >
                {props.pageTitle}
              </Animated.Text>
            ),
            headerBackground: () => (
              <Animated.View
                style={headerAnimatedStyle}
                className={'bg-primary-300 h-48'}
              />
            ),
          }}
        />
      )}
      <Animated.ScrollView
        contentContainerClassName={props.contentClassName}
        ref={scrollRef}
        scrollEventThrottle={16}
        className={props.className}
      >
        {props.isLoading ? (
          <Loading />
        ) : (
          <>
            <Animated.View
              style={[
                { width: '100%', height: props.headerHeight },
                imageAnimatedStyle,
              ]}
            >
              {props.headerChildren}
            </Animated.View>
            {props.children}
          </>
        )}
      </Animated.ScrollView>
    </>
  );
};

export default StickyHeader;
