import React from 'react';
import { AimOutlined, TrophyOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Space, Tag, Typography, message } from 'antd';
import { getProfileAPI } from '../api/profile';
import { getCheckinStatsAPI } from '../api/stats';

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

  React.useEffect(() => {
    const loadGoalsData = async () => {
      try {
        setLoading(true);
        const [profileData, checkinData] = await Promise.all([
          getProfileAPI(),
          getCheckinStatsAPI(),
        ]);
        setProfile(profileData);
        setCheckin(checkinData);
      } catch (error) {
        message.error('获取目标数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadGoalsData();
  }, []);

  const targetCalories = profile.targetCalories || profile.tdee || 0;
  const completionRate = checkin.totalDays ? Math.round((checkin.completedDays / checkin.totalDays) * 100) : 0;
  const goalCards = [
    {
      title: '当前体重',
      value: `${profile.weight || '--'} kg`,
      description: '来自后端个人档案接口，作为当前管理基线。',
    },
    {
      title: '目标体重',
      value: profile.targetWeight ? `${profile.targetWeight} kg` : '--',
      description: '来自档案中的目标体重字段，可用于跟踪减脂或增肌目标。',
    },
    {
      title: '每日目标热量',
      value: targetCalories ? `${targetCalories} kcal` : '--',
      description: '优先使用后端目标热量，没有则回退到 TDEE。',
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
                基于 {profile.height} cm、{profile.weight} kg、{profile.activity} 活动强度估算，可作为后端接口的计算校验样例。
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
                <Typography.Text style={{ color: '#6b7280' }}>来自打卡率统计接口</Typography.Text>
              </div>
            </Space>
            <Progress percent={completionRate} strokeColor="#16a34a" style={{ marginTop: 18 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {goalCards.map((goal, index) => (
          <Col xs={24} md={12} xl={8} key={goal.title}>
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
