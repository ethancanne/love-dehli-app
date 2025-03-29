import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import Button from '@/components/button.component';
import { useQueryClient } from '@tanstack/react-query';
import InfoList from '@/components/info-list.component';
import {
  useCurrentUser,
  useLogout,
  useUpdateCurrentUser,
} from '@/lib/state/user-queries';
import { FontAwesome } from '@expo/vector-icons';
import { useUIStore } from '@/lib/state/ui-state';
import { InformationList } from '@/types';
import {
  useCreatePerformerProfile,
  useEditPerformerProfile,
  useCurrentPerformerProfile,
} from '@/lib/state/performer-profile-queries';
import {
  formatPhoneNumber,
  formatPhoneNumberIntl,
} from 'react-phone-number-input';

const Account = () => {
  const queryClient = useQueryClient();
  const { data: user, isLoading: userIsLoading } = useCurrentUser();
  const { data: performerProfileData, isLoading: performerProfileIsLoading } =
    useCurrentPerformerProfile();
  const { setEditViewOptions } = useUIStore((s) => s);

  const { mutate: logout, isPending: logoutIsPending } = useLogout();

  const performerProfile = [
    {
      label: 'Stage Name / Performer Name',
      value: performerProfileData?.stageName,
      formInput: {
        name: 'stageName',
        title: 'Stage Name / Performer Name',
        placeholder: 'Enter your stage name',
        rules: { required: 'Stage name is required' },
        defaultValue: performerProfileData?.stageName,
      },
    },
    {
      label: 'Bio',
      value: performerProfileData?.bio,
      formInput: {
        name: 'bio',
        title: 'Bio',
        placeholder: 'Enter your bio',
        rules: { required: 'Bio is required' },
        defaultValue: performerProfileData?.bio,
      },
    },
  ] as InformationList[];

  const userInformation = [
    {
      label: 'Name',
      value: user?.name,
      formInput: {
        name: 'name',
        title: 'Name',
        placeholder: 'Enter your name',
        // rules: { required: 'Name is required' },
        defaultValue: user?.name,
      },
    },
    {
      label: 'Email',
      value: user?.email,
      formInput: {
        name: 'email',
        title: 'Email',
        placeholder: 'Enter your email',
        // rules: { required: 'Email is required' },
        defaultValue: user?.email,
        passwordRequired: true,
      },
    },
    {
      label: 'Phone Number',
      value: formatPhoneNumberIntl(user?.phone ?? ''),
      formInput: {
        name: 'phone',
        title: 'Phone Number',
        inputType: 'phone',
        placeholder: 'Enter your phone number',
        // rules: { required: 'Phone number is required' },
        defaultValue: user?.phone,
        passwordRequired: true,
      },
    },
  ] as InformationList[];

  return (
    <ScrollView
      className="p-4 bg-white"
      contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
    >
      <View className="flex flex-col h-full gap-10">
        <InfoList
          data={userInformation}
          title="Personal Information"
          isLoading={userIsLoading}
          shouldShowEditButton={!!userInformation}
          onClickEdit={() => {
            setEditViewOptions({
              editViewIsOpen: true,
              editTitle: 'Edit Your Personal Information',
              editData: userInformation
                .map((item) => item.formInput)
                .filter((item) => item !== undefined),
              editMutateFn: useUpdateCurrentUser as any,
            });
          }}
        />

        <InfoList
          data={performerProfile}
          title="Performer Profile"
          isLoading={performerProfileIsLoading}
          shouldShowOverrideView={!performerProfileData}
          shouldShowEditButton={!!performerProfileData}
          overrideView={
            <View className="flex flex-col items-center justify-center gap-5 p-10">
              <FontAwesome name="microphone" size={50} color="#AC0000" />
              <Text className="text-lg text-center font-sfSemiBold">
                In order to apply as a performer at a Love Delhi event, you need
                performer profile
              </Text>
              <Text className="text-lg text-center font-sfBlack">
                Would you like to create one?
              </Text>
              <Button
                text="Create"
                color="black"
                onPress={() => {
                  setEditViewOptions({
                    editViewIsOpen: true,
                    editTitle: 'Setup Your Performer Profile',
                    editData: performerProfile
                      .map((item) => item.formInput)
                      .filter((item) => item !== undefined),
                    editMutateFn: useCreatePerformerProfile as any,
                  });
                }}
                small
              />
            </View>
          }
          onClickEdit={() => {
            setEditViewOptions({
              editViewIsOpen: true,
              editTitle: 'Edit Your Performer Profile',
              editDataId: performerProfileData?.$id,
              editData: performerProfile
                .map((item) => item.formInput)
                .filter((item) => item !== undefined),
              editMutateFn: useEditPerformerProfile as any,
            });
          }}
        />

        <Button
          text="Sign Out"
          onPress={() => {
            logout();
          }}
          color="red"
          small
        />
      </View>
    </ScrollView>
  );
};

export default Account;
