import React from 'react';
import { AimOutlined, TrophyOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Space, Tag, Typography } from 'antd';
import { useHealthStore } from '../store/useHealthStore';

const Goals: React.FC = () => {
  const goalCards = useHealthStore((state) => state.goalCards);
  const tdee = useHealthStore((state) => state.tdee);
  const profile = useHealthStore((state) => state.profile);

  return (
    <div>
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        <Col xs={24} xl={16}>
          <Card style={{ borderRadius: 28 }}>
            <Space direction="vertical" size={8}>
              <Tag color="green" style={{ width: 'fit-content', borderRadius: 999, padding: '8px 12px' }}>
                目标看板
              </Tag>
              <Typography.Title level={3} style={{ margin: 0 }}>
                当前建议摄入
              </Typography.Title>
              <Typography.Title style={{ margin: 0, color: '#0b7a29' }}>{tdee} kcal / day</Typography.Title>
              <Typography.Paragraph style={{ marginBottom: 0, color: '#6b7280' }}>
                基于 {profile.height} cm、{profile.weight} kg、{profile.activity} 活动强度估算，可作为后端接口的计算校验样例。
              </Typography.Paragraph>
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card style={{ borderRadius: 28 }}>
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
                <Typography.Text style={{ color: '#6b7280' }}>已经连续 12 天完成记录</Typography.Text>
              </div>
            </Space>
            <Progress percent={84} strokeColor="#16a34a" style={{ marginTop: 18 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {goalCards.map((goal, index) => (
          <Col xs={24} md={12} xl={8} key={goal.title}>
            <Card style={{ borderRadius: 28, height: '100%' }}>
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
