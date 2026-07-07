import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Space } from 'antd'
import { UnorderedListOutlined, DashboardOutlined } from '@ant-design/icons'

const navCards = [
  { title: '列表页', desc: '查看数据列表，支持行点击查看详情', icon: <UnorderedListOutlined style={{ fontSize: 24 }} />, path: '/list' },
  { title: '仪表盘', desc: '统计卡片、活动时间线、技术栈', icon: <DashboardOutlined style={{ fontSize: 24 }} />, path: '/dashboard' },
]

export default function IndexPage() {
  const navigate = useNavigate()

  return (
    <div className="pav-page">
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }} className="pav-text-primary">React 子应用</h2>
      <p style={{ margin: '0 0 24px', fontSize: 13 }} className="pav-text-muted">基于 Ant Design + React Router</p>

      <Row gutter={[16, 16]}>
        {navCards.map((card) => (
          <Col xs={24} sm={12} key={card.path}>
            <Card
              hoverable
              onClick={() => navigate(card.path)}
              style={{ borderRadius: 12, height: '100%' }}
            >
              <Space direction='vertical' size={8}>
                <div className="pav-accent">{card.icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }} className="pav-text-primary">{card.title}</div>
                  <div style={{ fontSize: 12, marginTop: 4 }} className="pav-text-muted">{card.desc}</div>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
