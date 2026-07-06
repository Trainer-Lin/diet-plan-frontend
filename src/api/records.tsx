import axiosHelper from './axiosHelper';

export interface DietRecordItemResponse {
  id: number;
  name: string;
  amount: string;
  calories: number;
}

export interface DailyDietRecordResponse {
  id: number;
  meal: string;
  time: string;
  totalCalories: number;
  note: string;
  foods: DietRecordItemResponse[];
}

export interface DietRecordItemCreateParams {
  foodId?: number | null;
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietRecordCreateParams {
  recordDate: string;
  meal: string;
  time: string;
  note?: string;
  foods: DietRecordItemCreateParams[];
}

export const getDailyRecordsAPI = (date: string) => {
  return axiosHelper.get<any, DailyDietRecordResponse[]>(`/api/records/daily?date=${date}`);
};

export const createRecordAPI = (data: DietRecordCreateParams) => {
  return axiosHelper.post<any, void>('/api/records', data);
};

export const deleteRecordItemAPI = (id: number) => {
  return axiosHelper.delete<any, void>(`/api/records/item/${id}`);
};
