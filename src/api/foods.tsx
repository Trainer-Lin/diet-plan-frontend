import axiosHelper from './axiosHelper';

export interface FoodResponse {
  id: number;
  name: string;
  category: string;
  serving?: string;
  servingSize?: number | string;
  servingUnit?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags?: string[];
}

export interface CustomFoodCreateParams {
  name: string;
  category: string;
  servingUnit: string;
  servingSize: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const getFoodsAPI = () => {
  return axiosHelper.get<any, FoodResponse[]>('/api/foods');
};

export const searchFoodsAPI = (keyword: string) => {
  return axiosHelper.get<any, FoodResponse[]>(`/api/foods/search?keyword=${encodeURIComponent(keyword)}`);
};

export const createCustomFoodAPI = (data: CustomFoodCreateParams) => {
  return axiosHelper.post<any, void>('/api/foods/custom', data);
};
