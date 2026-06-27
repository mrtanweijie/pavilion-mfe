import { useNavigate } from 'react-router-dom'
import { Table, Tag, Button, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons'

interface TaskItem {
  id: number
  name: string
  status: string
  priority: string
}

const listData: TaskItem[] = [
  { id: 1, name: '任务 Alpha', status: '已完成', priority: '高' },
  { id: 2, name: '任务 Beta', status: '进行中', priority: '中' },
  { id: 3, name: '任务 Gamma', status: '待开始', priority: '低' },
  { id: 4, name: '任务 Delta', status: '已完成', priority: '高' },
  { id: 5, name: '任务 Epsilon', status: '进行中', priority: '中' },
]

const statusMap: Record<string, { color: string; label: string }> = {
  '已完成': { color: 'success', label: '已完成' },
  '进行中': { color: 'processing', label: '进行中' },
  '待开始': { color: 'warning', label: '待开始' },
}

const priorityMap: Record<string, string> = {
  '高': 'red',
  '中': 'orange',
  '低': 'green',
}

export default function ListPage() {
  const navigate = useNavigate()

  const columns: ColumnsType<TaskItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const s = statusMap[status]
        return <Tag color={s?.color}>{s?.label}</Tag>
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (p: string) => <Tag color={priorityMap[p]}>{p}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/detail?id=${record.id}`)}
        >
          查看
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
          返回仪表盘
        </Button>
      </Space>

      <Table<TaskItem>
        dataSource={listData}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
      />
    </div>
  )
}
