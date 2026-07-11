import React from 'react';
import { Button, Card, Col, Row, Space, Table, Tag, Typography, message } from 'antd';
import { FileTextOutlined, UserOutlined, LineChartOutlined } from '@ant-design/icons';
import { adminListUsersAPI, adminGetUserDietRecordsAPI, adminGetUserWeightRecordsAPI, type AdminUserItem, type AdminUserDietRecord, type AdminUserWeightRecord } from '../../api/admin';

const { Title } = Typography;

const mealTypeMap: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
};

const UserRecords: React.FC = () => {
  const [users, setUsers] = React.useState<AdminUserItem[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<AdminUserItem | null>(null);
  const [activeTab, setActiveTab] = React.useState<'diet' | 'weight'>('diet');
  const [dietRecords, setDietRecords] = React.useState<AdminUserDietRecord[]>([]);
  const [weightRecords, setWeightRecords] = React.useState<AdminUserWeightRecord[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    adminListUsersAPI().then(setUsers).catch(() => message.error('加载用户列表失败'));
  }, []);

  const handleSelectUser = async (user: AdminUserItem) => {
    setSelectedUser(user);
    setLoading(true);
    try {
      const [diet, weight] = await Promise.all([
        adminGetUserDietRecordsAPI(user.id),
        adminGetUserWeightRecordsAPI(user.id),
      ]);
      setDietRecords(diet);
      setWeightRecords(weight);
    } catch {
      message.error('加载记录失败');
      setDietRecords([]);
      setWeightRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const dietColumns = [
    { title: '日期', dataIndex: 'recordDate', key: 'recordDate', render: (d: string) => d || '-' },
    {
      title: '餐次', dataIndex: 'mealType', key: 'mealType',
      render: (t: string) => <Tag color="blue">{mealTypeMap[t] || t}</Tag>,
    },
    { title: '总热量', dataIndex: 'totalCalories', key: 'totalCalories', render: (c: number) => `${c} kcal` },
    { title: '备注', dataIndex: 'note', key: 'note', render: (n: string) => n || '-' },
    { title: '记录时间', dataIndex: 'createdAt', key: 'createdAt', render: (t: string) => t ? new Date(t).toLocaleString('zh-CN') : '-' },
    {
      title: '食物明细', key: 'items',
      render: (_: any, record: AdminUserDietRecord) => (
        <div style={{ maxHeight: 120, overflowY: 'auto' }}>
          {record.items.map((item) => (
            <div key={item.id} style={{ marginBottom: 4, fontSize: 12 }}>
              <span>{item.foodName}</span>
              <span style={{ color: '#999', marginLeft: 8 }}>{item.amount}</span>
              <span style={{ color: '#1677ff', marginLeft: 8 }}>{item.calories} kcal</span>
            </div>
          ))}
          {record.items.length === 0 && <span style={{ color: '#999', fontSize: 12 }}>无明细</span>}
        </div>
      ),
    },
  ];

  const weightColumns = [
    { title: '日期', dataIndex: 'recordDate', key: 'recordDate' },
    { title: '体重', dataIndex: 'weight', key: 'weight', render: (w: number) => `${w} kg` },
    {
      title: 'BMI', dataIndex: 'bmi', key: 'bmi',
      render: (b: number) => {
        const bmi = parseFloat(b.toFixed(1));
        let color = 'default';
        if (bmi < 18.5) color = 'blue';
        else if (bmi < 24) color = 'green';
        else if (bmi < 28) color = 'orange';
        else color = 'red';
        return <Tag color={color}>{bmi}</Tag>;
      },
    },
  ];

  const getWeightTrend = () => {
    if (weightRecords.length < 2) return '-';
    const first = weightRecords[0].weight;
    const last = weightRecords[weightRecords.length - 1].weight;
    const diff = last - first;
    const trend = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
    const color = diff > 0 ? 'red' : diff < 0 ? 'green' : 'default';
    return <Tag color={color}>{trend} {Math.abs(diff).toFixed(1)} kg</Tag>;
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>用户记录查看</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card title="选择用户" style={{ height: 'calc(100vh - 180px)' }}>
            <div style={{ maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
              {users.map((user) => (
                <Button
                  key={user.id}
                  block
                  style={{ marginBottom: 8, textAlign: 'left' }}
                  type={selectedUser?.id === user.id ? 'primary' : 'default'}
                  onClick={() => handleSelectUser(user)}
                >
                  <Space>
                    <UserOutlined />
                    <div>
                      <div>{user.nickname}</div>
                      <div style={{ fontSize: 12, color: '#999' }}>@{user.username}</div>
                    </div>
                    {user.role === 'ADMIN' && <Tag color="red">管理员</Tag>}
                  </Space>
                </Button>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={16}>
          {selectedUser ? (
            <>
              <Card title={`${selectedUser.nickname} 的记录`} extra={
                <Space>
                  <Button
                    type={activeTab === 'diet' ? 'primary' : 'default'}
                    icon={<FileTextOutlined />}
                    onClick={() => setActiveTab('diet')}
                  >饮食记录</Button>
                  <Button
                    type={activeTab === 'weight' ? 'primary' : 'default'}
                    icon={<LineChartOutlined />}
                    onClick={() => setActiveTab('weight')}
                  >体重记录</Button>
                </Space>
              } loading={loading}>
                {activeTab === 'diet' ? (
                  <div>
                    <div style={{ marginBottom: 16 }}>
                      饮食记录总数：<Tag color="blue">{dietRecords.length}</Tag>
                    </div>
                    <Table
                      dataSource={dietRecords}
                      columns={dietColumns}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                    />
                  </div>
                ) : (
                  <div>
                    <Space size="large" style={{ marginBottom: 16 }}>
                      <span>体重记录总数：<Tag color="blue">{weightRecords.length}</Tag></span>
                      <span>总体趋势：{getWeightTrend()}</span>
                    </Space>
                    <Table
                      dataSource={weightRecords}
                      columns={weightColumns}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                    />
                  </div>
                )}
              </Card>
            </>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                <UserOutlined style={{ fontSize: 48, marginBottom: 16, display: 'block' }} />
                <p>请从左侧选择一个用户查看记录</p>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default UserRecords;
