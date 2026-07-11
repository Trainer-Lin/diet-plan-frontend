import React from 'react';
import { Card, Col, Row, Statistic, Table, Typography, Spin, message } from 'antd';
import { TeamOutlined, ThunderboltOutlined, FileTextOutlined, DashboardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getSystemStatsAPI, type SystemStats } from '../../api/admin';

const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState<SystemStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await getSystemStatsAPI();
        setStats(data);
      } catch {
        message.error('加载系统统计失败');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !stats) {
    return <Spin tip="加载中..." style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }} />;
  }

  const columns = [
    { title: '排名', render: (_: any, __: any, index: number) => index + 1, width: 80 },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
    { title: '记录数', dataIndex: 'recordCount', key: 'recordCount' },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>系统总览</Title>

      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <Card hoverable onClick={() => navigate('/admin/users')}>
            <Statistic
              title="用户总数"
              value={stats.totalUsers}
              prefix={<TeamOutlined style={{ color: '#1677ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="食物库总数"
              value={stats.totalFoods}
              prefix={<ThunderboltOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="饮食记录总数"
              value={stats.totalRecords}
              prefix={<FileTextOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="体重记录总数"
              value={stats.totalWeightRecords}
              prefix={<DashboardOutlined style={{ color: '#eb2f96' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="活跃用户排行（按饮食记录数）" style={{ marginTop: 24 }}>
        <Table
          dataSource={stats.topActiveUsers}
          columns={columns}
          rowKey="userId"
          pagination={false}
          size="middle"
        />
      </Card>

      <Card style={{ marginTop: 24, background: '#f6ffed', border: '1px solid #b7eb8f' }}>
        <Statistic title="管理员账号数" value={stats.adminCount} valueStyle={{ color: '#52c41a' }} />
      </Card>
    </div>
  );
};

export default AdminDashboard;
