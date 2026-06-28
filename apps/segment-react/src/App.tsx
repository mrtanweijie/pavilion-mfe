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
  colorPrimary: '#635BFF',
  borderRadius: 8,
  colorBgContainer: '#FFFFFF',
  colorBgLayout: '#F6F9FC',
  controlHeight: 40,
}

// ---------- App ----------
export default function App({ router }: { router: Router }) {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <ConfigProvider theme={{ token: themeToken }}>
        <AntApp>
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
        </AntApp>
      </ConfigProvider>
    </ErrorBoundary>
  )
}
