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
  return axiosHelper.post<any, AiAdviceResponse>('/api/ai/advice', params);
};
