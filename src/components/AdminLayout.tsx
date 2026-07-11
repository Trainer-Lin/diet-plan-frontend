import React from 'react';
import { Avatar, Breadcrumb, Button, Layout, Menu, Space, Tag, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
  UserOutlined,
  FileTextOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import { useHealthStore } from '../store/useHealthStore';

const { Header, Content, Sider } = Layout;
const { Text, Title } = Typography;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useHealthStore((state) => state.logout);

  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: '管理总览' },
    { key: '/admin/users', icon: <TeamOutlined />, label: '用户管理' },
    { key: '/admin/profiles', icon: <UserOutlined />, label: '用户档案管理' },
    { key: '/admin/records', icon: <FileTextOutlined />, label: '用户记录查看' },
    { key: '/admin/foods', icon: <ThunderboltOutlined />, label: '食物库管理' },
    { key: '/admin/custom-foods', icon: <AppstoreOutlined />, label: '用户食物库管理' },
    { key: '/admin/food-reviews', icon: <AuditOutlined />, label: '食材审核' },
  ];

  const handleMenuClick = ({ key }: { key: string }) => navigate(key);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pageTitleMap: Record<string, string> = {
    '/admin': '管理总览',
    '/admin/users': '用户管理',
    '/admin/profiles': '用户档案管理',
    '/admin/records': '用户记录查看',
    '/admin/foods': '食物库管理',
    '/admin/custom-foods': '用户食物库管理',
    '/admin/food-reviews': '食材审核',
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Sider
        theme="dark"
        breakpoint="lg"
        collapsedWidth="0"
        width={240}
        style={{ background: '#1f1f1f' }}
      >
        <div style={{ margin: 20, padding: '18px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.06)' }}>
          <Space align="center" size={12}>
            <Avatar size={40} style={{ backgroundColor: '#1677ff' }} icon={<SettingOutlined />} />
            <div>
              <Title level={5} style={{ margin: 0, color: '#fff' }}>
                管理后台
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>Diet Plan Admin</Text>
            </div>
          </Space>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ background: 'transparent' }}
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
                { title: '管理后台' },
                { title: pageTitleMap[location.pathname] || '管理' },
              ]}
              style={{ marginBottom: 10 }}
            />
            <Title level={3} style={{ margin: 0, color: '#1f1f1f' }}>
              {pageTitleMap[location.pathname] || '管理'}
            </Title>
          </div>
          <Space size={12}>
            <Tag color="red" style={{ borderRadius: 999, padding: '6px 12px' }}>
              管理员
            </Tag>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              退出登录
            </Button>
          </Space>
        </Header>
        <Content style={{ padding: '0 28px 28px' }}>
          <div
            style={{
              padding: 24,
              background: '#fff',
              borderRadius: 16,
              minHeight: 'calc(100vh - 130px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
