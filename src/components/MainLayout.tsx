import React from 'react';
import { Avatar, Breadcrumb, Button, Layout, Menu, Space, Tag, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AimOutlined,
  BarChartOutlined,
  DashboardOutlined,
  EditOutlined,
  HomeOutlined,
  LogoutOutlined,
  RadarChartOutlined,
  ReadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useHealthStore } from '../store/useHealthStore';

const { Header, Content, Sider } = Layout;
const { Text, Title } = Typography;
const sloganLines = ['🥪三餐烟火🥘', '🍻四季安康💞'];
const sloganLineStyle: React.CSSProperties = {
  color: '#f6fff8',
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1.25,
  letterSpacing: 1,
};

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useHealthStore((state) => state.token);
  const logout = useHealthStore((state) => state.logout);

  const menuItems = [
    {
      key: '/app/dashboard',
      icon: <DashboardOutlined />,
      label: '总览看板',
    },
    {
      key: '/app/record',
      icon: <EditOutlined />,
      label: '饮食记录',
    },
    {
      key: '/app/foods',
      icon: <ReadOutlined />,
      label: '食物库',
    },
    {
      key: '/app/analytics',
      icon: <BarChartOutlined />,
      label: '统计分析',
    },
    {
      key: '/app/goals',
      icon: <AimOutlined />,
      label: '目标管理',
    },
    {
      key: '/app/profile',
      icon: <UserOutlined />,
      label: '个人档案',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    if (token) {
      logout();
      navigate('/login');
      return;
    }

    navigate('/');
  };

  const pageTitleMap: Record<string, string> = {
    '/app/dashboard': '健康总览',
    '/app/record': '饮食记录',
    '/app/foods': '食物库',
    '/app/analytics': '统计分析',
    '/app/goals': '目标管理',
    '/app/profile': '个人档案',
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#eef5ef' }}>
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        width={264}
        style={{
          borderRight: '1px solid rgba(15, 118, 110, 0.08)',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div
          style={{
            margin: 20,
            padding: '18px 16px',
            borderRadius: 24,
            background: 'linear-gradient(135deg, #0f766e 0%, #16a34a 100%)',
            color: '#f6fff8',
          }}
        >
          <Space align="center" size={14}>
            <Avatar size={46} style={{ backgroundColor: 'rgba(255,255,255,0.16)' }} icon={<RadarChartOutlined />} />
            <div>
              <Title level={4} style={{ margin: 0, color: '#f6fff8' }}>
                Diet Plan
              </Title>
              <Text style={{ color: 'rgba(246,255,248,0.82)' }}>个人健康饮食工作台</Text>
            </div>
          </Space>
          <div
            style={{
              marginTop: 18,
              padding: '12px 14px',
              borderRadius: 18,
              background: 'rgba(255,255,255,0.14)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 4,
            }}
          >
            {sloganLines.map((line) => (
              <div key={line} style={sloganLineStyle}>
                {line}
              </div>
            ))}
          </div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderInlineEnd: 'none', padding: '8px 12px' }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            height: 'auto',
            padding: '22px 28px 10px',
            background: 'transparent',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Breadcrumb
              items={[
                { title: <HomeOutlined /> },
                { title: '应用中心' },
                { title: pageTitleMap[location.pathname] || '健康管理' },
              ]}
              style={{ marginBottom: 10 }}
            />
            <Title level={3} style={{ margin: 0, color: '#122217' }}>
              {pageTitleMap[location.pathname] || '健康管理'}
            </Title>
            <Text style={{ color: '#526157' }}>围绕饮食记录、目标追踪与趋势分析组织日常计划。</Text>
          </div>
          <Space size={12}>
            <Tag color={token ? 'green' : 'gold'} style={{ borderRadius: 999, padding: '6px 12px' }}>
              {token ? '已登录' : '游客体验'}
            </Tag>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              {token ? '退出登录' : '返回首页'}
            </Button>
          </Space>
        </Header>
        <Content style={{ padding: '0 28px 28px', overflow: 'initial' }}>
          <div
            style={{
              padding: 28,
              background: 'rgba(255, 255, 255, 0.78)',
              borderRadius: 32,
              minHeight: 'calc(100vh - 130px)',
              boxShadow: '0 24px 80px rgba(15, 23, 42, 0.08)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
