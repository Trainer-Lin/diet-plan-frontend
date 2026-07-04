import React, { useEffect, useMemo, useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FoodLibraryItem } from '../types/health';
import { createCustomFoodAPI, FoodResponse, getFoodsAPI, searchFoodsAPI } from '../api/foods';

interface CustomFoodFormValues {
  name: string;
  category: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const formatServing = (food: FoodResponse) => {
  if (food.serving) {
    return food.serving;
  }

  if (food.servingSize !== undefined && food.servingUnit) {
    return `${food.servingSize}${food.servingUnit}`;
  }

  return '--';
};

const mapFoodItem = (food: FoodResponse): FoodLibraryItem => ({
  key: String(food.id),
  name: food.name,
  category: food.category,
  serving: formatServing(food),
  calories: food.calories,
  protein: food.protein,
  carbs: food.carbs,
  fat: food.fat,
  tags: food.tags || [],
});

const FoodLibrary: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [foodLibraryItems, setFoodLibraryItems] = useState<FoodLibraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<CustomFoodFormValues>();

  const loadFoods = React.useCallback(async (searchKeyword?: string) => {
    try {
      setLoading(true);
      const response = searchKeyword ? await searchFoodsAPI(searchKeyword) : await getFoodsAPI();
      setFoodLibraryItems(response.map(mapFoodItem));
    } catch (error) {
      message.error('获取食物库失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadFoods(keyword.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [keyword, loadFoods]);

  const dataSource = useMemo(
    () => foodLibraryItems,
    [foodLibraryItems],
  );

  const columns: ColumnsType<FoodLibraryItem> = [
    {
      title: '食物名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{record.name}</Typography.Text>
          <Typography.Text style={{ color: '#6b7280' }}>{record.category}</Typography.Text>
        </Space>
      ),
    },
    {
      title: '份量',
      dataIndex: 'serving',
      key: 'serving',
    },
    {
      title: '热量',
      dataIndex: 'calories',
      key: 'calories',
      render: (value) => `${value} kcal`,
    },
    {
      title: '蛋白质',
      dataIndex: 'protein',
      key: 'protein',
      render: (value) => `${value} g`,
    },
    {
      title: '碳水',
      dataIndex: 'carbs',
      key: 'carbs',
      render: (value) => `${value} g`,
    },
    {
      title: '脂肪',
      dataIndex: 'fat',
      key: 'fat',
      render: (value) => `${value} g`,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space wrap>
          {tags.map((tag) => (
            <Tag key={tag} color="green">
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await createCustomFoodAPI(values);
      message.success('新增自定义食材成功');
      setModalOpen(false);
      form.resetFields();
      await loadFoods(keyword.trim());
    } catch (error) {
      if (error instanceof Error) {
        return;
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Card style={{ borderRadius: 28, marginBottom: 20 }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>
              食物库与营养信息
            </Typography.Title>
            <Typography.Text style={{ color: '#6b7280' }}>
              为您的饮食记录提供全面的热量与营养素查询支持，助您精准把控每一餐。
            </Typography.Text>
          </div>
          <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="搜索食物名称或分类"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              style={{ width: 320 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
              style={{ background: '#0b7a29', borderColor: '#0b7a29' }}
            >
              新增自定义食材
            </Button>
          </Space>
        </Space>
      </Card>

      <Card style={{ borderRadius: 28 }}>
        <Table<FoodLibraryItem>
          loading={loading}
          rowKey="key"
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 960 }}
        />
      </Card>

      <Modal
        title="新增自定义食材"
        open={modalOpen}
        confirmLoading={submitting}
        onOk={handleCreate}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="食物名称" rules={[{ required: true, message: '请输入食物名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true, message: '请输入分类' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="servingSize" label="标准份量" rules={[{ required: true, message: '请输入标准份量' }]}>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item name="servingUnit" label="单位" rules={[{ required: true, message: '请输入单位' }]}>
            <Select
              options={[
                { label: '克', value: '克' },
                { label: '毫升', value: '毫升' },
                { label: '份', value: '份' },
                { label: '个', value: '个' },
              ]}
            />
          </Form.Item>
          <Form.Item name="calories" label="热量(kcal)" rules={[{ required: true, message: '请输入热量' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="protein" label="蛋白质(g)" rules={[{ required: true, message: '请输入蛋白质' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="carbs" label="碳水(g)" rules={[{ required: true, message: '请输入碳水' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="fat" label="脂肪(g)" rules={[{ required: true, message: '请输入脂肪' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FoodLibrary;
