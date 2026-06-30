import {
  CheckinDay,
  DashboardMetric,
  FoodLibraryItem,
  GoalCard,
  MacroItem,
  MealRecord,
  WeightPoint,
} from '../types/health';

export const dashboardMetrics: DashboardMetric[] = [
  { label: '今日摄入', value: '1680 kcal', hint: '距离目标还差 220 kcal' },
  { label: '连续打卡', value: '12 天', hint: '保持中午补水提醒习惯' },
  { label: '目标达成率', value: '84%', hint: '本周比上周提升 9%' },
  { label: '平均睡眠', value: '7.2 h', hint: '睡眠稳定有助于控糖' },
];

export const macroItems: MacroItem[] = [
  { label: '蛋白质', value: 92, unit: 'g', progress: 77, color: '#0f766e' },
  { label: '碳水', value: 188, unit: 'g', progress: 82, color: '#2563eb' },
  { label: '脂肪', value: 54, unit: 'g', progress: 68, color: '#f59e0b' },
];

export const mealRecords: MealRecord[] = [
  {
    id: 'breakfast',
    meal: '早餐',
    time: '07:30',
    totalCalories: 420,
    note: '优先补充蛋白质和慢碳，避免上午过快饥饿。',
    foods: [
      { name: '燕麦酸奶杯', amount: '1 份', calories: 180 },
      { name: '水煮蛋', amount: '2 个', calories: 140 },
      { name: '蓝莓', amount: '80 g', calories: 100 },
    ],
  },
  {
    id: 'lunch',
    meal: '午餐',
    time: '12:15',
    totalCalories: 610,
    note: '主食与蔬菜比例平衡，下午训练日前可适当增加米饭。',
    foods: [
      { name: '香煎鸡胸', amount: '150 g', calories: 240 },
      { name: '糙米饭', amount: '180 g', calories: 230 },
      { name: '西兰花', amount: '120 g', calories: 140 },
    ],
  },
  {
    id: 'dinner',
    meal: '晚餐',
    time: '18:40',
    totalCalories: 520,
    note: '晚餐控制总热量，增加纤维与优质脂肪。',
    foods: [
      { name: '三文鱼', amount: '120 g', calories: 260 },
      { name: '藜麦沙拉', amount: '1 碗', calories: 180 },
      { name: '牛油果', amount: '1/2 个', calories: 80 },
    ],
  },
  {
    id: 'snack',
    meal: '加餐',
    time: '15:30',
    totalCalories: 130,
    note: '训练前加餐可替换为香蕉或高蛋白酸奶。',
    foods: [
      { name: '无糖酸奶', amount: '1 杯', calories: 90 },
      { name: '杏仁', amount: '10 g', calories: 40 },
    ],
  },
];

export const foodLibraryItems: FoodLibraryItem[] = [
  {
    key: '1',
    name: '鸡胸肉',
    category: '高蛋白',
    serving: '100 g',
    calories: 133,
    protein: 24.6,
    carbs: 0,
    fat: 3.1,
    tags: ['减脂期', '常备'],
  },
  {
    key: '2',
    name: '燕麦',
    category: '主食',
    serving: '100 g',
    calories: 367,
    protein: 12.3,
    carbs: 61.6,
    fat: 8.4,
    tags: ['早餐', '高纤'],
  },
  {
    key: '3',
    name: '三文鱼',
    category: '优质脂肪',
    serving: '100 g',
    calories: 208,
    protein: 20.4,
    carbs: 0,
    fat: 13.4,
    tags: ['Omega-3', '晚餐'],
  },
  {
    key: '4',
    name: '西兰花',
    category: '蔬菜',
    serving: '100 g',
    calories: 34,
    protein: 2.8,
    carbs: 6.6,
    fat: 0.4,
    tags: ['高纤', '低卡'],
  },
  {
    key: '5',
    name: '希腊酸奶',
    category: '乳制品',
    serving: '100 g',
    calories: 97,
    protein: 9,
    carbs: 3.6,
    fat: 4.2,
    tags: ['加餐', '高蛋白'],
  },
];

export const weeklyCalories = [1580, 1720, 1650, 1840, 1760, 1690, 1680];

export const weeklyMacroTrend = {
  days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  protein: [82, 88, 91, 94, 90, 89, 92],
  carbs: [176, 188, 181, 205, 197, 190, 188],
  fat: [52, 48, 55, 57, 51, 50, 54],
};

export const monthlyCompletion = [74, 82, 88, 85];

export const weightTrend: WeightPoint[] = [
  { day: '06/01', value: 66.8 },
  { day: '06/08', value: 66.1 },
  { day: '06/15', value: 65.7 },
  { day: '06/22', value: 65.4 },
  { day: '06/29', value: 64.9, goalReached: true },
];

export const checkinDays: CheckinDay[] = [
  { day: '一', status: 'done' },
  { day: '二', status: 'done' },
  { day: '三', status: 'partial' },
  { day: '四', status: 'done' },
  { day: '五', status: 'done' },
  { day: '六', status: 'rest' },
  { day: '日', status: 'done' },
];

export const goalCards: GoalCard[] = [
  {
    title: '减脂目标',
    value: '60 kg',
    description: '预计 8 周内完成，建议每周下降 0.4 - 0.6 kg。',
  },
  {
    title: '饮水目标',
    value: '2400 ml',
    description: '工作日午后容易忘记补水，建议固定 3 个时段提醒。',
  },
  {
    title: '运动频率',
    value: '4 次/周',
    description: '力量训练 3 次 + 有氧 1 次，与饮食计划配合执行。',
  },
];

export const healthyHabits = [
  '早餐优先补蛋白，减少精制糖。',
  '午餐后步行 10 分钟，帮助稳定血糖。',
  '晚餐控制在睡前 3 小时完成，降低夜间负担。',
];

export const calculateTdee = (values: {
  gender: 'male' | 'female';
  weight: number;
  height: number;
  age: number;
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}) => {
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  let baseBmr = 10 * values.weight + 6.25 * values.height - 5 * values.age;
  baseBmr += values.gender === 'male' ? 5 : -161;

  return Math.round(baseBmr * activityMultipliers[values.activity]);
};
