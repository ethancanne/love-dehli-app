import { View, ActivityIndicator, Text } from 'react-native';

type Props = {
  text?: string;
};
const Loading = (props: Props) => {
  return (
    <View className="flex flex-col items-center justify-center gap-5 py-20">
      <ActivityIndicator size="large" color={'#D91111'} />
      {props.text ? (
        <Text className="text-md font-sfLight">{props.text}</Text>
      ) : null}
    </View>
  );
};

export default Loading;
