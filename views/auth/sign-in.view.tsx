import { Text, TextInput, View } from 'react-native';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import BottomContainer from '@/components/bottom-container.component';
import Input from '@/components/input.component';
import Button from '@/components/button.component';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useLogin } from '@/lib/state/user-queries';
import Loading from '@/components/loading.component';

type Inputs = {
  email: string;
  password: string;
};

const SignInView = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as Inputs,
  });

  const { mutate: login, isPending } = useLogin();
  const onSubmit = async (data: any) => {
    login({ email: data.email, password: data.password });
  };

  if (isPending) {
    return (
      <Animated.View
        className="flex items-center justify-center w-full max-h-full"
        entering={FadeInRight.delay(100)}
        exiting={FadeOutLeft}
      >
        <Loading text="Signing in..." />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      className="flex items-center justify-center w-full max-h-full"
      entering={FadeInRight.delay(100)}
      exiting={FadeOutLeft}
    >
      <Input
        control={control}
        placeholder="Email"
        name="email"
        title="Email"
        textProps={{
          keyboardType: 'email-address',
          autoCapitalize: 'none',
          autoCorrect: false,
        }}
        error={errors.email?.message}
      />
      <Input
        control={control}
        placeholder="Password"
        name="password"
        title="Password"
        textProps={{
          secureTextEntry: true,
        }}
        error={errors.password?.message}
      />

      <Button text="Submit" onPress={handleSubmit(onSubmit)} color="red" />
    </Animated.View>
  );
};

export default SignInView;
