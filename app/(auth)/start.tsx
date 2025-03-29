import BottomContainer from '@/components/bottom-container.component';
import Button from '@/components/button.component';

import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import SignInView from '@/views/auth/sign-in.view';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeOut,
  FadeOutLeft,
} from 'react-native-reanimated';
import SignUpView from '@/views/auth/sign-up.view';
import { Images } from '@/constants/images';

export default function Index() {
  type View = {
    title: string;
    onPress?: () => void;
    color?: 'red' | 'black' | 'white';
    hideTitle?: boolean;
    container: JSX.Element;
    hideBackButton?: boolean;
    size?: 'small' | 'medium' | 'large';
  };

  const [currentView, setCurrentView] = useState(0);

  const views: View[] = [
    {
      title: 'Welcome',
      hideTitle: true,
      hideBackButton: true,
      size: 'medium',
      container: (
        <Animated.View
          entering={FadeInLeft.delay(100)}
          exiting={FadeOutLeft.duration(200)}
          className="flex items-center justify-center h-fit"
        >
          <Button
            text="Sign In"
            onPress={() =>
              setCurrentView(
                views.findIndex((view) => view.title === 'Sign In')
              )
            }
            color="red"
          />
          <Button
            text="Sign Up"
            onPress={() =>
              setCurrentView(
                views.findIndex((view) => view.title === 'Sign Up')
              )
            }
            color="black"
          />
        </Animated.View>
      ),
    },
    {
      title: 'Sign In',
      onPress: () => {},
      size: 'large',
      color: 'red',
      container: <SignInView />,
    },
    {
      title: 'Sign Up',
      onPress: () => {},
      size: 'large',
      color: 'black',
      container: <SignUpView />,
    },
  ];
  const words = ['Unite', 'Celebrate', 'Grow'];
  return (
    <BottomContainer
      className="h-full"
      before={
        views[currentView].hideTitle ? (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="flex flex-col justify-between flex-1 mb-3 ml-4"
          >
            <Image
              source={Images.LoveDelhiSmall}
              className="w-32 h-32 mt-32 ml-2 "
            />
            <View>
              {words.map((word, index) => (
                <Text
                  className="mb-2 text-6xl text-white font-sfThin"
                  key={index}
                >
                  {word}
                </Text>
              ))}
            </View>
          </Animated.View>
        ) : null
      }
    >
      {!views[currentView].hideTitle ? (
        <View className="flex flex-row items-center justify-start mb-6">
          <TouchableOpacity onPress={() => setCurrentView(0)}>
            <Entypo name="chevron-left" size={30} color="black" />
          </TouchableOpacity>
          <Text className="ml-2 text-4xl text-black uppercase font-impact">
            {views[currentView].title}
          </Text>
        </View>
      ) : null}
      {views[currentView].container}
    </BottomContainer>
  );
}
