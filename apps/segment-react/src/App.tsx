import { useState, useEffect } from 'react'

function ListPage() {
  return (
    <div>
      <h3>列表页</h3>
      <ul>
        {[1,2,3,4,5].map(i => <li key={i}>条目 {i}</li>)}
      </ul>
    </div>
  )
}

function DetailPage() {
  return (
    <div>
      <h3>详情页</h3>
      <p>这是详情页的内容区域。</p>
    </div>
  )
}

function HomePage() {
  return <p style={{ color: '#999' }}>选择左侧菜单进入子应用页面</p>
}

function App() {
  const [page, setPage] = useState('')

  useEffect(() => {
    const updatePage = () => {
      const path = window.location.pathname
      if (path.startsWith('/react/list')) setPage('list')
      else if (path.startsWith('/react/detail')) setPage('detail')
      else setPage('')
    }
    updatePage()
    window.addEventListener('popstate', updatePage)
    return () => window.removeEventListener('popstate', updatePage)
  }, [])

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2 style={{ margin: '0 0 16px', color: '#1890ff' }}>React 子应用</h2>
      {page === 'list' ? <ListPage /> : page === 'detail' ? <DetailPage /> : <HomePage />}
    </div>
  )
}

export default App
