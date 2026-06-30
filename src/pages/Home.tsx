import React from 'react';
import { ArrowRightOutlined, CheckCircleFilled, LineChartOutlined, ReadOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Layout, Menu, Row, Space, Statistic, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Paragraph, Text, Title } = Typography;

const featureCards = [
  {
    title: '饮食记录与打卡',
    description: '按早餐、午餐、晚餐、加餐记录每日饮食，自动汇总热量与三大营养素。',
  },
  {
    title: '食物库与自定义食材',
    description: '支持关键字搜索食物营养信息，并补录团队自己维护的食材数据。',
  },
  {
    title: '统计分析与体重趋势',
    description: '查看近 7 天热量变化、月度完成率以及体重趋势，方便答辩展示。',
  },
];

const highlights = [
  '个人目标管理',
  '连续打卡激励',
  '热量与宏量营养素统计',
  '适合课程设计展示',
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f4fbf3 0%, #edf7ef 100%)' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: 'auto',
          lineHeight: 'normal',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(244, 251, 243, 0.86)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(15, 118, 110, 0.08)',
          padding: '18px 40px',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <Space size={14} align="center" style={{ minWidth: 280 }}>
          <div
            style={{
              width: 64,
              height: 64,
              flexShrink: 0,
              borderRadius: 18,
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #0f766e 0%, #16a34a 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 30,
            }}
          >
            DP
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Title level={3} style={{ margin: 0, lineHeight: 1.1, color: '#11251a' }}>
              Diet Plan
            </Title>
            <Text style={{ color: '#557062', fontSize: 16 }}>个人健康饮食计划平台</Text>
          </div>
        </Space>
        <Menu
          mode="horizontal"
          selectable={false}
          items={[
            { key: 'overview', label: '控制台' },
            { key: 'diet', label: '饮食计划' },
            { key: 'foods', label: '食谱' },
            { key: 'analytics', label: '分析' },
          ]}
          style={{ flex: 1, justifyContent: 'center', background: 'transparent', borderBottom: 'none', minWidth: 420, lineHeight: '40px' }}
        />
        <Space>
          <Button type="text" onClick={() => navigate('/login')} style={{ color: '#0f5132', fontWeight: 600 }}>
            登录
          </Button>
          <Button
            type="primary"
            shape="round"
            size="large"
            style={{ background: '#0b7a29', borderColor: '#0b7a29', paddingInline: 26 }}
            onClick={() => navigate('/register')}
          >
            注册
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '40px 40px 56px' }}>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={12}>
            <Tag color="green" style={{ borderRadius: 999, padding: '8px 14px', marginBottom: 20 }}>
              Zustand + React + TypeScript
            </Tag>
            <Title style={{ fontSize: 58, lineHeight: 1.08, marginBottom: 20, color: '#0f1720' }}>
              您的健康，
              <br />
              我们的计划。
              <br />
              <span style={{ color: '#0b7a29' }}>为您量身定制。</span>
            </Title>
            <Paragraph style={{ fontSize: 20, lineHeight: 1.8, color: '#5d6f65', maxWidth: 620 }}>
              根据您的目标、生活方式和口味，构建可执行的饮食记录、热量统计、目标管理与趋势分析流程，
              让课程设计既有真实业务价值，也有足够完整的前后端联动展示。
            </Paragraph>
            <Space size={16} wrap>
              <Button
                type="primary"
                size="large"
                shape="round"
                icon={<ArrowRightOutlined />}
                style={{ background: '#0b7a29', borderColor: '#0b7a29', paddingInline: 28, height: 54 }}
                onClick={() => navigate('/app/dashboard')}
              >
                立即开始
              </Button>
              <Button
                size="large"
                shape="round"
                style={{ borderColor: '#0f7a3d', color: '#0f7a3d', paddingInline: 28, height: 54 }}
                onClick={() => navigate('/app/foods')}
              >
                查看食谱
              </Button>
            </Space>

            <Space align="center" size={18} style={{ marginTop: 36 }}>
              <Avatar.Group>
                <Avatar src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=close-up%20portrait%20of%20healthy%20young%20asian%20woman%20smiling%2C%20clean%20studio%20lighting%2C%20natural%20skin%2C%20editorial%20fitness%20app%20avatar&image_size=square" />
                <Avatar src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=portrait%20of%20young%20asian%20man%20in%20sportswear%2C%20clean%20wellness%20branding%2C%20soft%20light%2C%20mobile%20app%20avatar&image_size=square" />
                <Avatar style={{ background: '#d1f7d8', color: '#0f7a3d' }}>5k+</Avatar>
              </Avatar.Group>
              <div>
                <Text strong style={{ display: 'block', color: '#23352b' }}>
                  快乐用户
                </Text>
                <Text style={{ color: '#5d6f65' }}>正在达成他们的营养目标</Text>
              </div>
            </Space>
          </Col>
          <Col xs={24} lg={12}>
            <div
              style={{
                position: 'relative',
                padding: 28,
                borderRadius: 36,
                overflow: 'hidden',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(231, 246, 232, 0.72))',
                boxShadow: '0 36px 80px rgba(15, 23, 42, 0.12)',
              }}
            >
              <img
                src="/diet_plan_main.jpg"
                alt="健康饮食展示"
                style={{
                  width: '100%',
                  height: 700,
                  borderRadius: 30,
                  display: 'block',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                }}
              />
              <Card
                style={{
                  position: 'absolute',
                  left: 34,
                  bottom: 26,
                  borderRadius: 24,
                  border: 'none',
                  boxShadow: '0 16px 32px rgba(15, 23, 42, 0.12)',
                }}
                bodyStyle={{ padding: '18px 22px' }}
              >
                <Space size={18}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 16,
                      display: 'grid',
                      placeItems: 'center',
                      background: '#dff5e4',
                      color: '#0f7a3d',
                    }}
                  >
                    <LineChartOutlined />
                  </div>
                  <div>
                    <Text style={{ color: '#5d6f65' }}>AVG. WEIGHT LOSS</Text>
                    <Title level={3} style={{ margin: '2px 0 0', color: '#1d2c22' }}>
                      2.4 lbs/week
                    </Title>
                  </div>
                </Space>
              </Card>
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 48 }}>
          {featureCards.map((item) => (
            <Col xs={24} md={8} key={item.title}>
              <Card
                style={{ borderRadius: 28, borderColor: 'rgba(15, 118, 110, 0.08)', minHeight: 220 }}
                bodyStyle={{ padding: 28 }}
              >
                <CheckCircleFilled style={{ fontSize: 22, color: '#0b7a29' }} />
                <Title level={4} style={{ marginTop: 20, marginBottom: 12 }}>
                  {item.title}
                </Title>
                <Paragraph style={{ color: '#617169', lineHeight: 1.8 }}>{item.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 48 }}>
          <Col xs={24} lg={14}>
            <Card
              style={{
                borderRadius: 34,
                border: 'none',
                background: 'linear-gradient(135deg, #f8fff8 0%, #ebf7ee 100%)',
              }}
              bodyStyle={{ padding: 34 }}
            >
              <Title level={2} style={{ marginTop: 0 }}>
                项目适合这样落地
              </Title>
              <Paragraph style={{ fontSize: 17, color: '#5a6c62', lineHeight: 1.9 }}>
                以“饮食记录与打卡”为核心主线，把食物库、统计分析、体重趋势和目标管理串成完整闭环。
                登录注册保持轻量，登录后全部进入统一的健康工作台，便于你和后端队友分工联调。
              </Paragraph>
              <Space wrap size={[10, 12]}>
                {highlights.map((item) => (
                  <Tag key={item} color="green" style={{ borderRadius: 999, padding: '8px 14px' }}>
                    {item}
                  </Tag>
                ))}
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={10}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card style={{ borderRadius: 26, textAlign: 'center', minHeight: 180 }}>
                  <Statistic title="页面模块" value={6} suffix="个" />
                </Card>
              </Col>
              <Col span={12}>
                <Card style={{ borderRadius: 26, textAlign: 'center', minHeight: 180 }}>
                  <Statistic title="核心接口" value={12} suffix="+" />
                </Card>
              </Col>
              <Col span={24}>
                <Card style={{ borderRadius: 26, minHeight: 220 }}>
                  <Space align="start">
                    <ReadOutlined style={{ fontSize: 22, color: '#0f7a3d', marginTop: 4 }} />
                    <div>
                      <Title level={4} style={{ marginTop: 0 }}>
                        答辩展示重点
                      </Title>
                      <Paragraph style={{ color: '#617169', marginBottom: 0 }}>
                        展示从个人档案计算 TDEE，到三餐记录、热量汇总、目标达成率和体重趋势的全流程，逻辑清晰、难度适中。
                      </Paragraph>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Home;
