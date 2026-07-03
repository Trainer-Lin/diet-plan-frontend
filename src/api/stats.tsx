import axiosHelper from './axiosHelper';

export interface TodayStatsResponse {
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WeeklyCaloriesResponse {
  days: string[];
  calories: number[];
}

export interface WeeklyMacrosResponse {
  days: string[];
  protein: number[];
  carbs: number[];
  fat: number[];
}

export interface CheckinStatsResponse {
  completedDays: number;
  totalDays: number;
  statuses: string[];
}

export interface WeightTrendPointResponse {
  day: string;
  value: number;
  goalReached?: boolean;
}

export const getTodayStatsAPI = () => {
  return axiosHelper.get<any, TodayStatsResponse>('/api/stats/today');
};

export const getWeeklyCaloriesAPI = () => {
  return axiosHelper.get<any, WeeklyCaloriesResponse>('/api/stats/weekly-calories');
};

export const getWeeklyMacrosAPI = () => {
  return axiosHelper.get<any, WeeklyMacrosResponse>('/api/stats/weekly-macros');
};

export const getCheckinStatsAPI = () => {
  return axiosHelper.get<any, CheckinStatsResponse>('/api/stats/checkin');
};

export const getWeightTrendAPI = () => {
  return axiosHelper.get<any, WeightTrendPointResponse[]>('/api/stats/weight-trend');
};
