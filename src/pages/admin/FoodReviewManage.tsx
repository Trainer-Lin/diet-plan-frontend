import React from 'react';
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Tag, Typography, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  adminListFoodReviewsAPI,
  adminApproveFoodReviewAPI,
  adminRejectFoodReviewAPI,
  type FoodReviewTicketItem,
  type FoodReviewActionParams,
} from '../../api/admin';

const { Title } = Typography;

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: '待审核', color: 'orange' },
  APPROVED: { label: '已通过', color: 'green' },
  REJECTED: { label: '已拒绝', color: 'red' },
};

const FoodReviewManage: React.FC = () => {
  const [tickets, setTickets] = React.useState<FoodReviewTicketItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [rejectingTicket, setRejectingTicket] = React.useState<FoodReviewTicketItem | null>(null);
  const [rejectForm] = Form.useForm<FoodReviewActionParams>();

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminListFoodReviewsAPI();
      setTickets(data);
    } catch {
      message.error('加载审核工单失败');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const handleApprove = async (ticket: FoodReviewTicketItem) => {
    try {
      await adminApproveFoodReviewAPI(ticket.id);
      message.success('审核通过，已发布到共享食物库');
      load();
    } catch {
      // 错误已由 axios 拦截器提示
    }
  };

  const openRejectModal = (ticket: FoodReviewTicketItem) => {
    setRejectingTicket(ticket);
    rejectForm.resetFields();
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectingTicket) return;
    try {
      const values = await rejectForm.validateFields();
      await adminRejectFoodReviewAPI(rejectingTicket.id, values);
      message.success('已拒绝该食材发布申请');
      setRejectModalOpen(false);
      setRejectingTicket(null);
      load();
    } catch {
      // 校验失败或接口失败
    }
  };

  const columns = [
    { title: '工单 ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '食物名称', dataIndex: 'name', key: 'name' },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '份量', dataIndex: 'serving', key: 'serving' },
    { title: '热量(kcal)', dataIndex: 'calories', key: 'calories' },
    { title: '蛋白质(g)', dataIndex: 'protein', key: 'protein' },
    { title: '碳水(g)', dataIndex: 'carbs', key: 'carbs' },
    { title: '脂肪(g)', dataIndex: 'fat', key: 'fat' },
    {
      title: '提交者',
      key: 'submitter',
      render: (_: any, record: FoodReviewTicketItem) => (
        <Space direction="vertical" size={0}>
          <span>{record.submitterNickname || '-'}</span>
          <span style={{ color: '#999', fontSize: 12 }}>@{record.submitterUsername}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = statusMap[status] || { label: status, color: 'default' };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (t: string) => (t ? new Date(t).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FoodReviewTicketItem) => {
        if (record.status !== 'PENDING') {
          return (
            <span style={{ color: '#999' }}>
              {record.status === 'APPROVED' ? '已通过' : '已拒绝'}
            </span>
          );
        }
        return (
          <Space>
            <Popconfirm
              title="确认通过该食材？"
              description="通过后该食材将发布到共享食物库，所有用户可见。"
              okText="通过"
              cancelText="取消"
              onConfirm={() => handleApprove(record)}
            >
              <Button type="link" icon={<CheckOutlined />} style={{ color: '#52c41a' }}>
                通过
              </Button>
            </Popconfirm>
            <Button type="link" danger icon={<CloseOutlined />} onClick={() => openRejectModal(record)}>
              拒绝
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>食材审核</Title>
      <Card>
        <Table
          dataSource={tickets}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="拒绝食材发布申请"
        open={rejectModalOpen}
        onOk={handleReject}
        onCancel={() => setRejectModalOpen(false)}
        okText="确认拒绝"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item label="审核备注" name="remark">
            <Input.TextArea rows={3} placeholder="可选：填写拒绝原因" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FoodReviewManage;
