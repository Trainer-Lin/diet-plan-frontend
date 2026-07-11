import React from 'react';
import { Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Space, Table, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  adminListOfficialFoodsAPI,
  adminCreateFoodAPI,
  adminUpdateFoodAPI,
  adminDeleteFoodAPI,
  type AdminFoodParams,
} from '../../api/admin';
import type { FoodResponse } from '../../api/foods';

const { Title } = Typography;

const FoodManage: React.FC = () => {
  const [foods, setFoods] = React.useState<FoodResponse[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<FoodResponse | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminListOfficialFoodsAPI();
      setFoods(data);
    } catch {
      message.error('加载食物列表失败');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (food: FoodResponse) => {
    setEditing(food);
    const [size, unit] = (food.serving || '100 g').split(' ');
    form.setFieldsValue({
      name: food.name,
      category: food.category,
      servingUnit: unit || 'g',
      servingSize: Number(size) || 100,
      calories: food.calories,
      protein: Number(food.protein),
      carbs: Number(food.carbs),
      fat: Number(food.fat),
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const params: AdminFoodParams = {
        name: values.name,
        category: values.category,
        servingUnit: values.servingUnit,
        servingSize: values.servingSize,
        calories: values.calories,
        protein: values.protein,
        carbs: values.carbs,
        fat: values.fat,
      };
      setSubmitting(true);
      if (editing) {
        await adminUpdateFoodAPI(editing.id, params);
        message.success('修改成功');
      } else {
        await adminCreateFoodAPI(params);
        message.success('新增成功');
      }
      setModalOpen(false);
      load();
    } catch {
      // 校验或接口失败
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (food: FoodResponse) => {
    try {
      await adminDeleteFoodAPI(food.id);
      message.success('删除成功');
      load();
    } catch {
      // 错误已提示
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
      title: '操作',
      key: 'action',
      render: (_: any, record: FoodResponse) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除该食物？"
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>食物库管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增食物
        </Button>
      </div>
      <Card>
        <Table
          dataSource={foods}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editing ? '编辑食物' : '新增食物'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="保存"
        cancelText="取消"
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="食物名称" name="name" rules={[{ required: true, message: '请输入食物名称' }]}>
            <Input placeholder="如：米饭" />
          </Form.Item>
          <Form.Item label="分类" name="category" rules={[{ required: true, message: '请输入分类' }]}>
            <Input placeholder="如：主食" />
          </Form.Item>
          <Space style={{ display: 'flex' }}>
            <Form.Item label="标准份量" name="servingSize" rules={[{ required: true, message: '请输入' }]}>
              <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="单位" name="servingUnit" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="g / ml / 个" style={{ width: 120 }} />
            </Form.Item>
          </Space>
          <Form.Item label="热量(kcal)" name="calories" rules={[{ required: true, message: '请输入' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Space style={{ display: 'flex' }}>
            <Form.Item label="蛋白质(g)" name="protein" rules={[{ required: true }]}>
              <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="碳水(g)" name="carbs" rules={[{ required: true }]}>
              <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="脂肪(g)" name="fat" rules={[{ required: true }]}>
              <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default FoodManage;
