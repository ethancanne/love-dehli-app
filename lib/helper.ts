import { User } from '@/types';

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
