import React from 'react';
import { Card, Col, Progress, Row, Statistic, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useHealthStore } from '../store/useHealthStore';

const Analytics: React.FC = () => {
  const weeklyMacroTrend = useHealthStore((state) => state.weeklyMacroTrend);
  const monthlyCompletion = useHealthStore((state) => state.monthlyCompletion);
  const weightTrend = useHealthStore((state) => state.weightTrend);

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
          <Card style={{ borderRadius: 28 }}>
            <Statistic title="本周目标达成率" value={84} suffix="%" />
            <Progress percent={84} strokeColor="#16a34a" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 28 }}>
            <Statistic title="平均每日热量差" value={-185} suffix="kcal" />
            <Typography.Text style={{ color: '#6b7280' }}>处于安全减脂区间</Typography.Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 28 }}>
            <Statistic title="月度完成周数" value={`${monthlyCompletion.filter((item) => item >= 80).length}/4`} />
            <Typography.Text style={{ color: '#6b7280' }}>80% 以上视作达标</Typography.Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={14}>
          <Card style={{ borderRadius: 28 }}>
            <Typography.Title level={4}>宏量营养素趋势</Typography.Title>
            <ReactECharts option={macroOption} style={{ height: 360 }} />
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card style={{ borderRadius: 28 }}>
            <Typography.Title level={4}>体重变化趋势</Typography.Title>
            <ReactECharts option={weightOption} style={{ height: 360 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
