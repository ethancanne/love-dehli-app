import { useForm, useWatch } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import Input from '@/components/input.component';
import Button from '@/components/button.component';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useRegisterUser } from '@/lib/state/user-queries';
import Loading from '@/components/loading.component';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

type Inputs = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
};

const SignUpView = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as Inputs,
  });

  const { mutate: registerUser, isPending } = useRegisterUser();
  const onSubmit = async (data: any) => {
    registerUser({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      confirmPassword: data.confirmPassword,
    });
  };

  const watch = useWatch({
    control,
  });

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
        textProps={{
          autoCapitalize: 'none',
          keyboardType: 'email-address',
          autoCorrect: false,
        }}
      />
      <Input
        control={control}
        placeholder="Phone Number"
        name="phoneNumber"
        inputType="phone"
        textProps={{
          keyboardType: 'phone-pad',
          autoCorrect: false,
        }}
        rules={{
          pattern: {
            value:
              /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
            message: 'Invalid phone number',
          },
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
        textProps={{ secureTextEntry: true, autoCorrect: false }}
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
        textProps={{ secureTextEntry: true, autoCorrect: false }}
        error={errors.confirmPassword?.message}
      />
      <Button text="Submit" onPress={handleSubmit(onSubmit)} color="red" />
    </Animated.View>
  );
};

export default SignUpView;
