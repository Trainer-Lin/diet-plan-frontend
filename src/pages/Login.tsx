import React from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useHealthStore } from '../store/useHealthStore';

const { Title } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useHealthStore((state) => state.login);

  const onFinish = (values: { username: string; password: string }) => {
    console.log('Received values of form: ', values);
    login('mock_token_123');
    message.success('登录成功');
    const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/app/dashboard';
    navigate(redirectTo);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ color: '#52c41a' }}>Diet Plan</Title>
          <span style={{ color: '#8c8c8c' }}>个人健康饮食计划 - 登录</span>
        </div>
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%', background: '#52c41a', borderColor: '#52c41a' }}>
              登录
            </Button>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              还没账号？ <Link to="/register" style={{ color: '#52c41a' }}>立即注册</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
