import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import Button from '@/components/button.component';
import { logout } from '@/lib/appwrite';
import { useQueryClient } from '@tanstack/react-query';
import InfoList from '@/components/info-list.component';
import { useCurrentUser, useUpdateCurrentUser } from '@/lib/state/user-queries';
import { FontAwesome } from '@expo/vector-icons';
import { useUIStore } from '@/lib/state/ui-state';
import Loading from '@/components/loading.component';
import { InformationList } from '@/types';
import {
  useCreatePerformerProfile,
  useEditPerformerProfile,
  usePerformerProfile,
} from '@/lib/state/performer-profile-queries';

const Account = () => {
  const queryClient = useQueryClient();
  const { data: user, isLoading: userIsLoading } = useCurrentUser();
  const { data: performerProfileData, isLoading: performerProfileIsLoading } =
    usePerformerProfile();
  const {
    openEditView,
    setEditData,
    setEditTitle,
    setEditMutateFn,
    setEditDataId,
  } = useUIStore((s) => s);

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
      value: user?.phone,
      formInput: {
        name: 'phone',
        title: 'Phone Number',
        placeholder: 'Enter your phone number',
        // rules: { required: 'Phone number is required' },
        defaultValue: user?.phone,
        passwordRequired: true,
      },
    },
  ] as InformationList[];

  return (
    <ScrollView
      className="p-4"
      contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
    >
      <View className="flex flex-col h-full gap-10">
        <InfoList
          data={userInformation}
          title="Personal Information"
          isLoading={userIsLoading}
          shouldShowEditButton={!!userInformation}
          onClickEdit={() => {
            setEditData(userInformation.map((item) => item.formInput));
            setEditTitle('Edit Your Personal Information');
            setEditMutateFn(useUpdateCurrentUser as any);
            openEditView();
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
                  setEditData(performerProfile.map((item) => item.formInput));
                  setEditTitle('Setup Your Performer Profile');
                  setEditMutateFn(useCreatePerformerProfile as any);
                  openEditView();
                }}
                small
              />
            </View>
          }
          onClickEdit={() => {
            setEditData(performerProfile.map((item) => item.formInput));
            setEditDataId(performerProfileData?.$id!);
            setEditTitle('Edit Your Performer Profile');
            setEditMutateFn(useEditPerformerProfile as any);
            openEditView();
          }}
        />

        <Button
          text="Sign Out"
          onPress={() => {
            logout(queryClient);
          }}
          color="red"
          small
        />
      </View>
    </ScrollView>
  );
};

export default Account;
