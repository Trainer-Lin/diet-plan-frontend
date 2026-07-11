import React from 'react';
import { CalendarOutlined, FireOutlined, HeartOutlined, RiseOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Space, Statistic, Typography, message } from 'antd';
import ReactECharts from 'echarts-for-react';
import { getAiAdviceAPI, AiAdviceResponse } from '../api/ai';
import { getProfileAPI } from '../api/profile';
import { getCheckinStatsAPI, getTodayStatsAPI, getWeeklyCaloriesAPI } from '../api/stats';
import { subscribeNutritionDataChanged } from '../utils/nutritionSync';

const defaultDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const Dashboard: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [todayStats, setTodayStats] = React.useState({ totalCalories: 0, protein: 0, carbs: 0, fat: 0 });
  const [weeklyCaloriesData, setWeeklyCaloriesData] = React.useState<{ days: string[]; calories: number[] }>({
    days: defaultDays,
    calories: [0, 0, 0, 0, 0, 0, 0],
  });
  const [checkinStats, setCheckinStats] = React.useState<{ completedDays: number; totalDays: number; statuses: string[]; days?: string[] }>({
    completedDays: 0,
    totalDays: 7,
    statuses: [],
    days: [],
  });
  const [profile, setProfile] = React.useState<{
    weight: number;
    targetWeight?: number | null;
    targetCalories?: number;
    tdee?: number;
    height?: number;
    age?: number;
    gender?: string;
  }>({
    weight: 0,
  });
  const [aiAdvice, setAiAdvice] = React.useState<AiAdviceResponse>({
    brief: '正在生成今日建议...',
    detailed: '',
  });

  const loadDashboardData = React.useCallback(async () => {
    setLoading(true);

    try {
      const [today, weekly, checkin, profileData] = await Promise.all([
        getTodayStatsAPI(),
        getWeeklyCaloriesAPI(),
        getCheckinStatsAPI(),
        getProfileAPI(),
      ]);
      setTodayStats(today);
      setWeeklyCaloriesData({
        days: weekly.days?.length ? weekly.days : defaultDays,
        calories: weekly.calories?.length ? weekly.calories : [0, 0, 0, 0, 0, 0, 0],
      });
      setCheckinStats(checkin);
      setProfile({
        weight: profileData.weight,
        targetWeight: profileData.targetWeight,
        targetCalories: profileData.targetCalories,
        tdee: profileData.tdee,
        height: profileData.height,
        age: profileData.age,
        gender: profileData.gender,
      });

      // AI 建议单独加载，使用真实返回的 brief 内容展示一句话建议。
      const calories = weekly.calories?.length ? weekly.calories : [];
      const target = profileData.targetCalories || profileData.tdee || 0;
      const averageDailyDiff = calories.length
        ? Math.round(calories.reduce((sum: number, item: number) => sum + (item - target), 0) / calories.length)
        : 0;

      void getAiAdviceAPI({
        weight: profileData.weight,
        targetWeight: profileData.targetWeight,
        targetCalories: target,
        todayCalories: today.totalCalories,
        todayProtein: today.protein,
        todayCarbs: today.carbs,
        todayFat: today.fat,
        height: profileData.height,
        age: profileData.age,
        gender: profileData.gender,
        averageDailyDiff,
        completedDays: checkin.completedDays,
        totalDays: checkin.totalDays,
      }).then((advice) => {
        setAiAdvice(advice);
      }).catch(() => {
        setAiAdvice({
          brief: '今日建议暂时获取失败',
          detailed: '',
        });
      });
    } catch (error) {
      message.error('获取总览数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboardData();
    const unsubscribe = subscribeNutritionDataChanged(loadDashboardData);

    return unsubscribe;
  }, [loadDashboardData]);

  const targetCalories = profile.targetCalories || profile.tdee || 0;
  const todayCalories = todayStats.totalCalories;
  const percent = Math.round((todayCalories / targetCalories) * 100);
  const briefAdvice = aiAdvice.brief || '保持规律饮食';

  const dashboardMetrics = [
    { label: '今日热量', value: `${todayCalories} kcal`, hint: '今日总摄入热量' },
    { label: '本周打卡', value: `${checkinStats.completedDays}/${checkinStats.totalDays}`, hint: '本周连续记录天数' },
    { label: '当前体重', value: `${profile.weight || '--'} kg`, hint: '您的最新体重记录' },
    { label: '目标热量', value: `${targetCalories || '--'} kcal`, hint: '推荐每日摄入上限' },
  ];

  const macroItems = [
    {
      label: '蛋白质',
      value: todayStats.protein,
      unit: 'g',
      progress: Math.min(100, Math.round((todayStats.protein / 120) * 100)),
      color: '#0f766e',
    },
    {
      label: '碳水',
      value: todayStats.carbs,
      unit: 'g',
      progress: Math.min(100, Math.round((todayStats.carbs / 300) * 100)),
      color: '#2563eb',
    },
    {
      label: '脂肪',
      value: todayStats.fat,
      unit: 'g',
      progress: Math.min(100, Math.round((todayStats.fat / 80) * 100)),
      color: '#f59e0b',
    },
  ];

  const checkinDays = (checkinStats.days?.length ? checkinStats.days : defaultDays).map((day, index) => ({
    day,
    status: checkinStats.statuses[index] || 'rest',
  }));

  const option = {
    title: {
      text: '近七天热量摄入趋势',
      textStyle: { fontSize: 16, fontWeight: 500, color: '#1f2937' },
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: weeklyCaloriesData.days,
    },
    yAxis: {
      type: 'value',
      name: 'kcal',
    },
    series: [
      {
        data: weeklyCaloriesData.calories,
        type: 'line',
        smooth: true,
        itemStyle: { color: '#52c41a' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(82, 196, 26, 0.5)' },
              { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
            ]
          }
        }
      },
    ],
  };

  return (
    <div>
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {dashboardMetrics.map((metric, index) => (
          <Col xs={24} md={12} xl={6} key={metric.label}>
            <Card loading={loading} style={{ borderRadius: 24 }}>
              <Statistic
                title={metric.label}
                value={metric.value}
                prefix={
                  index === 0 ? <FireOutlined style={{ color: '#fa8c16' }} /> :
                  index === 1 ? <CalendarOutlined style={{ color: '#0f766e' }} /> :
                  index === 2 ? <RiseOutlined style={{ color: '#2563eb' }} /> :
                  <HeartOutlined style={{ color: '#eb2f96' }} />
                }
              />
              <Typography.Text style={{ color: '#6b7280' }}>{metric.hint}</Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} xl={10}>
          <Card loading={loading} style={{ borderRadius: 28 }}>
            <Statistic
              title="今日摄入 (kcal)"
              value={todayCalories}
              prefix={<FireOutlined style={{ color: '#fa8c16' }} />}
              suffix={targetCalories ? `/ ${targetCalories}` : undefined}
            />
            <Progress percent={Number.isFinite(percent) ? percent : 0} status={percent > 100 ? 'exception' : 'active'} strokeColor="#52c41a" style={{ marginTop: 16 }} />
            <Typography.Paragraph style={{ marginTop: 12, marginBottom: 0, color: '#6b7280' }}>
              目标热量基于您的个人档案精准计算，助您合理控制每日热量缺口。
            </Typography.Paragraph>
          </Card>
        </Col>
        <Col xs={24} xl={14}>
          <Card loading={loading} style={{ borderRadius: 28 }}>
            <Row gutter={[16, 16]}>
              {macroItems.map((item) => (
                <Col xs={24} md={8} key={item.label}>
                  <Statistic title={item.label} value={item.value} suffix={item.unit} valueStyle={{ color: item.color }} />
                  <Progress percent={item.progress} size="small" showInfo={false} strokeColor={item.color} />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} xl={16}>
          <Card loading={loading} style={{ borderRadius: 28 }}>
            <ReactECharts option={option} style={{ height: 400 }} />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            <Card loading={loading} style={{ borderRadius: 28 }}>
              <Typography.Title level={4}>本周习惯建议</Typography.Title>
              <Typography.Paragraph
                style={{ marginBottom: 0, fontSize: 16, lineHeight: 1.8, color: '#166534', fontWeight: 500 }}
              >
                {briefAdvice}
              </Typography.Paragraph>
            </Card>
            <Card loading={loading} style={{ borderRadius: 28 }}>
              <Typography.Title level={4}>打卡状态</Typography.Title>
              <Row gutter={[10, 10]}>
                {checkinDays.map((item) => (
                  <Col span={8} key={item.day}>
                    <div
                      style={{
                        borderRadius: 18,
                        padding: '14px 0',
                        textAlign: 'center',
                        background:
                          item.status === 'done' ? '#dff7e7' :
                          item.status === 'partial' ? '#fff4d6' :
                          '#f2f4f7',
                        color:
                          item.status === 'done' ? '#0b7a29' :
                          item.status === 'partial' ? '#a16207' :
                          '#6b7280',
                        fontWeight: 600,
                      }}
                    >
                      {item.day}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
