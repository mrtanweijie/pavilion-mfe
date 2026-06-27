import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Button, Empty, Space, Tag } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import type { DescriptionsProps } from 'antd'

const listData = [
  { id: 1, name: '任务 Alpha', status: '已完成', priority: '高', assignee: '张三', createdAt: '2026-06-01' },
  { id: 2, name: '任务 Beta', status: '进行中', priority: '中', assignee: '李四', createdAt: '2026-06-02' },
  { id: 3, name: '任务 Gamma', status: '待开始', priority: '低', assignee: '王五', createdAt: '2026-06-03' },
  { id: 4, name: '任务 Delta', status: '已完成', priority: '高', assignee: '赵六', createdAt: '2026-06-04' },
  { id: 5, name: '任务 Epsilon', status: '进行中', priority: '中', assignee: '孙七', createdAt: '2026-06-05' },
]

const statusMap: Record<string, { color: string; label: string }> = {
  '已完成': { color: 'success', label: '已完成' },
  '进行中': { color: 'processing', label: '进行中' },
  '待开始': { color: 'warning', label: '待开始' },
}

const priorityColor: Record<string, string> = { '高': 'red', '中': 'orange', '低': 'green' }

export default function DetailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = Number(searchParams.get('id'))
  const item = listData.find((i) => i.id === id)

  const items: DescriptionsProps['items'] = item
    ? [
        { key: 'id', label: 'ID', children: item.id },
        { key: 'name', label: '名称', children: item.name },
        {
          key: 'status',
          label: '状态',
          children: <Tag color={statusMap[item.status]?.color}>{statusMap[item.status]?.label}</Tag>,
        },
        { key: 'priority', label: '优先级', children: <Tag color={priorityColor[item.priority]}>{item.priority}</Tag> },
        { key: 'assignee', label: '负责人', children: item.assignee },
        { key: 'createdAt', label: '创建时间', children: item.createdAt },
      ]
    : []

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/list')}>
          返回列表
        </Button>
      </Space>

      <Card title="详情页" variant="borderless">
        {item ? (
          <Descriptions items={items} column={2} bordered />
        ) : (
          <Empty description={`未找到该记录 (id: ${id})`} />
        )}
      </Card>
    </div>
  )
}
