import axiosInstance from './axiosInstance';

export const getSkills = async (search = '', category = '') => {
  const params = {};
  if (search) params.search = search;
  if (category) params.category = category;
  const { data } = await axiosInstance.get('/skills', { params });
  return data;
};

export const getSkillById = async (id) => {
  const { data } = await axiosInstance.get(`/skills/${id}`);
  return data;
};

export const createSkill = async (skillData) => {
  const { data } = await axiosInstance.post('/skills', skillData);
  return data;
};

export const updateSkill = async (id, skillData) => {
  const { data } = await axiosInstance.put(`/skills/${id}`, skillData);
  return data;
};

export const deleteSkill = async (id) => {
  const { data } = await axiosInstance.delete(`/skills/${id}`);
  return data;
};

export const getMySkills = async () => {
  const { data } = await axiosInstance.get('/skills/my-skills');
  return data;
};
