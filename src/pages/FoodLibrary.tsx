import React, { useMemo, useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FoodLibraryItem } from '../types/health';
import { useHealthStore } from '../store/useHealthStore';

const FoodLibrary: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const foodLibraryItems = useHealthStore((state) => state.foodLibraryItems);

  const dataSource = useMemo(
    () => foodLibraryItems.filter((item) => item.name.includes(keyword) || item.category.includes(keyword)),
    [foodLibraryItems, keyword],
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

  return (
    <div>
      <Card style={{ borderRadius: 28, marginBottom: 20 }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>
              食物库与营养信息
            </Typography.Title>
            <Typography.Text style={{ color: '#6b7280' }}>
              为饮食记录提供查询支持，也方便后端队友准备基础食物表。
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
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#0b7a29', borderColor: '#0b7a29' }}>
              新增自定义食材
            </Button>
          </Space>
        </Space>
      </Card>

      <Card style={{ borderRadius: 28 }}>
        <Table<FoodLibraryItem>
          rowKey="key"
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 960 }}
        />
      </Card>
    </div>
  );
};

export default FoodLibrary;
