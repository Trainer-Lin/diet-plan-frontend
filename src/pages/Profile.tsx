import React from 'react';
import { Card, Form, InputNumber, Select, Button, message, Row, Col, Statistic } from 'antd';
import { useHealthStore } from '../store/useHealthStore';
import { ProfileFormValues } from '../types/health';

const { Option } = Select;

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const profile = useHealthStore((state) => state.profile);
  const tdee = useHealthStore((state) => state.tdee);
  const updateProfile = useHealthStore((state) => state.updateProfile);

  const onFinish = (values: ProfileFormValues) => {
    updateProfile(values);
    message.success('档案更新成功，已重新计算每日建议摄入量');
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>个人档案与目标</h2>
      <Row gutter={24}>
        <Col span={16}>
          <Card title="基础数据设置">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={profile}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="gender" label="性别" rules={[{ required: true }]}>
                    <Select>
                      <Option value="male">男</Option>
                      <Option value="female">女</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="age" label="年龄 (岁)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} min={1} max={120} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="height" label="身高 (cm)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} min={50} max={250} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="weight" label="体重 (kg)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} min={20} max={200} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="activity" label="日常活动水平" rules={[{ required: true }]}>
                    <Select>
                      <Option value="sedentary">久坐（很少运动）</Option>
                      <Option value="light">轻度活动（每周运动1-3天）</Option>
                      <Option value="moderate">中度活动（每周运动3-5天）</Option>
                      <Option value="active">高度活动（每周运动6-7天）</Option>
                      <Option value="very_active">极度活动（每天重度运动/体力劳动）</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                  保存并计算
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="健康目标" style={{ height: '100%' }}>
            {tdee > 0 ? (
              <div style={{ textAlign: 'center', paddingTop: 20 }}>
                <Statistic title="每日建议摄入热量 (TDEE)" value={tdee} suffix="kcal" valueStyle={{ color: '#52c41a', fontSize: 36, fontWeight: 'bold' }} />
                <p style={{ marginTop: 16, color: '#8c8c8c' }}>保持当前体重所需的卡路里。</p>
                <p style={{ color: '#8c8c8c' }}>如需减脂，建议在此基础上减少 300-500 kcal。</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#bfbfbf', paddingTop: 40 }}>
                请先完善左侧数据并保存
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
