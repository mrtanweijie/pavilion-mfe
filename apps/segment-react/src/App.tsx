import { Component } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, App as AntApp, Result, Button } from 'antd'
import type { Router } from '@remix-run/router'
import './assets/index.css'

// ---------- 简易 ErrorBoundary ----------
interface EBProps {
  children: React.ReactNode
  fallback: React.ComponentType<{ error: Error }>
}
interface EBState {
  error: Error | null
}

class ErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      const Fallback = this.props.fallback
      return <Fallback error={this.state.error} />
    }
    return this.props.children
  }
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <Result
      status="error"
      title="出错了"
      subTitle={error.message}
      extra={
        <Button type="primary" onClick={() => location.reload()}>
          重试
        </Button>
      }
    />
  )
}

// ---------- Antd 主题 ----------
const themeToken = {
  colorPrimary: '#1890ff',
  borderRadius: 6,
}

// ---------- App ----------
export default function App({ router }: { router: Router }) {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <ConfigProvider theme={{ token: themeToken }}>
        <AntApp>
          <div className="react-app">
            <h2 className="react-app-title">React 子应用</h2>
            <RouterProvider router={router} future={{ v7_startTransition: true }} />
          </div>
        </AntApp>
      </ConfigProvider>
    </ErrorBoundary>
  )
}
