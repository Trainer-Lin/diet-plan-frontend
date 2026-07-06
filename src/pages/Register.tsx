import React from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { registerAPI, RegisterParams } from '../api/auth';

const { Title } = Typography;

interface RegisterFormValues extends RegisterParams {
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values: RegisterFormValues) => {
    try {
      setSubmitting(true);
      await registerAPI({
        username: values.username,
        email: values.email,
        password: values.password,
        nickname: values.nickname,
      });
      message.success('注册成功，请登录');
      navigate('/login');
    } catch (error) {
      // 错误提示已由 axiosHelper 统一处理，这里不再重复弹窗
      console.error('注册异常:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ color: '#52c41a' }}>Diet Plan</Title>
          <span style={{ color: '#8c8c8c' }}>个人健康饮食计划 - 注册</span>
        </div>
        <Form
          name="register"
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
            name="nickname"
            rules={[{ required: true, message: '请输入昵称!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="昵称" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入正确的邮箱格式!' },
            ]}
          >
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{ width: '100%', background: '#52c41a', borderColor: '#52c41a' }}
            >
              注册
            </Button>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              已有账号？ <Link to="/login" style={{ color: '#52c41a' }}>去登录</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
