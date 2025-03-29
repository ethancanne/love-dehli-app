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
export async function login(data: { email: string; password: string }) {
  try {
    const loggedIn = await account.createEmailPasswordSession(
      data.email,
      data.password
    );
    if (!loggedIn) {
      return toast(JSON.stringify(loggedIn));
    }
    toast('Welcome back. You are logged in');
  } catch (e: any) {
    return toast(e.message);
  }
}

export async function logout() {
  try {
    await account.deleteSession('current');

    toast('Logged out');
  } catch (e: any) {
    return toast(e.message);
  }
}

export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  confirmPassword: string;
}) {
  if (data.password !== data.confirmPassword) {
    return toast('Passwords do not match');
  }
  console.log(JSON.stringify(data));

  try {
    await account.create(
      ID.unique(),
      data.email,
      data.password,
      data.firstName + ' ' + data.lastName
    );

    await login({ email: data.email, password: data.password });

    await account.updatePhone(data.phoneNumber, data.password);
    await account.updatePrefs({
      role: 'user',
    });
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
      toast('User updated');

      return true;
    }
    toast(`Error updating user: ${error.message}`);
    throw error;
  }
}

//EVENTS

export async function createEvent(data: Event) {
  try {
    const response = await databases.createDocument(
      config.databaseID!,
      config.eventsCollectionID!,
      ID.unique(),
      data
    );
    return response as Event;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateEvent(data: Event) {
  try {
    const response = await databases.updateDocument(
      config.databaseID!,
      config.eventsCollectionID!,
      useUIStore.getState().editViewOptions.editDataId!,
      {
        title: data.title,
        theme: data.theme,
        description: data.description,
        startDateTime: data.startDateTime,
        image: data.image,
        location: data.location,
      }
    );
    return response as Event;
  } catch (error) {
    console.error(error);
    return null;
  }
}

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

export async function getRegisteredEvents() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }

    let scheduledEvents: Event[] = (
      await databases.listDocuments(
        config.databaseID!,
        config.eventsCollectionID!,
        [Query.contains('registrations', user.$id)]
      )
    ).documents as Event[];

    return scheduledEvents;
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
    return response as Event;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function registerForEvent(eventId: string) {
  try {
    console.log("DOIN' my best");

    const response = await databases.updateDocument(
      config.databaseID!,
      config.eventsCollectionID!,
      eventId,
      {
        registrations: [(await account.get()).$id],
      }
    );

    console.log(response);

    return response as Event;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ------ APPLICATIONS

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
        newStatus: 'Pending',
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

export async function getApplicationForEvent(
  eventId: string,
  performerProfileId: string
) {
  try {
    const response = await databases.listDocuments(
      config.databaseID!,
      config.applicationCollectionID!,
      [
        Query.equal('event', eventId),
        Query.equal('performerProfile', performerProfileId),
      ]
    );

    if (response.total === 0) {
      return {} as Application;
    }

    return response.documents[0] as Application;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function changeApplicationStatus(data: {
  applicationId: string;
  newStatus: ApplicationStatus;
  message?: string;
}) {
  try {
    const response = await databases.updateDocument(
      config.databaseID!,
      config.applicationCollectionID!,
      data.applicationId || useUIStore.getState().editViewOptions.editDataId!,
      {
        status: data.newStatus,
        message: data.message,
      }
    );
    return response;
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

    return response as PerformerProfile;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editPerformerProfile(data: PerformerProfile) {
  try {
    const response = await databases.updateDocument(
      config.databaseID!,
      config.performerProfileCollectionID!,
      useUIStore.getState().editViewOptions.editDataId!,
      {
        stageName: data.stageName,
        bio: data.bio,
      }
    );

    return response as PerformerProfile;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCurrentPerformerProfile() {
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
    throw error;
  }
}

export async function getAllPerformerProfiles(search?: string) {
  try {
    const response = await databases.listDocuments(
      config.databaseID!,
      config.performerProfileCollectionID!,
      search
        ? [
            Query.or([
              Query.search('stageName', search),
              Query.search('bio', search),
            ]),
          ]
        : undefined
    );

    if (response.total === 0) {
      return null;
    } else return response.documents as PerformerProfile[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPerformerProfile(id: string) {
  try {
    const response = await databases.getDocument(
      config.databaseID!,
      config.performerProfileCollectionID!,
      id
    );

    if (response.total === 0) {
      return null;
    } else return response as PerformerProfile;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
