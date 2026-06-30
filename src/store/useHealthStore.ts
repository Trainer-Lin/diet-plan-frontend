import { create } from 'zustand';
import {
  checkinDays,
  dashboardMetrics,
  foodLibraryItems,
  goalCards,
  healthyHabits,
  macroItems,
  mealRecords,
  monthlyCompletion,
  weeklyCalories,
  weeklyMacroTrend,
  weightTrend,
  calculateTdee,
} from '../utils/mockData';
import { ProfileFormValues } from '../types/health';

interface HealthStore {
  token: string | null;
  profile: ProfileFormValues;
  tdee: number;
  dashboardMetrics: typeof dashboardMetrics;
  macroItems: typeof macroItems;
  mealRecords: typeof mealRecords;
  foodLibraryItems: typeof foodLibraryItems;
  weeklyCalories: number[];
  weeklyMacroTrend: typeof weeklyMacroTrend;
  monthlyCompletion: number[];
  weightTrend: typeof weightTrend;
  checkinDays: typeof checkinDays;
  goalCards: typeof goalCards;
  healthyHabits: string[];
  login: (token: string) => void;
  logout: () => void;
  updateProfile: (values: ProfileFormValues) => void;
}

const storedToken = localStorage.getItem('token');

const defaultProfile: ProfileFormValues = {
  gender: 'male',
  age: 24,
  height: 175,
  weight: 68,
  activity: 'moderate',
};

export const useHealthStore = create<HealthStore>((set) => ({
  token: storedToken,
  profile: defaultProfile,
  tdee: calculateTdee(defaultProfile),
  dashboardMetrics,
  macroItems,
  mealRecords,
  foodLibraryItems,
  weeklyCalories,
  weeklyMacroTrend,
  monthlyCompletion,
  weightTrend,
  checkinDays,
  goalCards,
  healthyHabits,
  login: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null });
  },
  updateProfile: (values) => {
    set({
      profile: values,
      tdee: calculateTdee(values),
    });
  },
}));
