import React from 'react';
import { Card, Col, Row, Statistic, Typography, message } from 'antd';
import ReactECharts from 'echarts-for-react';
import { BulbOutlined } from '@ant-design/icons';
import { getAiAdviceAPI, AiAdviceResponse } from '../api/ai';
import { getProfileAPI } from '../api/profile';
import { getCheckinStatsAPI, getWeeklyCaloriesAPI, getWeeklyMacrosAPI, getWeightTrendAPI } from '../api/stats';
import { subscribeNutritionDataChanged } from '../utils/nutritionSync';

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
  const [weightTrend, setWeightTrend] = React.useState<Array<{ day: string; value: number; goalReached?: boolean }>>([]);
  const [aiAdvice, setAiAdvice] = React.useState<AiAdviceResponse>({
    brief: '',
    detailed: '正在生成详细分析与推荐...',
  });

  const loadAnalytics = React.useCallback(async () => {
    setLoading(true);

    try {
      const [macroData, weightData, checkinData, weeklyCalorieData, profileData] = await Promise.all([
        getWeeklyMacrosAPI(),
        getWeightTrendAPI(),
        getCheckinStatsAPI(),
        getWeeklyCaloriesAPI(),
        getProfileAPI(),
      ]);
      setWeeklyMacroTrend(macroData);
      setWeightTrend(weightData);
      setCheckin(checkinData);
      setWeeklyCalories(weeklyCalorieData.calories || []);
      const target = profileData.targetCalories || profileData.tdee || 0;
      setTargetCalories(target);

      // AI 建议单独加载，使用真实返回的 detailed 内容展示详细分析。
      const calories = weeklyCalorieData.calories || [];
      const averageDailyDiff = calories.length
        ? Math.round(calories.reduce((sum, item) => sum + (item - target), 0) / calories.length)
        : 0;

      const todayCalories = calories.length ? calories[calories.length - 1] : 0;
      const todayProtein = macroData.protein.length ? macroData.protein[macroData.protein.length - 1] : 0;
      const todayCarbs = macroData.carbs.length ? macroData.carbs[macroData.carbs.length - 1] : 0;
      const todayFat = macroData.fat.length ? macroData.fat[macroData.fat.length - 1] : 0;

      void getAiAdviceAPI({
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
      }).then((advice) => {
        setAiAdvice(advice);
      }).catch(() => {
        setAiAdvice({
          brief: '',
          detailed: '详细建议暂时获取失败，请稍后重试。',
        });
      });
    } catch (error) {
      message.error('获取统计数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAnalytics();
    const unsubscribe = subscribeNutritionDataChanged(loadAnalytics);

    return unsubscribe;
  }, [loadAnalytics]);

  const averageDailyDiff = weeklyCalories.length
    ? Math.round(weeklyCalories.reduce((sum, item) => sum + (item - targetCalories), 0) / weeklyCalories.length)
    : 0;
  const goalReachedCount = weightTrend.filter((item) => item.goalReached).length;

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

  const weightOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: weightTrend.map((item) => item.day) },
    yAxis: { type: 'value', name: 'kg' },
    series: [
      {
        type: 'line',
        smooth: true,
        data: weightTrend.map((item) => item.value),
        color: '#16a34a',
        areaStyle: {
          color: 'rgba(22, 163, 74, 0.16)',
        },
      },
    ],
  };

  return (
    <div>
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        <Col xs={24} md={8}>
          <Card loading={loading} style={{ borderRadius: 28 }}>
            <Statistic title="本周打卡率" value={`${checkin.completedDays}/${checkin.totalDays}`} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card loading={loading} style={{ borderRadius: 28 }}>
            <Statistic title="平均每日热量差" value={averageDailyDiff} suffix="kcal" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card loading={loading} style={{ borderRadius: 28 }}>
            <Statistic title="体重达标点数" value={goalReachedCount} suffix="次" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={14}>
          <Card loading={loading} style={{ borderRadius: 28 }}>
            <Typography.Title level={4}>宏量营养素趋势</Typography.Title>
            <ReactECharts option={macroOption} style={{ height: 360 }} />
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card loading={loading} style={{ borderRadius: 28 }}>
            <Typography.Title level={4}>体重变化趋势</Typography.Title>
            <ReactECharts option={weightOption} style={{ height: 360 }} />
          </Card>
        </Col>
      </Row>

      {/* AI 健康建议板块，放在两个图表下方 */}
      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col xs={24}>
          <Card loading={loading} style={{ borderRadius: 28, background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Typography.Title level={4} style={{ marginBottom: 16 }}>
              <BulbOutlined style={{ color: '#52c41a', marginRight: 8 }} />
              AI 健康建议
            </Typography.Title>
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
