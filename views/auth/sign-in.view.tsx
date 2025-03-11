import { Text, TextInput, View } from 'react-native';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { login, registerUser } from '@/lib/appwrite';
import { useQueryClient } from '@tanstack/react-query';
import BottomContainer from '@/components/bottom-container.component';
import Input from '@/components/input.component';
import Button from '@/components/button.component';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

type Inputs = {
  email: string;
  password: string;
};

const SignInView = () => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as Inputs,
  });
  const onSubmit = async (data: any) => {
    await login(data.email, data.password, queryClient);
  };

  return (
    <Animated.View
      className="flex items-center justify-center w-full max-h-full"
      entering={FadeInRight.delay(100)}
      exiting={FadeOutLeft}
    >
      {/* register your input into the hook by invoking the "register" function */}
      <Input control={control} placeholder="Email" name="email" title="Email" />
      <Input
        control={control}
        placeholder="Password"
        name="password"
        title="Password"
      />

      <Button text="Submit" onPress={handleSubmit(onSubmit)} color="red" />
    </Animated.View>
  );
};

export default SignInView;
