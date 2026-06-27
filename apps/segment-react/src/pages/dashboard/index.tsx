import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Statistic, Button, Space, Tag, Timeline } from 'antd'
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

const statsCards = [
  { label: '总任务数', value: 128, color: '#1890ff', icon: <ArrowRightOutlined /> },
  { label: '进行中', value: 37, color: '#fa8c16', icon: <SyncOutlined spin /> },
  { label: '已完成', value: 82, color: '#52c41a', icon: <CheckCircleOutlined /> },
  { label: '异常', value: 9, color: '#f5222d', icon: <CloseCircleOutlined /> },
]

const activities = [
  { action: '部署', target: 'segment-main v1.2.0', time: '2 分钟前' },
  { action: '构建', target: 'segment-demo', time: '15 分钟前' },
  { action: '发布', target: 'segment-react v0.5.0', time: '1 小时前' },
  { action: '回滚', target: 'segment-demo', time: '3 小时前' },
]

const techStack = ['React 18', 'TypeScript', 'Module Federation', 'Vite 5', 'React Router 6', 'Ant Design 5']

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        {statsCards.map((card) => (
          <Col xs={12} sm={6} key={card.label}>
            <Card hoverable variant="borderless" style={{ borderTop: `3px solid ${card.color}` }}>
              <Statistic
                title={card.label}
                value={card.value}
                prefix={card.icon}
                valueStyle={{ color: card.color, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 快捷入口 */}
      <Space style={{ marginTop: 16 }}>
        <Button type="primary" icon={<ArrowRightOutlined />} onClick={() => navigate('/list')}>
          列表页
        </Button>
        <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/detail')}>
          详情页
        </Button>
      </Space>

      {/* 活动 + 技术栈 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={16}>
          <Card title="近期活动" variant="borderless">
            <Timeline
              items={activities.map((item) => ({
                children: (
                  <span>
                    <strong>{item.action}</strong> {item.target}
                    <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>{item.time}</span>
                  </span>
                ),
              }))}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="技术栈" variant="borderless">
            <Space wrap>
              {techStack.map((tag) => (
                <Tag key={tag} color="blue">
                  {tag}
                </Tag>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
