import React from 'react';
import { Card, Col, Progress, Row, Statistic, Typography, message } from 'antd';
import ReactECharts from 'echarts-for-react';
import { getProfileAPI } from '../api/profile';
import { getCheckinStatsAPI, getWeeklyCaloriesAPI, getWeeklyMacrosAPI, getWeightTrendAPI } from '../api/stats';

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

  React.useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
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
        setTargetCalories(profileData.targetCalories || profileData.tdee || 0);
      } catch (error) {
        message.error('获取统计数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const completionRate = checkin.totalDays ? Math.round((checkin.completedDays / checkin.totalDays) * 100) : 0;
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
            <Statistic title="本周打卡达成率" value={completionRate} suffix="%" />
            <Progress percent={completionRate} strokeColor="#16a34a" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card loading={loading} style={{ borderRadius: 28 }}>
            <Statistic title="平均每日热量差" value={averageDailyDiff} suffix="kcal" />
            <Typography.Text style={{ color: '#6b7280' }}>按后端周热量与目标热量计算</Typography.Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card loading={loading} style={{ borderRadius: 28 }}>
            <Statistic title="体重达标点数" value={goalReachedCount} suffix="次" />
            <Typography.Text style={{ color: '#6b7280' }}>按体重趋势中的目标达标标记统计</Typography.Text>
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
    </div>
  );
};

export default Analytics;
