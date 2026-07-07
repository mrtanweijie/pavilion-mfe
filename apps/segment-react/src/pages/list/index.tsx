import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tag, Button, Space, Input, Select, Form, Card } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { ArrowLeftOutlined, EyeOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'

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
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<string>()

  const filteredData = useMemo(() =>
    listData.filter((item) => {
      const matchKeyword = !keyword || item.name.includes(keyword)
      const matchStatus = !status || item.status === status
      return matchKeyword && matchStatus
    }),
    [keyword, status],
  )

  const handleReset = () => {
    setKeyword('')
    setStatus(undefined)
  }

  const columns: ColumnsType<TaskItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const statusInfo = statusMap[s]
        return <Tag color={statusInfo?.color}>{statusInfo?.label}</Tag>
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
          type='link'
          size='small'
          icon={<EyeOutlined />}
          onClick={() => navigate(`/detail?id=${record.id}`)}
        >
          查看
        </Button>
      ),
    },
  ]

  return (
    <div className="pav-page">
      {/* 搜索表单 */}
      <Card style={{ marginBottom: 0 }}>
        <Form layout='inline'>
          <Form.Item label='关键词'>
            <Input
              placeholder='任务名称'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              allowClear
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item label='状态'>
            <Select
              placeholder='全部'
              value={status}
              onChange={setStatus}
              allowClear
              style={{ width: 140 }}
              options={[
                { label: '已完成', value: '已完成' },
                { label: '进行中', value: '进行中' },
                { label: '待开始', value: '待开始' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type='primary' icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
            返回
          </Button>
        </Space>

        <Table<TaskItem>
          dataSource={filteredData}
          columns={columns}
          rowKey='id'
          pagination={false}
        />
      </Card>
    </div>
  )
}
