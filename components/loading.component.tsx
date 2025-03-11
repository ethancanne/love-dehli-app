import { View, ActivityIndicator } from 'react-native';

const Loading = () => {
  return (
    <View className="flex items-center justify-center w-full h-full">
      <ActivityIndicator size="large" color={'#D91111'} />
    </View>
  );
};

export default Loading;
