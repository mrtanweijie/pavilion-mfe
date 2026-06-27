// /react/dashboard → 重定向至仪表盘首页
import { Navigate } from 'react-router-dom'

export default function DashboardRedirect() {
  return <Navigate to="/" replace />
}
