export interface MacroItem {
  label: string;
  value: number;
  unit: string;
  progress: number;
  color: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  hint: string;
}

export interface MealFood {
  name: string;
  amount: string;
  calories: number;
}

export interface MealRecord {
  id: string;
  meal: string;
  time: string;
  totalCalories: number;
  note: string;
  foods: MealFood[];
}

export interface FoodLibraryItem {
  key: string;
  name: string;
  category: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
}

export interface WeightPoint {
  day: string;
  value: number;
  goalReached?: boolean;
}

export interface CheckinDay {
  day: string;
  status: 'done' | 'partial' | 'rest';
}

export interface GoalCard {
  title: string;
  value: string;
  description: string;
}

export interface ProfileFormValues {
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  targetWeight?: number | null;
}
