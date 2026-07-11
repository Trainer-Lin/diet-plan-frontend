import React from 'react';
import { Button, Card, Input, Popconfirm, Space, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { adminListCustomFoodsAPI, adminDeleteCustomFoodAPI, type CustomFoodItem } from '../../api/admin';

const { Title } = Typography;

const CustomFoodManage: React.FC = () => {
  const [foods, setFoods] = React.useState<CustomFoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = React.useState<CustomFoodItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchKeyword, setSearchKeyword] = React.useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminListCustomFoodsAPI();
      setFoods(data);
      setFilteredFoods(data);
    } catch {
      message.error('加载用户食物库失败');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    if (!value.trim()) {
      setFilteredFoods(foods);
      return;
    }
    const keyword = value.toLowerCase();
    const filtered = foods.filter(
      (f) =>
        f.name.toLowerCase().includes(keyword) ||
        f.category.toLowerCase().includes(keyword) ||
        f.creatorUsername.toLowerCase().includes(keyword) ||
        f.creatorNickname.toLowerCase().includes(keyword),
    );
    setFilteredFoods(filtered);
  };

  const handleDelete = async (food: CustomFoodItem) => {
    try {
      await adminDeleteCustomFoodAPI(food.id);
      message.success('删除成功');
      load();
    } catch {
      // 错误已由 axios 拦截器提示
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: '食物名称', dataIndex: 'name', key: 'name' },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '份量', dataIndex: 'serving', key: 'serving' },
    { title: '热量(kcal)', dataIndex: 'calories', key: 'calories' },
    { title: '蛋白质(g)', dataIndex: 'protein', key: 'protein' },
    { title: '碳水(g)', dataIndex: 'carbs', key: 'carbs' },
    { title: '脂肪(g)', dataIndex: 'fat', key: 'fat' },
    {
      title: '创建者',
      key: 'creator',
      render: (_: any, record: CustomFoodItem) => (
        <Space direction="vertical" size={0}>
          <span>{record.creatorNickname || '-'}</span>
          <span style={{ color: '#999', fontSize: 12 }}>@{record.creatorUsername}</span>
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (t: string) => (t ? new Date(t).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CustomFoodItem) => (
        <Popconfirm
          title="确认删除该用户自定义食物？"
          description="删除后用户将无法再使用该食物"
          okText="删除"
          cancelText="取消"
          okButtonProps={{ danger: true }}
          onConfirm={() => handleDelete(record)}
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>用户食物库管理</Title>
        <Input
          placeholder="搜索食物名称 / 分类 / 用户"
          prefix={<SearchOutlined />}
          value={searchKeyword}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Space size="large">
          <span>
            自定义食物总数：<Tag color="blue" style={{ fontSize: 14 }}>{foods.length}</Tag>
          </span>
          <span>
            当前筛选结果：<Tag color="green" style={{ fontSize: 14 }}>{filteredFoods.length}</Tag>
          </span>
        </Space>
      </Card>

      <Card>
        <Table
          dataSource={filteredFoods}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default CustomFoodManage;
