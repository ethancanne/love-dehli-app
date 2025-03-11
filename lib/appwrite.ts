import {
  Avatars,
  Client,
  Account,
  OAuthProvider,
  Databases,
  Query,
  ID,
} from 'react-native-appwrite';
import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from 'expo-web-browser';
import { toast } from './toast';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import {
  Application,
  ApplicationStatus,
  Event,
  PerformerProfile,
  User,
} from '@/types';
import { useUIStore } from './state/ui-state';

export const config = {
  platform: 'com.cannelongo.lovedelhi',
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  eventsCollectionID: process.env.EXPO_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID,
  applicationCollectionID:
    process.env.EXPO_PUBLIC_APPWRITE_APPLICATION_COLLECTION_ID,
  performerProfileCollectionID:
    process.env.EXPO_PUBLIC_APPWRITE_PERFORMER_PROFILE_COLLECTION_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

//USERS
export async function login(
  email: string,
  password: string,
  queryClient: QueryClient
) {
  try {
    const loggedIn = await account.createEmailPasswordSession(email, password);
    if (!loggedIn) {
      return toast('NOPE');
    }

    queryClient.invalidateQueries({ queryKey: ['user'] });
    queryClient.refetchQueries({ queryKey: ['user'] });

    toast('Welcome back. You are logged in');
  } catch (e: any) {
    return toast(e.message);
  }
}

export async function logout(queryClient: QueryClient) {
  try {
    await account.deleteSession('current');
    queryClient.invalidateQueries({ queryKey: ['user'] });
    queryClient.refetchQueries({ queryKey: ['user'] });
    toast('Logged out');
  } catch (e: any) {
    return toast(e.message);
  }
}

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  confirmPassword: string,
  queryClient: QueryClient
) {
  if (password !== confirmPassword) {
    return toast('Passwords do not match');
  }

  try {
    await account.create(
      ID.unique(),
      email,
      password,
      firstName + ' ' + lastName
    );
    await account.updatePrefs({
      phoneNumber: phoneNumber, // Custom field in user preferences
    });
    await login(email, password, queryClient);

    queryClient.invalidateQueries({ queryKey: ['user'] });
    queryClient.refetchQueries({ queryKey: ['user'] });
    toast('Account created');
  } catch (e: any) {
    return toast(e.message);
  }
}

export async function getCurrentUser() {
  try {
    const response = await account.get();

    if (response.$id) {
      const userAvatar = avatar.getInitials(response.name);

      return { ...response, avatar: userAvatar.toString() } as User;
    }
    return null;
  } catch (error: any) {
    console.log('OMG, this is the error: ', error.message);
    return null;
  }
}

export async function updateUser(data: User) {
  try {
    // toast(`Updating user with new data ${JSON.stringify(data)}`);
    if (data.name) await account.updateName(data.name);
    if (data.password) {
      if (data.phone) await account.updatePhone(data.phone, data.password);
      if (data.email) await account.updateEmail(data.email, data.password);
    }
    toast('User updated');
    return true;
  } catch (error: any) {
    if (error.message === 'A target with the same ID already exists.') {
      //Don't understand this error!
      console.log('YEah I got this error: ', error.message);
      toast('User updated');

      return true;
    }
    toast(`Error updating user: ${error.message}`);
    console.log('OMG, this is the error: ', error.message);
    throw error;
  }
}

//EVENTS

export async function getEvents() {
  try {
    const response = await databases.listDocuments(
      config.databaseID!,
      config.eventsCollectionID!,
      [Query.orderAsc('$createdAt')]
    );
    return response.documents as Event[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getEvent(id: string) {
  try {
    const response = await databases.getDocument(
      config.databaseID!,
      config.eventsCollectionID!,
      id
    );
    console.log(response);

    return response as Event;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function applyAsPerformer(data: {
  eventId: string;
  performerProfileId: string;
}) {
  try {
    //Make sure they are not already applied
    const existingResponse = await databases.listDocuments(
      config.databaseID!,
      config.applicationCollectionID!,
      [
        Query.equal('event', data.eventId),
        Query.equal('performerProfile', data.performerProfileId),
      ]
    );
    if (existingResponse.total > 0) {
      //change status to accepted
      await changeApplicationStatus({
        applicationId: existingResponse.documents[0].$id,
        newStatus: 'Submitted',
      });
      return existingResponse.documents[0] as Application;
    }

    const applicationResponse = await databases.createDocument(
      config.databaseID!,
      config.applicationCollectionID!,
      ID.unique(),
      {
        event: data.eventId,
        performerProfile: data.performerProfileId,
      }
    );

    return applicationResponse as Event;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getApplicationForEvent(eventId: string) {
  try {
    const response = await databases.listDocuments(
      config.databaseID!,
      config.applicationCollectionID!,
      [Query.equal('event', eventId)]
    );
    return response.documents[0] as Application;
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function changeApplicationStatus(data: {
  applicationId: string;
  newStatus: ApplicationStatus;
}) {
  try {
    const response = await databases.updateDocument(
      config.databaseID!,
      config.applicationCollectionID!,
      data.applicationId,
      {
        status: data.newStatus,
      }
    );
    console.log(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//PERFORMER Profile
export async function createPerformerProfile(data: PerformerProfile) {
  try {
    const response = await databases.createDocument(
      config.databaseID!,
      config.performerProfileCollectionID!,
      ID.unique(),
      {
        stageName: data.stageName,
        bio: data.bio,
        associatedUsers: [(await account.get()).$id],
      }
    );
    console.log(response);

    return response as PerformerProfile;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editPerformerProfile(data: PerformerProfile) {
  try {
    console.log('WHY IS THIS', useUIStore.getState().editDataId!);

    const response = await databases.updateDocument(
      config.databaseID!,
      config.performerProfileCollectionID!,
      useUIStore.getState().editDataId!,
      {
        stageName: data.stageName,
        bio: data.bio,
      }
    );
    console.log(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPerformerProfile() {
  try {
    const response = await databases.listDocuments(
      config.databaseID!,
      config.performerProfileCollectionID!,
      [Query.contains('associatedUsers', [(await account.get()).$id])]
    );
    if (response.total === 0) {
      return null;
    } else return response.documents[0] as PerformerProfile;
  } catch (error) {
    console.error(error);
    return null;
  }
}
