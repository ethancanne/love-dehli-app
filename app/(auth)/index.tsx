import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View className="flex flex-col items-center justify-center h-full gap-4">
      <Link href="/sign-in" className="text-2xl uppercase font-impact">
        <Text className="color-primary-300">Sign In</Text>
      </Link>
      <Link href="/sign-up">
        <Text>Sign Up</Text>
      </Link>

      <Link href="/event-list">
        <Text>Tabs</Text>
      </Link>
    </View>
  );
}
