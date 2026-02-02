import { ChangeProfileFormData, ChangeProfileFormErrors } from '../types';

export const validateChangeProfileForm = (formData: ChangeProfileFormData) => {
  const newErrors: ChangeProfileFormErrors = {};

  if (/\S+@\S+\.\S+/.test(formData.name))
    newErrors.name = 'Email is not acceptable as a valid name';

  if (formData.name.length > 50) newErrors.name = 'Name is too long';

  if (!formData.name || typeof formData.name !== 'string')
    newErrors.name = 'Enter a valid name, e.g: Jane Doe';

  return newErrors;
};
