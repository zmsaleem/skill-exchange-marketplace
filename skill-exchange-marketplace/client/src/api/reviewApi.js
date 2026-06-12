import axiosInstance from './axiosInstance';

export const createReview = async (reviewData) => {
  const { data } = await axiosInstance.post('/reviews', reviewData);
  return data;
};

export const getSkillReviews = async (skillId) => {
  const { data } = await axiosInstance.get(`/reviews/skill/${skillId}`);
  return data;
};

export const getInstructorReviews = async (instructorId) => {
  const { data } = await axiosInstance.get(`/reviews/instructor/${instructorId}`);
  return data;
};
