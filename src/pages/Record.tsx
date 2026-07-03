import React from 'react';
import { ClockCircleOutlined, DeleteOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Empty, Form, Input, Modal, Progress, Row, Select, Space, Tag, Typography, message } from 'antd';
import { createRecordAPI, deleteRecordItemAPI, DailyDietRecordResponse, getDailyRecordsAPI } from '../api/records';
import { FoodResponse, getFoodsAPI } from '../api/foods';

interface RecordFormValues {
  meal: string;
  time: string;
  note?: string;
  foods: Array<{
    foodId: number;
    amount: string;
  }>;
}

const mealOptions = [
  { label: '早餐', value: 'breakfast' },
  { label: '午餐', value: 'lunch' },
  { label: '晚餐', value: 'dinner' },
  { label: '加餐', value: 'snack' },
];

const getTodayString = () => new Date().toISOString().slice(0, 10);
const getCurrentTimeString = () => new Date().toTimeString().slice(0, 5);

const mealLabelMap: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
};

const Record: React.FC = () => {
  const [form] = Form.useForm<RecordFormValues>();
  const [mealRecords, setMealRecords] = React.useState<DailyDietRecordResponse[]>([]);
  const [foodOptions, setFoodOptions] = React.useState<FoodResponse[]>([]);
  const [selectedDate, setSelectedDate] = React.useState(getTodayString());
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const foodMap = React.useMemo(
    () => Object.fromEntries(foodOptions.map((item) => [item.id, item])),
    [foodOptions],
  );

  const loadRecords = React.useCallback(async (date: string) => {
    try {
      setLoading(true);
      const response = await getDailyRecordsAPI(date);
      setMealRecords(response);
    } catch (error) {
      message.error('获取饮食记录失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFoods = React.useCallback(async () => {
    try {
      const response = await getFoodsAPI();
      setFoodOptions(response);
    } catch (error) {
      message.error('获取食物列表失败');
    }
  }, []);

  React.useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  React.useEffect(() => {
    loadRecords(selectedDate);
  }, [selectedDate, loadRecords]);

  const showModal = () => {
    form.setFieldsValue({
      meal: 'breakfast',
      time: getCurrentTimeString(),
      note: '',
      foods: [{ foodId: foodOptions[0]?.id, amount: '' }],
    });
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const foods = values.foods.map((item) => {
        const food = foodMap[item.foodId];
        if (!food) {
          throw new Error('请选择有效的食物');
        }

        return {
          foodId: food.id,
          name: food.name,
          amount: item.amount,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
        };
      });

      setSubmitting(true);
      await createRecordAPI({
        recordDate: selectedDate,
        meal: values.meal,
        time: values.time,
        note: values.note,
        foods,
      });
      message.success('饮食记录新增成功');
      closeModal();
      form.resetFields();
      await loadRecords(selectedDate);
    } catch (error) {
      if (error instanceof Error && error.message) {
        message.error(error.message);
        return;
      }
      message.error('请填写完整信息');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId: number) => {
    try {
      await deleteRecordItemAPI(itemId);
      message.success('删除成功');
      await loadRecords(selectedDate);
    } catch (error) {
      message.error('删除失败');
    }
  };

  return (
    <div>
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        <Col xs={24} xl={16}>
          <Card loading={loading} style={{ borderRadius: 28 }}>
            <Space direction="vertical" size={6} style={{ width: '100%' }}>
              <Typography.Title level={3} style={{ margin: 0 }}>
                今日饮食打卡
              </Typography.Title>
              <Typography.Text style={{ color: '#6b7280' }}>
                按当天日期查看记录，并从后端食物库选择食材提交饮食记录。
              </Typography.Text>
              <Input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} style={{ maxWidth: 220 }} />
            </Space>
            <Progress
              percent={Math.min(100, mealRecords.length * 25)}
              strokeColor="#16a34a"
              style={{ marginTop: 18 }}
            />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card style={{ borderRadius: 28 }}>
            <Typography.Title level={4}>记录操作</Typography.Title>
            <Typography.Paragraph style={{ color: '#6b7280', marginBottom: 18 }}>
              先选择日期，再把一餐里包含的食物逐项加入，提交后会重新拉取当天记录。
            </Typography.Paragraph>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
              style={{ background: '#0b7a29', borderColor: '#0b7a29' }}
            >
              添加一餐
            </Button>
          </Card>
        </Col>
      </Row>

      <Modal
        title="添加饮食记录"
        open={isModalVisible}
        confirmLoading={submitting}
        onOk={handleOk}
        onCancel={closeModal}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            meal: 'breakfast',
            time: getCurrentTimeString(),
            foods: [{}],
          }}
        >
          <Form.Item name="meal" label="餐次" rules={[{ required: true, message: '请选择餐次' }]}>
            <Select options={mealOptions} />
          </Form.Item>
          <Form.Item name="time" label="时间" rules={[{ required: true, message: '请选择时间' }]}>
            <Input type="time" />
          </Form.Item>
          <Form.Item name="note" label="备注">
            <Input.TextArea rows={2} placeholder="可选备注" />
          </Form.Item>

          <Form.List name="foods">
            {(fields, { add, remove }) => (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Card key={field.key} size="small" style={{ borderRadius: 16 }}>
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'foodId']}
                        label="食物"
                        rules={[{ required: true, message: '请选择食物' }]}
                      >
                        <Select
                          placeholder="请选择食物"
                          options={foodOptions.map((item) => ({
                            label: `${item.name} (${item.calories} kcal)`,
                            value: item.id,
                          }))}
                        />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'amount']}
                        label="摄入份量"
                        rules={[{ required: true, message: '请输入份量' }]}
                      >
                        <Input placeholder="例如：150g / 1份" />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>
                          删除这一项
                        </Button>
                      ) : null}
                    </Space>
                  </Card>
                ))}
                <Button type="dashed" icon={<PlusOutlined />} onClick={() => add()}>
                  添加食物项
                </Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>

      {mealRecords.length === 0 ? (
        <Card style={{ borderRadius: 28 }}>
          <Empty description="当天暂无饮食记录" />
        </Card>
      ) : (
        <Row gutter={[20, 20]}>
          {mealRecords.map((record) => (
            <Col xs={24} lg={12} key={record.id}>
              <Card loading={loading} style={{ borderRadius: 28, height: '100%' }}>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <div>
                      <Typography.Title level={4} style={{ margin: 0 }}>
                        {mealLabelMap[record.meal] || record.meal}
                      </Typography.Title>
                      <Typography.Text style={{ color: '#6b7280' }}>
                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                        {record.time?.slice(0, 5) || record.time}
                      </Typography.Text>
                    </div>
                    <Tag color="green" style={{ borderRadius: 999, padding: '6px 12px' }}>
                      {record.totalCalories} kcal
                    </Tag>
                  </Space>
                  <div>
                    {record.foods.map((food, index) => (
                      <div key={`${record.id}-${food.id}`} style={{ padding: '12px 0' }}>
                        <Space style={{ width: '100%', justifyContent: 'space-between' }} align="start">
                          <div>
                            <Typography.Text strong>{food.name}</Typography.Text>
                            <Typography.Text style={{ display: 'block', color: '#6b7280' }}>
                              {food.amount}
                            </Typography.Text>
                          </div>
                          <Space>
                            <Typography.Text>{food.calories} kcal</Typography.Text>
                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(food.id)}>
                              删除
                            </Button>
                          </Space>
                        </Space>
                        {index < record.foods.length - 1 ? <Divider style={{ margin: '12px 0 0' }} /> : null}
                      </div>
                    ))}
                  </div>
                  {record.note ? (
                    <Card
                      style={{ borderRadius: 20, background: '#f5faf6', borderColor: 'rgba(15,118,110,0.08)' }}
                      bodyStyle={{ padding: '14px 16px' }}
                    >
                      <Typography.Text style={{ color: '#355244' }}>{record.note}</Typography.Text>
                    </Card>
                  ) : null}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Record;
