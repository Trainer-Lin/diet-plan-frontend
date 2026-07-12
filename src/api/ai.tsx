import axiosHelper from './axiosHelper';

/**
 * AI 健康建议请求参数
 * 包含用户的各项健康指标
 */
export interface AiAdviceParams {
  weight?: number; // 当前体重（kg）
  targetWeight?: number | null; // 目标体重（kg）
  targetCalories?: number; // 目标热量（kcal/天）
  todayCalories?: number; // 今日摄入热量（kcal）
  todayProtein?: number; // 今日蛋白质（g）
  todayCarbs?: number; // 今日碳水（g）
  todayFat?: number; // 今日脂肪（g）
  height?: number; // 身高（cm）
  age?: number; // 年龄
  gender?: string; // 性别
  averageDailyDiff?: number; // 本周平均每日热量差
  completedDays?: number; // 本周打卡天数
  totalDays?: number; // 本周总天数
}

/**
 * AI 健康建议响应
 * brief 用于总览看板的精简建议
 * detailed 用于统计分析的详细建议
 */
export interface AiAdviceResponse {
  brief: string; // 精简建议
  detailed: string; // 详细建议
}

/**
   * 调用 AI 健康建议接口
   * @param params 用户的健康指标
   * @returns 包含精简和详细建议的对象
   */
export const getAiAdviceAPI = (params: AiAdviceParams) => {
  // AI 接口响应较慢，单独设置 60 秒超时；页面自身会处理失败回退，避免全局提示
  return axiosHelper.post<any, AiAdviceResponse>('/api/ai/advice', params, {
    timeout: 60000,
    skipErrorMessage: true,
  });
};

/**
 * AI 周计划请求参数
 */
export interface WeeklyPlanParams {
  weight?: number;
  targetWeight?: number | null;
  targetCalories?: number;
  height?: number;
  age?: number;
  gender?: string;
  activityLevel?: string;
  tdee?: number;
}

/**
 * AI 周计划响应
 */
export interface WeeklyPlanResponse {
  summary: string;
  days: DayPlan[];
}

export interface DayPlan {
  dayOfWeek: string;
  date: string;
  dietPlan: {
    totalCalories: number;
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
    snacks: MealItem[];
  };
  fitnessPlan: {
    estimatedCaloriesBurned: number;
    warmUp: string;
    mainWorkout: string;
    coolDown: string;
    notes: string;
  };
}

export interface MealItem {
  name: string;
  description: string;
  calories: number;
}

/**
 * 调用 AI 周计划生成接口
 */
export const getWeeklyPlanAPI = (params: WeeklyPlanParams) => {
  return axiosHelper.post<any, WeeklyPlanResponse>('/api/ai/weekly-plan', params, {
    timeout: 120000,
    skipErrorMessage: true,
  });
};

/**
 * AI 食物营养查询请求
 */
export interface FoodNutritionParams {
  foodName: string;
}

/**
 * AI 食物营养查询响应
 */
export interface FoodNutritionResponse {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingUnit: string;
  note: string;
}

/**
 * 调用 AI 食物营养查询接口
 */
export const getFoodNutritionAPI = (params: FoodNutritionParams) => {
  return axiosHelper.post<any, FoodNutritionResponse>('/api/ai/food-nutrition', params, {
    timeout: 60000,
    skipErrorMessage: true,
  });
};
