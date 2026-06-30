import React from 'react';
import { CalendarOutlined, FireOutlined, HeartOutlined, RiseOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Space, Statistic, Tag, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useHealthStore } from '../store/useHealthStore';

const Dashboard: React.FC = () => {
  const dashboardMetrics = useHealthStore((state) => state.dashboardMetrics);
  const macroItems = useHealthStore((state) => state.macroItems);
  const weeklyCalories = useHealthStore((state) => state.weeklyCalories);
  const healthyHabits = useHealthStore((state) => state.healthyHabits);
  const checkinDays = useHealthStore((state) => state.checkinDays);

  const todayCalories = 1680;
  const targetCalories = 1900;
  const percent = Math.round((todayCalories / targetCalories) * 100);

  const option = {
    title: {
      text: '近七天热量摄入趋势',
      textStyle: { fontSize: 16, fontWeight: 500, color: '#1f2937' },
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
      name: 'kcal',
    },
    series: [
      {
        data: weeklyCalories,
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
            <Card style={{ borderRadius: 24 }}>
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
          <Card style={{ borderRadius: 28 }}>
            <Statistic
              title="今日摄入 (kcal)"
              value={todayCalories}
              prefix={<FireOutlined style={{ color: '#fa8c16' }} />}
              suffix={`/ ${targetCalories}`}
            />
            <Progress percent={percent} status={percent > 100 ? 'exception' : 'active'} strokeColor="#52c41a" style={{ marginTop: 16 }} />
            <Typography.Paragraph style={{ marginTop: 12, marginBottom: 0, color: '#6b7280' }}>
              午后加餐建议控制在 150 kcal 以内，优先选择高蛋白酸奶或水果。
            </Typography.Paragraph>
          </Card>
        </Col>
        <Col xs={24} xl={14}>
          <Card style={{ borderRadius: 28 }}>
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
          <Card style={{ borderRadius: 28 }}>
            <ReactECharts option={option} style={{ height: 400 }} />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            <Card style={{ borderRadius: 28 }}>
              <Typography.Title level={4}>本周习惯建议</Typography.Title>
              <Space direction="vertical" size={10}>
                {healthyHabits.map((habit) => (
                  <Tag key={habit} color="green" style={{ marginInlineEnd: 0, padding: '8px 12px', borderRadius: 999 }}>
                    {habit}
                  </Tag>
                ))}
              </Space>
            </Card>
            <Card style={{ borderRadius: 28 }}>
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
