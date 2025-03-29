import { View, Text } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import Button from './button.component';
type ConfirmationViewProps = {
  mainText: string;
  subText: string;
  icon: React.ReactNode;
  message?: string;
  showButton: boolean;
  onPress: () => void;
  buttonText: string;
  buttonColor: 'red' | 'black' | 'white' | 'green';
};
const ConfirmationView = (props: ConfirmationViewProps) => (
  <Animated.View
    entering={FadeInRight.delay(100)}
    exiting={FadeOutLeft.duration(200)}
    className={'z-20'}
  >
    <View className="flex flex-row items-center justify-center gap-5 mb-10">
      {props.icon}
      <View className="flex flex-col items-start justify-center  max-w-[80%]  ">
        <Text className="text-lg font-sfBold">{props.mainText}</Text>
        <Text className="text-lg font-sfLight">{props.subText}</Text>
      </View>
    </View>
    {props.message ? (
      <Text className="my-5 text-md font-sfLight">{props.message}</Text>
    ) : null}
    {props.showButton ? (
      <Button
        text={props.buttonText}
        onPress={props.onPress}
        color={props.buttonColor}
        small
      />
    ) : null}
  </Animated.View>
);

export default ConfirmationView;
