import React from 'react';
import { Button, Card, Col, Form, InputNumber, Modal, Row, Select, Space, Tag, Typography, message } from 'antd';
import { EditOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { adminListUsersAPI, adminGetUserProfileAPI, adminUpdateUserProfileAPI, type AdminUserItem, type AdminUserProfileItem } from '../../api/admin';

const { Title } = Typography;

const activityOptions = [
  { value: 'sedentary', label: '久坐型' },
  { value: 'light', label: '轻度活动' },
  { value: 'moderate', label: '中度活动' },
  { value: 'active', label: '高度活动' },
  { value: 'very_active', label: '极高活动' },
];

const UserProfileManage: React.FC = () => {
  const [users, setUsers] = React.useState<AdminUserItem[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<AdminUserItem | null>(null);
  const [profile, setProfile] = React.useState<AdminUserProfileItem | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editForm] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const loadUsers = async () => {
    try {
      const data = await adminListUsersAPI();
      setUsers(data.filter((u) => u.role !== 'ADMIN'));
    } catch {
      message.error('加载用户列表失败');
    }
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  const handleSelectUser = async (user: AdminUserItem) => {
    setSelectedUser(user);
    setLoading(true);
    try {
      const data = await adminGetUserProfileAPI(user.id);
      setProfile(data);
    } catch {
      message.error('加载用户档案失败');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!profile) return;
    editForm.setFieldsValue({
      gender: profile.gender,
      age: profile.age,
      height: profile.height,
      weight: profile.weight,
      activity: profile.activity,
      targetWeight: profile.targetWeight || undefined,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = editForm.getFieldsValue();
    try {
      await adminUpdateUserProfileAPI(selectedUser!.id, {
        ...values,
        targetWeight: values.targetWeight || null,
      });
      message.success('修改成功');
      setModalOpen(false);
      handleSelectUser(selectedUser!);
    } catch {
      // 错误已由 axios 拦截器提示
    }
  };

  const getBmi = () => {
    if (!profile || !profile.height || !profile.weight) return '-';
    const heightInMeters = profile.height / 100;
    const bmi = profile.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBmiStatus = () => {
    const bmi = parseFloat(getBmi());
    if (isNaN(bmi)) return { text: '-', color: 'default' };
    if (bmi < 18.5) return { text: '偏瘦', color: 'blue' };
    if (bmi < 24) return { text: '正常', color: 'green' };
    if (bmi < 28) return { text: '超重', color: 'orange' };
    return { text: '肥胖', color: 'red' };
  };

  const bmiStatus = getBmiStatus();

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>用户档案管理</Title>
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
                  </Space>
                </Button>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={16}>
          <Card
            title={selectedUser ? `${selectedUser.nickname} 的档案` : '请选择用户'}
            extra={selectedUser && profile ? (
              <Space>
                <Button type="link" icon={<EyeOutlined />} onClick={() => handleSelectUser(selectedUser!)}>刷新</Button>
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>编辑档案</Button>
              </Space>
            ) : null}
            loading={loading}
          >
            {profile ? (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card size="small" title="基本信息">
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                          <span style={{ color: '#999' }}>用户名：</span>
                          <strong>{profile.username}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#999' }}>昵称：</span>
                          <strong>{profile.nickname}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#999' }}>角色：</span>
                          <Tag color={profile.role === 'ADMIN' ? 'red' : 'blue'}>{profile.role === 'ADMIN' ? '管理员' : '普通用户'}</Tag>
                        </div>
                        <div>
                          <span style={{ color: '#999' }}>性别：</span>
                          <strong>{profile.gender === 'male' ? '男' : '女'}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#999' }}>年龄：</span>
                          <strong>{profile.age} 岁</strong>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" title="身体指标">
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                          <span style={{ color: '#999' }}>身高：</span>
                          <strong>{profile.height} cm</strong>
                        </div>
                        <div>
                          <span style={{ color: '#999' }}>体重：</span>
                          <strong>{profile.weight} kg</strong>
                        </div>
                        <div>
                          <span style={{ color: '#999' }}>BMI：</span>
                          <Tag color={bmiStatus.color}>{getBmi()} ({bmiStatus.text})</Tag>
                        </div>
                        <div>
                          <span style={{ color: '#999' }}>目标体重：</span>
                          <strong>{profile.targetWeight || '-'}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#999' }}>活动等级：</span>
                          <strong>{activityOptions.find((o) => o.value === profile.activity)?.label || profile.activity}</strong>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                </Row>
                <Card size="small" title="热量计算" style={{ marginTop: 16 }}>
                  <Space direction="vertical" size="middle">
                    <div>
                      <span style={{ color: '#999' }}>基础代谢率 (TDEE)：</span>
                      <strong style={{ fontSize: 20, color: '#1677ff' }}>{profile.tdee} kcal</strong>
                    </div>
                    <div>
                      <span style={{ color: '#999' }}>建议每日热量摄入：</span>
                      <strong>{profile.targetCalories || '-'}</strong>
                    </div>
                  </Space>
                </Card>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                <UserOutlined style={{ fontSize: 48, marginBottom: 16, display: 'block' }} />
                <p>请从左侧选择一个用户查看档案</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Modal title="编辑用户档案" open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} okText="保存" cancelText="取消">
        <Form form={editForm} layout="vertical">
          <Form.Item label="性别" name="gender" rules={[{ required: true, message: '请选择性别' }]}>
            <Select options={[{ value: 'male', label: '男' }, { value: 'female', label: '女' }]} />
          </Form.Item>
          <Form.Item label="年龄" name="age" rules={[{ required: true, message: '请输入年龄' }]}>
            <InputNumber min={1} max={120} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="身高 (cm)" name="height" rules={[{ required: true, message: '请输入身高' }]}>
            <InputNumber min={50} max={250} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="体重 (kg)" name="weight" rules={[{ required: true, message: '请输入体重' }]}>
            <InputNumber min={10} max={300} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="活动等级" name="activity" rules={[{ required: true, message: '请选择活动等级' }]}>
            <Select options={activityOptions} />
          </Form.Item>
          <Form.Item label="目标体重 (kg)" name="targetWeight">
            <InputNumber min={10} max={300} style={{ width: '100%' }} placeholder="可选" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfileManage;
