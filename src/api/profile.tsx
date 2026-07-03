import axiosHelper from './axiosHelper';

export interface ProfileResponse {
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  tdee?: number;
  targetWeight?: number | null;
  targetCalories?: number;
}

export interface ProfileUpdateParams {
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  targetWeight?: number | null;
}

export const getProfileAPI = () => {
  return axiosHelper.get<any, ProfileResponse>('/api/profile');
};

export const updateProfileAPI = (data: ProfileUpdateParams) => {
  return axiosHelper.put<any, void>('/api/profile', data);
};
