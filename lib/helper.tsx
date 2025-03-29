import { Application, User } from '@/types';
import { FontAwesome } from '@expo/vector-icons';

export function checkUserRole(
  user?: User | null,
  input: 'user' | 'admin' = 'admin'
) {
  if (!user) return false;

  const userRole = user?.prefs.role;
  if (userRole === input) {
    return true;
  }
  return false;
}

export const groupApplicationsByStatus = (
  applications?: any[],
  addStatus?: boolean
): {
  accepted?: Application[];
  declined?: Application[];
  pending?: Application[];
  cancelled?: Application[];
} => {
  if (!applications) {
    return {};
  }
  return {
    accepted: applications
      .filter((a) => a.status === 'Accepted')
      .map((a) => ({
        ...a,
        event: {
          ...a.event,
          status: addStatus ? a.status : undefined,
        },
      })),
    declined: applications
      .filter((a) => a.status === 'Declined')
      .map((a) => ({
        ...a,
        event: {
          ...a.event,
          status: addStatus ? a.status : undefined,
        },
      })),
    pending: applications
      .filter((a) => a.status === 'Pending')
      .map((a) => ({
        ...a,
        event: {
          ...a.event,
          status: addStatus ? a.status : undefined,
        },
      })),
    cancelled: applications
      .filter((a) => a.status === 'Cancelled')
      .map((a) => ({
        ...a,
        event: {
          ...a.event,
          status: addStatus ? a.status : undefined,
        },
      })),
  };
};

export const getApplicationStyle = (status: string) => {
  switch (status) {
    case 'Accepted':
      return {
        style: 'bg-green-100',
        secondStyle: 'bg-green-600',
        textColor: 'text-green-400',
        icon: <FontAwesome name="check-circle" size={20} color="green" />,
      };
    case 'Declined':
      return {
        style: 'bg-red-50',
        secondStyle: 'bg-red-200',
        textColor: 'text-red-300',
        icon: <FontAwesome name="close" size={20} color="red" />,
      };
    case 'Pending':
      return {
        style: 'bg-yellow-100',
        secondStyle: 'bg-yellow-200',
        textColor: 'text-yellow-200',
        icon: <FontAwesome name="clock-o" size={20} color="#D5B345" />,
      };
    case 'Cancelled':
      return {
        style: 'bg-slate-100 opacity-50',
        secondStyle: 'bg-black',
        textColor: 'text-black',
        icon: <FontAwesome name="ban" size={20} color="black" />,
      };
    default:
      return {
        style: 'bg-white',
        secondStyle: 'bg-black',
        textColor: 'text-black',
        icon: <FontAwesome name="ban" size={20} color="gray" />,
      };
  }
};
