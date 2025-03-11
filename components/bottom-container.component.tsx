import { useEffect, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Loading from './loading.component';

type Props = {
  children: React.ReactNode;
  before?: React.ReactNode;
  loading?: boolean;
  subtle?: boolean;
};

const BottomContainer = (props: Props) => {
  const keyboard = useAnimatedKeyboard();
  const scrollViewHeight = useSharedValue(0);
  const [activeInputY, setActiveInputY] = useState(0);
  const currentViewPos = useSharedValue(0);

  const { height: deviceHeight } = useWindowDimensions();

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      // Get the currently focused input
      const focusedInput = TextInput.State.currentlyFocusedInput();

      if (focusedInput) {
        setTimeout(() => {
          const focusedInput = TextInput.State.currentlyFocusedInput();
          if (focusedInput) {
            focusedInput.measureInWindow((x, y, width, height) => {
              setActiveInputY(y);
            });
          }
        }, 0);
      }
    });

    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setActiveInputY(0);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const keyboardHeight = keyboard.height.value;
    const topOfKeyboard = deviceHeight - keyboardHeight - 40; // Top of the keyboard with a little buffer

    let translateYValue = 0;

    if (keyboardHeight < 200) {
      currentViewPos.set(0);
    }

    if (keyboardHeight > 0 && activeInputY > topOfKeyboard) {
      // Calculate how much to move up
      translateYValue = topOfKeyboard - activeInputY - 50;
      currentViewPos.set(translateYValue);
    }

    return {
      height: scrollViewHeight.value + 90,
      transform: [
        { translateY: withTiming(currentViewPos.get(), { duration: 200 }) },
      ],
    };
  });

  const handleContentSizeChange = (_: number, contentHeight: number) => {
    const newHeight = contentHeight;
    scrollViewHeight.value = withTiming(newHeight, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  return (
    <View className="absolute bottom-0 w-full">
      <View className="min-h-fit">
        {props.before}

        <Animated.View
          style={[animatedContainerStyle]}
          className={'overflow-hidden'}
        >
          <ScrollView
            onContentSizeChange={handleContentSizeChange}
            className={`p-10 bg-white rounded-t-[80px] mx-[-20px] mb-[-10px] ${
              props.subtle
                ? 'border-gray-500 border-hairline rounded-t-[40px]'
                : 'border-8 border-primary-400 rounded-t-[80px]'
            }`}
          >
            {props.loading ? (
              <Loading />
            ) : (
              <View key={'view'}>{props.children}</View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
      {/* </View> */}
    </View>
  );
};

export default BottomContainer;
