import axiosInstance from './axiosInstance';

export const login = async (email, password) => {
  const { data } = await axiosInstance.post('/auth/login', { email, password });
  return data;
};

export const register = async (name, email, password, role) => {
  const { data } = await axiosInstance.post('/auth/register', { name, email, password, role });
  return data;
};

export const getMe = async () => {
  const { data } = await axiosInstance.get('/auth/me');
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await axiosInstance.put('/users/profile', profileData);
  return data;
};
