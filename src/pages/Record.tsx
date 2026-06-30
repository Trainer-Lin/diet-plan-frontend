import React from 'react';
import { ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Progress, Row, Space, Tag, Typography } from 'antd';
import { useHealthStore } from '../store/useHealthStore';

const Record: React.FC = () => {
  const mealRecords = useHealthStore((state) => state.mealRecords);

  return (
    <div>
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        <Col xs={24} xl={16}>
          <Card style={{ borderRadius: 28 }}>
            <Space direction="vertical" size={6}>
              <Typography.Title level={3} style={{ margin: 0 }}>
                今日饮食打卡
              </Typography.Title>
              <Typography.Text style={{ color: '#6b7280' }}>
                记录三餐和加餐，自动统计热量、营养素和完成状态。
              </Typography.Text>
            </Space>
            <Progress percent={86} strokeColor="#16a34a" style={{ marginTop: 18 }} />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card style={{ borderRadius: 28 }}>
            <Typography.Title level={4}>今日策略</Typography.Title>
            <Typography.Paragraph style={{ color: '#6b7280', marginBottom: 18 }}>
              晚餐已经完成优质脂肪补充，夜间如有饥饿感，优先无糖酸奶或低糖水果。
            </Typography.Paragraph>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#0b7a29', borderColor: '#0b7a29' }}>
              添加一餐
            </Button>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {mealRecords.map((record) => (
          <Col xs={24} lg={12} key={record.id}>
            <Card style={{ borderRadius: 28, height: '100%' }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <div>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      {record.meal}
                    </Typography.Title>
                    <Typography.Text style={{ color: '#6b7280' }}>
                      <ClockCircleOutlined style={{ marginRight: 8 }} />
                      {record.time}
                    </Typography.Text>
                  </div>
                  <Tag color="green" style={{ borderRadius: 999, padding: '6px 12px' }}>
                    {record.totalCalories} kcal
                  </Tag>
                </Space>
                <div>
                  {record.foods.map((food, index) => (
                    <div key={`${record.id}-${food.name}`} style={{ padding: '12px 0' }}>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <div>
                          <Typography.Text strong>{food.name}</Typography.Text>
                          <Typography.Text style={{ display: 'block', color: '#6b7280' }}>
                            {food.amount}
                          </Typography.Text>
                        </div>
                        <Typography.Text>{food.calories} kcal</Typography.Text>
                      </Space>
                      {index < record.foods.length - 1 ? <Divider style={{ margin: '12px 0 0' }} /> : null}
                    </div>
                  ))}
                </div>
                <Card
                  style={{ borderRadius: 20, background: '#f5faf6', borderColor: 'rgba(15,118,110,0.08)' }}
                  bodyStyle={{ padding: '14px 16px' }}
                >
                  <Typography.Text style={{ color: '#355244' }}>{record.note}</Typography.Text>
                </Card>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Record;
