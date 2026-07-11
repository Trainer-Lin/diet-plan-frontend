import axiosHelper from './axiosHelper';

// ===== 用户管理 =====
export interface AdminUserItem {
  id: number;
  username: string;
  email: string;
  nickname: string;
  role: string;
  createdAt: string;
}

export interface AdminUserUpdateParams {
  nickname?: string;
  email?: string;
  role: string;
}

export const adminListUsersAPI = () => {
  return axiosHelper.get<any, AdminUserItem[]>('/api/admin/users');
};

export const adminUpdateUserAPI = (id: number, data: AdminUserUpdateParams) => {
  return axiosHelper.put<any, AdminUserItem>(`/api/admin/users/${id}`, data);
};

export const adminDeleteUserAPI = (id: number) => {
  return axiosHelper.delete<any, void>(`/api/admin/users/${id}`);
};

// ===== 食物库管理 =====
export interface AdminFoodParams {
  name: string;
  category: string;
  servingUnit: string;
  servingSize: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodResponse {
  id: number;
  name: string;
  category: string;
  serving?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags?: string[];
}

export const adminListOfficialFoodsAPI = () => {
  return axiosHelper.get<any, FoodResponse[]>('/api/admin/foods');
};

export const adminCreateFoodAPI = (data: AdminFoodParams) => {
  return axiosHelper.post<any, FoodResponse>('/api/admin/foods', data);
};

export const adminUpdateFoodAPI = (id: number, data: AdminFoodParams) => {
  return axiosHelper.put<any, FoodResponse>(`/api/admin/foods/${id}`, data);
};

export const adminDeleteFoodAPI = (id: number) => {
  return axiosHelper.delete<any, void>(`/api/admin/foods/${id}`);
};

// ===== 用户自定义食物管理 =====
export interface CustomFoodItem {
  id: number;
  name: string;
  category: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdBy: number | null;
  creatorUsername: string;
  creatorNickname: string;
  createdAt: string;
}

export const adminListCustomFoodsAPI = () => {
  return axiosHelper.get<any, CustomFoodItem[]>('/api/admin/foods/custom');
};

export const adminDeleteCustomFoodAPI = (id: number) => {
  return axiosHelper.delete<any, void>(`/api/admin/foods/${id}`);
};

// ===== 用户档案管理 =====
export interface AdminUserProfileItem {
  userId: number;
  username: string;
  nickname: string;
  role: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  activity: string;
  tdee: number;
  targetWeight: number | null;
  targetCalories: number | null;
}

export interface UserProfileUpdateRequest {
  gender: string;
  age: number;
  height: number;
  weight: number;
  activity: string;
  targetWeight: number | null;
}

export const adminGetUserProfileAPI = (userId: number) => {
  return axiosHelper.get<any, AdminUserProfileItem>(`/api/admin/users/${userId}/profile`);
};

export const adminUpdateUserProfileAPI = (userId: number, data: UserProfileUpdateRequest) => {
  return axiosHelper.put<any, AdminUserProfileItem>(`/api/admin/users/${userId}/profile`, data);
};

// ===== 用户记录查看 =====
export interface DietRecordItem {
  id: number;
  foodName: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AdminUserDietRecord {
  id: number;
  recordDate: string;
  mealType: string;
  note: string;
  totalCalories: number;
  createdAt: string;
  items: DietRecordItem[];
}

export interface AdminUserWeightRecord {
  id: number;
  recordDate: string;
  weight: number;
  bmi: number;
}

export const adminGetUserDietRecordsAPI = (userId: number) => {
  return axiosHelper.get<any, AdminUserDietRecord[]>(`/api/admin/users/${userId}/diet-records`);
};

export const adminGetUserWeightRecordsAPI = (userId: number) => {
  return axiosHelper.get<any, AdminUserWeightRecord[]>(`/api/admin/users/${userId}/weight-records`);
};

// ===== 系统统计 =====
export interface ActiveUserItem {
  userId: number;
  username: string;
  nickname: string;
  recordCount: number;
}

export interface SystemStats {
  totalUsers: number;
  totalFoods: number;
  totalRecords: number;
  totalWeightRecords: number;
  adminCount: number;
  topActiveUsers: ActiveUserItem[];
}

export const getSystemStatsAPI = () => {
  return axiosHelper.get<any, SystemStats>('/api/admin/stats/system');
};
