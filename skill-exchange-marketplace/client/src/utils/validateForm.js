export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePassword = (password) => password && password.length >= 6;
export const validateRequired = (value) => value && value.toString().trim().length > 0;

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!validateEmail(email)) errors.email = 'Please enter a valid email';
  if (!password) errors.password = 'Password is required';
  return errors;
};

export const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!validateRequired(name)) errors.name = 'Name is required';
  if (!validateEmail(email)) errors.email = 'Please enter a valid email';
  if (!validatePassword(password)) errors.password = 'Password must be at least 6 characters';
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

export const validateSkillForm = ({ title, description, category, availability }) => {
  const errors = {};
  if (!validateRequired(title)) errors.title = 'Title is required';
  if (!validateRequired(description)) errors.description = 'Description is required';
  if (!category) errors.category = 'Category is required';
  if (!availability) errors.availability = 'Availability is required';
  return errors;
};
