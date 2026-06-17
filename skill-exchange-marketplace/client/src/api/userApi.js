import axiosInstance from './axiosInstance';

export const getUsers = async () => {
  const { data } = await axiosInstance.get('/users');
  return data.users || [];
};

export const updateUser = async (id, userData) => {
  const { data } = await axiosInstance.put(`/users/${id}`, userData);
  return data.user;
};

export const deleteUser = async (id) => {
  const { data } = await axiosInstance.delete(`/users/${id}`);
  return data;
};
