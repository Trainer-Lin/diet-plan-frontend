import React from 'react';
import { Card, Col, Row, Statistic, Typography, message, Button } from 'antd';
import ReactECharts from 'echarts-for-react';
import { BulbOutlined, FireOutlined, CheckCircleOutlined, DashboardOutlined } from '@ant-design/icons';
import { getAiAdviceAPI, AiAdviceResponse } from '../api/ai';
import { getAiCache, setAiCache, removeAiCache } from '../utils/aiCache';
import { getProfileAPI, ProfileResponse } from '../api/profile';
import { getCheckinStatsAPI, getWeeklyCaloriesAPI, getWeeklyMacrosAPI } from '../api/stats';
import { subscribeNutritionDataChanged } from '../utils/nutritionSync';

const AI_ADVICE_CACHE_KEY = 'analytics_advice';

const Analytics: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [weeklyMacroTrend, setWeeklyMacroTrend] = React.useState({
    days: [] as string[],
    protein: [] as number[],
    carbs: [] as number[],
    fat: [] as number[],
  });
  const [weeklyCalories, setWeeklyCalories] = React.useState<number[]>([]);
  const [checkin, setCheckin] = React.useState({ completedDays: 0, totalDays: 0, statuses: [] as string[] });
  const [targetCalories, setTargetCalories] = React.useState(0);
  const [profile, setProfile] = React.useState<ProfileResponse | null>(null);
  const cachedAdvice = getAiCache<AiAdviceResponse>(AI_ADVICE_CACHE_KEY);
  const [aiAdvice, setAiAdvice] = React.useState<AiAdviceResponse>(cachedAdvice || {
    brief: '',
    detailed: '正在生成详细分析与推荐...',
  });

  const loadAnalytics = React.useCallback(async () => {
    setLoading(true);

    try {
      const [macroData, checkinData, weeklyCalorieData, profileData] = await Promise.all([
        getWeeklyMacrosAPI(),
        getCheckinStatsAPI(),
        getWeeklyCaloriesAPI(),
        getProfileAPI(),
      ]);
      setWeeklyMacroTrend(macroData);
      setCheckin(checkinData);
      setWeeklyCalories(weeklyCalorieData.calories || []);
      setProfile(profileData);
      const target = profileData.targetCalories || profileData.tdee || 0;
      setTargetCalories(target);

      // AI 建议不再自动刷新，仅从缓存读取，用户点击"重新生成"才调接口
    } catch (error) {
      message.error('获取统计数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegenerateAdvice = async () => {
    removeAiCache(AI_ADVICE_CACHE_KEY);
    setAiAdvice({ brief: '', detailed: '正在生成详细分析与推荐...' });
    try {
      const [macroData, checkinData, weeklyCalorieData, profileData] = await Promise.all([
        getWeeklyMacrosAPI(),
        getCheckinStatsAPI(),
        getWeeklyCaloriesAPI(),
        getProfileAPI(),
      ]);
      const target = profileData.targetCalories || profileData.tdee || 0;
      const calories = weeklyCalorieData.calories || [];
      const averageDailyDiff = calories.length
        ? Math.round(calories.reduce((sum, item) => sum + (item - target), 0) / calories.length)
        : 0;
      const todayCalories = calories.length ? calories[calories.length - 1] : 0;
      const todayProtein = macroData.protein.length ? macroData.protein[macroData.protein.length - 1] : 0;
      const todayCarbs = macroData.carbs.length ? macroData.carbs[macroData.carbs.length - 1] : 0;
      const todayFat = macroData.fat.length ? macroData.fat[macroData.fat.length - 1] : 0;

      const advice = await getAiAdviceAPI({
        weight: profileData.weight,
        targetWeight: profileData.targetWeight,
        targetCalories: target,
        todayCalories,
        todayProtein,
        todayCarbs,
        todayFat,
        height: profileData.height,
        age: profileData.age,
        gender: profileData.gender,
        averageDailyDiff,
        completedDays: checkinData.completedDays,
        totalDays: checkinData.totalDays,
      });
      setAiAdvice(advice);
      setAiCache(AI_ADVICE_CACHE_KEY, advice);
    } catch {
      message.error('生成建议失败，请稍后重试');
    }
  };

  React.useEffect(() => {
    loadAnalytics();
    const unsubscribe = subscribeNutritionDataChanged(loadAnalytics);

    return unsubscribe;
  }, [loadAnalytics]);

  const averageDailyDiff = weeklyCalories.length
    ? Math.round(weeklyCalories.reduce((sum, item) => sum + (item - targetCalories), 0) / weeklyCalories.length)
    : 0;

  const bmi = React.useMemo(() => {
    if (!profile || !profile.weight || !profile.height) return 0;
    const heightInMeters = profile.height / 100;
    return Number((profile.weight / (heightInMeters * heightInMeters)).toFixed(1));
  }, [profile]);

  const macroOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['蛋白质', '碳水', '脂肪'] },
    xAxis: { type: 'category', data: weeklyMacroTrend.days },
    yAxis: { type: 'value', name: 'g' },
    series: [
      { name: '蛋白质', type: 'line', smooth: true, data: weeklyMacroTrend.protein, color: '#0f766e' },
      { name: '碳水', type: 'line', smooth: true, data: weeklyMacroTrend.carbs, color: '#2563eb' },
      { name: '脂肪', type: 'line', smooth: true, data: weeklyMacroTrend.fat, color: '#f59e0b' },
    ],
  };

  return (
    <div>
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        <Col xs={24} xl={16}>
          <Card loading={loading} style={{ borderRadius: 28, height: '100%' }}>
            <Typography.Title level={4}>宏量营养素趋势</Typography.Title>
            <ReactECharts option={macroOption} style={{ height: 360 }} />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
            <Card
              loading={loading}
              style={{ flex: 1, borderRadius: 28, background: '#f6ffed', borderColor: '#b7eb8f' }}
              bodyStyle={{ display: 'flex', alignItems: 'center', gap: 16 }}
            >
              <CheckCircleOutlined style={{ fontSize: 40, color: '#52c41a' }} />
              <Statistic
                title="本周打卡率"
                value={`${checkin.completedDays}/${checkin.totalDays}`}
                valueStyle={{ color: '#389e0d', fontWeight: 600 }}
              />
            </Card>
            <Card
              loading={loading}
              style={{ flex: 1, borderRadius: 28, background: '#fff2e8', borderColor: '#ffbb96' }}
              bodyStyle={{ display: 'flex', alignItems: 'center', gap: 16 }}
            >
              <FireOutlined style={{ fontSize: 40, color: '#fa8c16' }} />
              <Statistic
                title="平均每日热量差"
                value={averageDailyDiff}
                suffix="kcal"
                valueStyle={{ color: '#d46b08', fontWeight: 600 }}
              />
            </Card>
            <Card
              loading={loading}
              style={{ flex: 1, borderRadius: 28, background: '#e6f4ff', borderColor: '#91caff' }}
              bodyStyle={{ display: 'flex', alignItems: 'center', gap: 16 }}
            >
              <DashboardOutlined style={{ fontSize: 40, color: '#1677ff' }} />
              <Statistic
                title="BMI 指数"
                value={bmi}
                valueStyle={{ color: '#0958d9', fontWeight: 600 }}
              />
            </Card>
          </div>
        </Col>
      </Row>

      {/* AI 健康建议板块 */}
      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col xs={24}>
          <Card loading={loading} style={{ borderRadius: 28, background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                <BulbOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                AI 健康建议
              </Typography.Title>
              <Button size="small" onClick={handleRegenerateAdvice}>重新生成</Button>
            </div>
            <Typography.Paragraph style={{ fontSize: 16, lineHeight: 1.8, color: '#1f2937', whiteSpace: 'pre-wrap' }}>
              {aiAdvice.detailed || '暂无建议，请继续记录饮食数据。'}
            </Typography.Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
