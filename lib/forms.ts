import { Application, EditData } from '@/types';

export const userInformation = [
  {
    name: 'name',
    title: 'Name',
    placeholder: 'Enter your name',
    rules: { required: 'Name is required' },
  },
  {
    name: 'phoneNumber',
    title: 'Phone Number',
    placeholder: 'Enter your phone number',
    rules: { required: 'Phone number is required' },
  },
  {
    name: 'email',
    title: 'Email',
    placeholder: 'Enter your email',
    rules: { required: 'Email is required' },
  },
];

export const applicationEditData = (application: Application) =>
  [
    {
      name: 'newStatus',
      title: 'Status',
      placeholder: 'Enter event status',
      rules: { required: 'Event status is required' },
      inputType: 'select',
      defaultValue: application.status,
      options: [
        { label: 'Accepted', value: 'Accepted' },
        { label: 'Declined', value: 'Declined' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Cancelled', value: 'Cancelled' },
      ],
    },
    {
      name: 'message',
      title: 'Message',
      defaultValue: application.message,
      placeholder: 'Enter event message',
      rules: { required: 'Application message is required' },
    },
  ] as EditData[];
