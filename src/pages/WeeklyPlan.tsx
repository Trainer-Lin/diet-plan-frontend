import React from 'react';
import {
  Card, Col, Row, Typography, Button, Spin, Tag, Divider, Collapse, message, Empty, Space,
} from 'antd';
import {
  ReloadOutlined, ThunderboltOutlined, AppleOutlined, FireOutlined,
  TrophyOutlined, RightOutlined, CoffeeOutlined, BulbOutlined,
} from '@ant-design/icons';
import { getWeeklyPlanAPI, WeeklyPlanParams, WeeklyPlanResponse } from '../api/ai';
import { getProfileAPI } from '../api/profile';
import { getAiCache, setAiCache, removeAiCache } from '../utils/aiCache';

const { Title, Text, Paragraph } = Typography;

const WEEKLY_PLAN_CACHE_KEY = 'weekly_plan';

const activityLabelMap: Record<string, string> = {
  sedentary: '久坐不动',
  light: '轻度活动',
  moderate: '中度活动',
  active: '高度活跃',
  very_active: '极度活跃',
};

const genderLabelMap: Record<string, string> = {
  male: '男',
  female: '女',
};

const WeeklyPlan: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [planData, setPlanData] = React.useState<WeeklyPlanResponse | null>(() => getAiCache<WeeklyPlanResponse>(WEEKLY_PLAN_CACHE_KEY));
  const hasCached = React.useRef(!!planData);

  const loadPlan = React.useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && hasCached.current) {
      return;
    }
    setLoading(true);
    setPlanData(null);
    try {
      const profile = await getProfileAPI();

      const params: WeeklyPlanParams = {
        weight: profile.weight,
        targetWeight: profile.targetWeight,
        targetCalories: profile.targetCalories || profile.tdee,
        height: profile.height,
        age: profile.age,
        gender: genderLabelMap[profile.gender] || profile.gender,
        activityLevel: activityLabelMap[profile.activity] || profile.activity,
        tdee: profile.tdee,
      };

      const data = await getWeeklyPlanAPI(params);
      setPlanData(data);
      setAiCache(WEEKLY_PLAN_CACHE_KEY, data);
      hasCached.current = true;
    } catch {
      message.error('生成周计划失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const handleRegenerate = () => {
    removeAiCache(WEEKLY_PLAN_CACHE_KEY);
    hasCached.current = false;
    loadPlan(true);
  };

  const dayColors = [
    { bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '#6ee7b7' },
    { bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '#93c5fd' },
    { bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '#fdba74' },
    { bg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', border: '#f9a8d4' },
    { bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', border: '#c4b5fd' },
    { bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '#86efac' },
    { bg: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)', border: '#fde047' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: '#122217' }}>
            <ThunderboltOutlined style={{ color: '#0f766e', marginRight: 10 }} />
            AI 一周计划生成
          </Title>
          <Text style={{ color: '#526157' }}>
            基于您的身体数据，AI 为您量身定制一周的饮食与健身计划
          </Text>
        </div>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRegenerate}
          loading={loading}
          style={{
            background: 'linear-gradient(135deg, #0f766e 0%, #16a34a 100%)',
            border: 'none',
            borderRadius: 12,
            height: 40,
          }}
        >
          重新生成
        </Button>
      </div>

      {loading && (
        <Card style={{ borderRadius: 28, textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
          <Paragraph style={{ marginTop: 20, color: '#6b7280', fontSize: 15 }}>
            AI 正在根据您的身体数据生成个性化周计划，预计需要 30-90 秒...
          </Paragraph>
        </Card>
      )}

      {!loading && !planData && (
        <Card style={{ borderRadius: 28 }}>
          <Empty description="暂无计划数据" />
        </Card>
      )}

      {!loading && planData && planData.summary && (
        <Card
          style={{
            borderRadius: 24,
            marginBottom: 24,
            background: planData.summary.startsWith('生成失败')
              ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
              : 'linear-gradient(135deg, #0f766e 0%, #16a34a 100%)',
            border: 'none',
          }}
        >
          <Space>
            <BulbOutlined style={{ fontSize: 22, color: planData.summary.startsWith('生成失败') ? '#fecaca' : '#fde047' }} />
            <Text style={{ color: '#f6fff8', fontSize: 15, fontWeight: 500 }}>{planData.summary}</Text>
          </Space>
        </Card>
      )}

      {!loading && planData && planData.days && planData.days.length > 0 && (
        <Row gutter={[20, 20]}>
          {planData.days.map((day, index) => {
            const colors = dayColors[index % 7];
            const diet = day.dietPlan;
            const fitness = day.fitnessPlan;

            return (
              <Col xs={24} xl={8} key={day.dayOfWeek}>
                <Card
                  style={{
                    borderRadius: 24,
                    background: colors.bg,
                    borderColor: colors.border,
                    borderWidth: 1.5,
                    height: '100%',
                  }}
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <Tag
                          style={{
                            borderRadius: 12,
                            background: colors.border,
                            border: 'none',
                            fontSize: 14,
                            fontWeight: 700,
                            padding: '4px 14px',
                          }}
                        >
                          {day.dayOfWeek}
                        </Tag>
                        <Text style={{ color: '#6b7280', fontSize: 13 }}>{day.date}</Text>
                      </Space>
                    </div>
                  }
                  headStyle={{ borderBottom: `1px solid ${colors.border}`, padding: '16px 20px' }}
                  bodyStyle={{ padding: '12px 20px 20px' }}
                >
                  <Collapse
                    ghost
                    defaultActiveKey={['diet']}
                    expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} />}
                    items={[
                      {
                        key: 'diet',
                        label: (
                          <Space>
                            <AppleOutlined style={{ color: '#16a34a' }} />
                            <Text strong style={{ fontSize: 14 }}>
                              饮食计划
                              {diet?.totalCalories ? ` · ${diet.totalCalories} kcal` : ''}
                            </Text>
                          </Space>
                        ),
                        children: diet ? (
                          <div style={{ paddingLeft: 8 }}>
                            {diet.breakfast && (
                              <MealRow
                                icon={<CoffeeOutlined style={{ color: '#f59e0b' }} />}
                                label="早餐"
                                meal={diet.breakfast}
                              />
                            )}
                            {diet.lunch && (
                              <MealRow
                                icon={<FireOutlined style={{ color: '#ef4444' }} />}
                                label="午餐"
                                meal={diet.lunch}
                              />
                            )}
                            {diet.dinner && (
                              <MealRow
                                icon={<TrophyOutlined style={{ color: '#8b5cf6' }} />}
                                label="晚餐"
                                meal={diet.dinner}
                              />
                            )}
                            {diet.snacks && diet.snacks.length > 0 && (
                              <div style={{ marginTop: 8 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>加餐</Text>
                                {diet.snacks.map((snack, i) => (
                                  <div key={i} style={{ marginTop: 4, paddingLeft: 8 }}>
                                    <Text strong style={{ fontSize: 13 }}>{snack.name}</Text>
                                    <Text style={{ color: '#6b7280', fontSize: 12, marginLeft: 8 }}>
                                      {snack.calories} kcal
                                    </Text>
                                    <br />
                                    <Text style={{ fontSize: 12, color: '#9ca3af' }}>{snack.description}</Text>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Text type="secondary">暂无饮食计划</Text>
                        ),
                      },
                      {
                        key: 'fitness',
                        label: (
                          <Space>
                            <ThunderboltOutlined style={{ color: '#f59e0b' }} />
                            <Text strong style={{ fontSize: 14 }}>
                              健身计划
                              {fitness?.estimatedCaloriesBurned ? ` · 消耗 ${fitness.estimatedCaloriesBurned} kcal` : ''}
                            </Text>
                          </Space>
                        ),
                        children: fitness ? (
                          <div style={{ paddingLeft: 8 }}>
                            <FitnessSection label="热身" content={fitness.warmUp} />
                            <FitnessSection label="主训练" content={fitness.mainWorkout} />
                            <FitnessSection label="放松拉伸" content={fitness.coolDown} />
                            {fitness.notes && (
                              <div style={{ marginTop: 10 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>注意事项</Text>
                                <Paragraph style={{ marginTop: 4, marginBottom: 0, fontSize: 12, color: '#6b7280' }}>
                                  {fitness.notes}
                                </Paragraph>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Text type="secondary">暂无健身计划</Text>
                        ),
                      },
                    ]}
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

const MealRow: React.FC<{ icon: React.ReactNode; label: string; meal: { name: string; description: string; calories: number } }> = ({
  icon, label, meal,
}) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {icon}
      <Text type="secondary" style={{ fontSize: 12 }}>{label}</Text>
      <Tag style={{ borderRadius: 8, fontSize: 11, marginLeft: 'auto' }}>{meal.calories} kcal</Tag>
    </div>
    <div style={{ marginTop: 2, paddingLeft: 22 }}>
      <Text strong style={{ fontSize: 13 }}>{meal.name}</Text>
      <br />
      <Text style={{ fontSize: 12, color: '#9ca3af' }}>{meal.description}</Text>
    </div>
  </div>
);

const FitnessSection: React.FC<{ label: string; content: string }> = ({ label, content }) => (
  <div style={{ marginBottom: 8 }}>
    <Text type="secondary" style={{ fontSize: 12 }}>{label}</Text>
    <Paragraph style={{ marginTop: 2, marginBottom: 0, fontSize: 12, color: '#374151' }}>
      {content}
    </Paragraph>
  </div>
);

export default WeeklyPlan;