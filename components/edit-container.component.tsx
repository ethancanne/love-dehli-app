import { View, Text, TouchableOpacity } from 'react-native';
import BottomContainer from './bottom-container.component';
import Animated, {
  FadeIn,
  FadeOut,
  FadeOutDown,
} from 'react-native-reanimated';
import { useUIStore } from '@/lib/state/ui-state';
import Input from './input.component';
import { Entypo } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import Button from './button.component';
import { useEffect, useState } from 'react';
import Loading from './loading.component';
import { useQueryClient } from '@tanstack/react-query';

const EditContainer = () => {
  const { editData, editTitle, closeEditView, editMutateFn } = useUIStore();
  const [passwordPopupIsOpen, setPasswordPopupIsOpen] = useState(false);

  const { isPending, mutate, isSuccess } = editMutateFn!();

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: editData.reduce((acc: any, item) => {
      acc[item.name] = item.defaultValue;
      return acc;
    }, {}),
  });

  if (isSuccess) {
    closeEditView();
    queryClient.invalidateQueries();
  }

  return (
    <>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        className="absolute top-0 left-0 w-full h-full bg-[#000000d8]"
      ></Animated.View>

      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOutDown}>
        <BottomContainer loading={isPending}>
          <TouchableOpacity onPress={() => closeEditView()}>
            <Entypo name="chevron-left" size={30} color="#D91111" />
          </TouchableOpacity>
          <Text className="w-full p-5 mb-10 text-2xl text-center font-sfBlack">
            {passwordPopupIsOpen
              ? 'Enter Password to confirm changes'
              : editTitle}
          </Text>

          {passwordPopupIsOpen ? (
            <Input
              control={control}
              placeholder="Password"
              name="password"
              rules={{ required: 'Password is required' }}
              title="Password"
              error={errors.password?.message as string}
            />
          ) : (
            editData.map((item, index) => {
              return (
                <Input
                  key={index}
                  {...item}
                  control={control}
                  error={errors[item.name]?.message as string}
                />
              );
            })
          )}

          <Button
            text="Submit"
            onPress={handleSubmit((data) => {
              if (
                Object.keys(dirtyFields).some((key) =>
                  editData.some(
                    (item) => item.passwordRequired && item.name === key
                  )
                )
              ) {
                if (data.password) {
                  mutate(data);
                } else {
                  setPasswordPopupIsOpen(true);
                }
              } else {
                mutate(data);
              }
            })}
            color="red"
          />
        </BottomContainer>
      </Animated.View>
    </>
  );
};

export default EditContainer;
