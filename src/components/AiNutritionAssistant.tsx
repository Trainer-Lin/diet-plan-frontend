import React from 'react';
import { Button, Input, Popover, Spin, Typography, message } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { getFoodNutritionAPI, FoodNutritionResponse } from '../api/ai';

const { Text, Paragraph } = Typography;

interface Props {
  onFill: (data: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize?: number;
    servingUnit?: string;
  }) => void;
}

const AiNutritionAssistant: React.FC<Props> = ({ onFill }) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<FoodNutritionResponse | null>(null);

  const handleQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await getFoodNutritionAPI({ foodName: query.trim() });
      setResult(data);
    } catch {
      message.error('查询失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleFill = () => {
    if (result) {
      onFill({
        name: result.name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        servingSize: result.servingSize,
        servingUnit: result.servingUnit,
      });
      setOpen(false);
      setQuery('');
      setResult(null);
    }
  };

  const handleOpenChange = (visible: boolean) => {
    setOpen(visible);
    if (!visible) {
      setQuery('');
      setResult(null);
    }
  };

  const content = (
    <div style={{ width: 280 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Input
          placeholder="输入食物名称，如：一个鸡蛋"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={handleQuery}
          size="small"
        />
        <Button
          type="primary"
          size="small"
          onClick={handleQuery}
          loading={loading}
          style={{ background: '#0f766e' }}
        >
          查询
        </Button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <Spin size="small" />
          <Text style={{ display: 'block', marginTop: 8, color: '#6b7280', fontSize: 12 }}>
            AI 正在查询...
          </Text>
        </div>
      )}

      {result && !loading && (
        <div
          style={{
            background: '#f0fdf4',
            borderRadius: 12,
            padding: 12,
            border: '1px solid #bbf7d0',
          }}
        >
          <Text strong style={{ fontSize: 13, color: '#166534' }}>{result.name}</Text>
          {result.note && (
            <Text style={{ display: 'block', fontSize: 11, color: '#6b7280', marginTop: 2 }}>
              {result.note}
            </Text>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4px 16px',
              marginTop: 8,
            }}
          >
            <Text style={{ fontSize: 12 }}>
              热量: <Text strong>{result.calories}</Text> kcal
            </Text>
            <Text style={{ fontSize: 12 }}>
              蛋白质: <Text strong>{result.protein}</Text> g
            </Text>
            <Text style={{ fontSize: 12 }}>
              碳水: <Text strong>{result.carbs}</Text> g
            </Text>
            <Text style={{ fontSize: 12 }}>
              脂肪: <Text strong>{result.fat}</Text> g
            </Text>
          </div>
          {result.servingSize && result.servingUnit && (
            <Text style={{ fontSize: 11, color: '#6b7280', display: 'block', marginTop: 4 }}>
              参考份量: {result.servingSize}{result.servingUnit}
            </Text>
          )}
          <Button
            type="primary"
            size="small"
            block
            style={{ marginTop: 10, background: '#0f766e' }}
            onClick={handleFill}
          >
            填入表单
          </Button>
        </div>
      )}

      {!loading && !result && (
        <Text style={{ fontSize: 12, color: '#9ca3af' }}>
          输入食物名称，AI 帮你查询营养信息
        </Text>
      )}
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottomLeft"
    >
      <Button size="small" icon={<BulbOutlined />} style={{ color: '#0f766e', borderColor: '#0f766e' }}>
        AI 查询营养
      </Button>
    </Popover>
  );
};

export default AiNutritionAssistant;