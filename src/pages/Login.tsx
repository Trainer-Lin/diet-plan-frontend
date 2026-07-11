import React from 'react';
import { Card, Form, Input, Button, Typography, message, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useHealthStore } from '../store/useHealthStore';
import { loginAPI, getCurrentUserAPI } from '../api/auth';
import { getProfileAPI } from '../api/profile';

const { Title } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useHealthStore((state) => state.login);
  const setRole = useHealthStore((state) => state.setRole);
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      setSubmitting(true);
      const data = await loginAPI(values);
      login(data.token);

      // 获取当前用户信息（含角色）
      let userRole: string | undefined;
      try {
        const user = await getCurrentUserAPI();
        userRole = user.role;
        setRole(user.role);
      } catch {
        // 获取用户信息失败不阻塞
      }

      message.success('登录成功');

      // 管理员直接跳转到管理后台
      if (userRole === 'ADMIN') {
        navigate('/admin', { replace: true });
        return;
      }

      const redirectPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/app/dashboard';

      try {
        const profile = await getProfileAPI();
        const isProfileIncomplete =
          !profile.gender ||
          !profile.age ||
          !profile.height ||
          !profile.weight ||
          !profile.activity;

        if (isProfileIncomplete) {
          Modal.confirm({
            title: '完善个人档案',
            content: '您的身高、体重等身体数据尚未填写完整，为了获得更精准的饮食建议，请先完善个人档案。',
            okText: '去填写',
            cancelText: '稍后再说',
            onOk: () => navigate('/app/profile', { replace: true }),
            onCancel: () => navigate(redirectPath, { replace: true }),
          });
          return;
        }
      } catch {
        // 档案获取失败时不阻塞跳转
      }

      navigate(redirectPath, { replace: true });
    } catch (error) {
      message.error('登录失败');
    } finally {
      setSubmitting(false);
    }
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
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{ width: '100%', background: '#52c41a', borderColor: '#52c41a' }}
            >
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
