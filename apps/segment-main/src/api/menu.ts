import { ref } from 'vue'

/** 后端菜单接口返回的数据结构 */
export interface MenuItem {
  menuCode: string
  menuName: string
  menuEnglishName?: string
  menuTp: string
  parentCode: string
  orderNo: number
  status: string
  menuUrl: string
  menuIcon?: string
  childrenMenuInfoList?: MenuItem[]
}

/** 响应式菜单数据（供组件使用） */
export const menus = ref<MenuItem[]>([])

/** 缓存的 Promise，避免重复请求 */
let fetchPromise: Promise<MenuItem[]> | null = null

/**
 * 从后端接口获取菜单数据（模拟）
 * 首次调用发起请求，后续调用返回同一 Promise
 */
export function fetchMenus(): Promise<MenuItem[]> {
  if (!fetchPromise) {
    fetchPromise = doFetchMenus()
  }
  return fetchPromise
}

async function doFetchMenus(): Promise<MenuItem[]> {
  const ST_PX = 'color:#42b883;font-weight:bold'
  const ST_DIM = 'color:#999'
  console.log('%c[PavilionMfe]%c 正在从后端获取菜单数据...', ST_PX, ST_DIM)

  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 300))

  const data: MenuItem[] = [
    {
      menuCode: 'demo-app',
      menuName: 'Demo (Vue)',
      menuEnglishName: 'Demo (Vue)',
      menuTp: '0',
      parentCode: '',
      orderNo: 1,
      status: '1',
      menuUrl: '/demo',
      menuIcon: 'Grid',
      childrenMenuInfoList: [
        { menuCode: 'demo-app/list', menuName: '列表页', menuEnglishName: 'List', menuTp: '1', parentCode: 'demo-app', orderNo: 1, status: '1', menuUrl: '/demo/list', menuIcon: 'List' },
        { menuCode: 'demo-app/detail', menuName: '详情页', menuEnglishName: 'Detail', menuTp: '1', parentCode: 'demo-app', orderNo: 2, status: '1', menuUrl: '/demo/detail', menuIcon: 'Document' },
        { menuCode: 'demo-app/form', menuName: '表单页', menuEnglishName: 'Form', menuTp: '1', parentCode: 'demo-app', orderNo: 3, status: '1', menuUrl: '/demo/form', menuIcon: 'EditPen' },
        { menuCode: 'demo-app/test', menuName: '不存在', menuEnglishName: 'Not Found', menuTp: '1', parentCode: 'demo-app', orderNo: 4, status: '1', menuUrl: '/demo/test', menuIcon: 'WarningFilled' },
      ],
    },
    {
      menuCode: 'vue-sub',
      menuName: 'Vue Sub',
      menuEnglishName: 'Vue Sub',
      menuTp: '0',
      parentCode: '',
      orderNo: 2,
      status: '1',
      menuUrl: '/vue-sub',
      menuIcon: 'Monitor',
      childrenMenuInfoList: [
        { menuCode: 'vue-sub/test', menuName: '测试页', menuEnglishName: 'Test', menuTp: '1', parentCode: 'vue-sub', orderNo: 1, status: '1', menuUrl: '/vue-sub/test', menuIcon: 'Monitor' },
      ],
    },
    {
      menuCode: 'react-app',
      menuName: 'Demo (React)',
      menuEnglishName: 'Demo (React)',
      menuTp: '0',
      parentCode: '',
      orderNo: 3,
      status: '1',
      menuUrl: '/react',
      menuIcon: 'Connection',
      childrenMenuInfoList: [
        { menuCode: 'react-app/list', menuName: '列表页', menuEnglishName: 'List', menuTp: '1', parentCode: 'react-app', orderNo: 1, status: '1', menuUrl: '/react/list', menuIcon: 'List' },
        { menuCode: 'react-app/detail', menuName: '详情页', menuEnglishName: 'Detail', menuTp: '1', parentCode: 'react-app', orderNo: 2, status: '1', menuUrl: '/react/detail', menuIcon: 'Document' },
        { menuCode: 'react-app/dashboard', menuName: '仪表盘', menuEnglishName: 'Dashboard', menuTp: '1', parentCode: 'react-app', orderNo: 3, status: '1', menuUrl: '/react/dashboard', menuIcon: 'DataAnalysis' },
        { menuCode: 'react-app/test', menuName: '不存在', menuEnglishName: 'Not Found', menuTp: '1', parentCode: 'react-app', orderNo: 4, status: '1', menuUrl: '/react/test', menuIcon: 'WarningFilled' },
      ],
    },
  ]

  menus.value = data
  console.log('%c[PavilionMfe]%c 菜单数据获取成功，共 %d 个一级菜单', ST_PX, ST_DIM, data.length)
  return data
}
