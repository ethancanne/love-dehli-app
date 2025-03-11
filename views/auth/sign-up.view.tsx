import { Text, TextInput, View } from 'react-native';
import { useForm, SubmitHandler, Controller, useWatch } from 'react-hook-form';
import { login, registerUser } from '@/lib/appwrite';
import { useQueryClient } from '@tanstack/react-query';
import BottomContainer from '@/components/bottom-container.component';
import Input from '@/components/input.component';
import Button from '@/components/button.component';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

type Inputs = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
};

const SignUpView = () => {
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
    await registerUser(
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.phoneNumber,
      data.confirmPassword,
      queryClient
    );
  };

  const watch = useWatch({
    control,
  });

  return (
    <Animated.View
      className="flex items-center justify-center w-full max-h-full"
      entering={FadeInRight.delay(100)}
      exiting={FadeOutLeft}
    >
      {/* register your input into the hook by invoking the "register" function */}

      <Input
        control={control}
        placeholder="Email"
        rules={{
          required: 'Email is required',
          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
        }}
        name="email"
        title="Email"
        error={errors.email?.message}
      />
      <Input
        control={control}
        placeholder="Phone Number"
        name="phoneNumber"
        rules={{
          pattern: { value: /^\S+$/i, message: 'Invalid phone number' },
        }}
        title="Phone Number"
        error={errors.phoneNumber?.message}
      />
      <Input
        control={control}
        placeholder="First Name"
        rules={{ required: 'First Name is required' }}
        name="firstName"
        title="First Name"
        error={errors.firstName?.message}
      />
      <Input
        control={control}
        placeholder="Last Name"
        name="lastName"
        rules={{ required: 'Last Name is required' }}
        title="Last Name"
        error={errors.lastName?.message}
      />
      <Input
        control={control}
        placeholder="Password"
        rules={{ required: 'Password is required', minLength: 6 }}
        name="password"
        title="Password"
        error={errors.password?.message}
      />
      <Input
        control={control}
        placeholder="Confirm Password"
        rules={{
          required: 'Confirm Password is required',

          validate: (value) =>
            value === watch.password || 'Passwords do not match',
        }}
        name="confirmPassword"
        title="Confirm Password"
        error={errors.confirmPassword?.message}
      />
      <Button text="Submit" onPress={handleSubmit(onSubmit)} color="red" />
    </Animated.View>
  );
};

export default SignUpView;
