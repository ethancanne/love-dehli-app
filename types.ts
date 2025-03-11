import { RegisterOptions } from 'react-hook-form';
import { Models } from 'react-native-appwrite';

export interface Event extends Models.Document {
  title: string;
  theme: string;

  startDateTime: string;
  description: string;
  image: string;
  location: string;
  applications: Application[];
}

export interface User extends Models.User<Models.Preferences> {
  name: string;
  avatar: string;
  email: string;
  phoneNumber: string;
}

export interface PerformerProfile extends Models.Document {
  stageName: string;
  bio: string;
  associatedUsers: string[];
  applications: Application[];
}

export type ApplicationStatus =
  | 'Submitted'
  | 'Accepted'
  | 'Not Selected'
  | 'Cancelled';

export interface Application extends Models.Document {
  event: Event;
  performerProfile: PerformerProfile;
  status: ApplicationStatus;
}

export type EditData = {
  placeholder: string;
  name: string;
  title: string;
  rules?: RegisterOptions;
  error?: string;
  focused?: boolean;
  defaultValue?: string;
  passwordRequired?: boolean;
};

export type InformationList = {
  label: string;
  value?: string;
  newLine?: boolean;
  formInput?: EditData;
};
