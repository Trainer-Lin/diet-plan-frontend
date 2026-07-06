import React from 'react';
import { AimOutlined, TrophyOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Space, Tag, Typography, message } from 'antd';
import { getProfileAPI } from '../api/profile';
import { getCheckinStatsAPI, getTodayStatsAPI } from '../api/stats';
import { subscribeNutritionDataChanged } from '../utils/nutritionSync';

const Goals: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<{
    height: number;
    weight: number;
    activity: string;
    targetWeight?: number | null;
    targetCalories?: number;
    tdee?: number;
  }>({
    height: 0,
    weight: 0,
    activity: '',
  });
  const [checkin, setCheckin] = React.useState({ completedDays: 0, totalDays: 0 });
  const [todayCalories, setTodayCalories] = React.useState(0);

  const loadGoalsData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [profileData, checkinData, todayData] = await Promise.all([
        getProfileAPI(),
        getCheckinStatsAPI(),
        getTodayStatsAPI(),
      ]);
      setProfile(profileData);
      setCheckin(checkinData);
      setTodayCalories(todayData.totalCalories || 0);
    } catch (error) {
      message.error('获取目标数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadGoalsData();
    const unsubscribe = subscribeNutritionDataChanged(loadGoalsData);

    return unsubscribe;
  }, [loadGoalsData]);

  const targetCalories = profile.targetCalories || profile.tdee || 0;
  const remainingCalories = Math.max(0, targetCalories - todayCalories);
  const completionRate = checkin.totalDays ? Math.round((checkin.completedDays / checkin.totalDays) * 100) : 0;
  const goalCards = [
    {
      title: '当前体重',
      value: `${profile.weight || '--'} kg`,
      description: '基于您最新的个人档案，作为当前健康管理的基线。',
    },
    {
      title: '目标体重',
      value: profile.targetWeight ? `${profile.targetWeight} kg` : '--',
      description: '动态追踪您的减脂或增肌目标，随时调整计划。',
    },
    {
      title: '每日目标热量',
      value: targetCalories ? `${targetCalories} kcal` : '--',
      description: '结合您的基础代谢与目标为您量身定制。',
    },
    {
      title: '今日已摄入',
      value: `${todayCalories} kcal`,
      description: '基于您已记录的饮食自动汇总，新增一餐后会同步更新。',
    },
  ];

  return (
    <div>
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        <Col xs={24} xl={16}>
          <Card loading={loading} style={{ borderRadius: 28 }}>
            <Space direction="vertical" size={8}>
              <Tag color="green" style={{ width: 'fit-content', borderRadius: 999, padding: '8px 12px' }}>
                目标看板
              </Tag>
              <Typography.Title level={3} style={{ margin: 0 }}>
                当前建议摄入
              </Typography.Title>
              <Typography.Title style={{ margin: 0, color: '#0b7a29' }}>{targetCalories || '--'} kcal / day</Typography.Title>
              <Typography.Paragraph style={{ marginBottom: 0, color: '#6b7280' }}>
                今日已摄入 {todayCalories} kcal，剩余可参考摄入 {remainingCalories} kcal。
              </Typography.Paragraph>
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card loading={loading} style={{ borderRadius: 28 }}>
            <Space align="center">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  display: 'grid',
                  placeItems: 'center',
                  background: '#dff7e7',
                  color: '#0b7a29',
                }}
              >
                <TrophyOutlined />
              </div>
              <div>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  本周完成度
                </Typography.Title>
                <Typography.Text style={{ color: '#6b7280' }}>您本周的饮食打卡进度</Typography.Text>
              </div>
            </Space>
            <Progress percent={completionRate} strokeColor="#16a34a" style={{ marginTop: 18 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {goalCards.map((goal, index) => (
          <Col xs={24} md={12} xl={6} key={goal.title}>
            <Card loading={loading} style={{ borderRadius: 28, height: '100%' }}>
              <Space direction="vertical" size={14}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    display: 'grid',
                    placeItems: 'center',
                    background: index === 0 ? '#dff7e7' : index === 1 ? '#eef4ff' : '#fff5dc',
                    color: index === 0 ? '#0b7a29' : index === 1 ? '#2563eb' : '#a16207',
                  }}
                >
                  <AimOutlined />
                </div>
                <div>
                  <Typography.Text style={{ color: '#6b7280' }}>{goal.title}</Typography.Text>
                  <Typography.Title level={2} style={{ margin: '4px 0 8px' }}>
                    {goal.value}
                  </Typography.Title>
                  <Typography.Paragraph style={{ color: '#6b7280', marginBottom: 0 }}>
                    {goal.description}
                  </Typography.Paragraph>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Goals;
