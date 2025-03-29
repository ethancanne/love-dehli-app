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
  registrations: string[];
  status?: string;
}

export interface User extends Models.User<Models.Preferences> {
  name: string;
  avatar: string;
  email: string;
}

export interface PerformerProfile extends Models.Document {
  stageName: string;
  bio: string;
  associatedUsers: string[];
  applications: Application[];
}

export type ApplicationStatus =
  | 'Pending'
  | 'Accepted'
  | 'Declined'
  | 'Cancelled';

export interface Application extends Models.Document {
  event: Event;
  performerProfile: PerformerProfile;
  status: ApplicationStatus;
  message: string;
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
  hidden?: boolean;
  inputType?: 'text' | 'datetime' | 'textarea' | 'select' | 'phone';
  options?: { label: string; value: string }[];
};

export type InformationList = {
  label?: string;
  value?: string;
  newLine?: boolean;
  formInput?: EditData;
  component?: React.ReactNode;
  hidden?: boolean;
  onPress?: () => void;
};
