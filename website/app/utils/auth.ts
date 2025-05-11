import Cookies from 'js-cookie';

export const getGovernmentId = (): string => {
  const userId = Cookies.get('user_id');
  if (!userId) {
    throw new Error('User ID not found in cookies. Please log in again.');
  }
  return userId;
};

export const getUserType = (): string => {
  const userType = Cookies.get('user_type');
  if (!userType) {
    throw new Error('User type not found in cookies. Please log in again.');
  }
  return userType;
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get('user_id') && !!Cookies.get('user_type');
};

export const clearAuthCookies = (): void => {
  Cookies.remove('user_id');
  Cookies.remove('user_type');
  Cookies.remove('transaction_id');
  Cookies.remove('scheme_id');
}; 