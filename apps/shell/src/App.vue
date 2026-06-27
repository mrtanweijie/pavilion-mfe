<template>
  <div id="shell">
    <nav id="sidebar">
      <h3>导航</h3>
      <ul>
        <li :class="{ active: path === '/' }" @click="goTo('/')">首页</li>
        <template v-for="a in apps" :key="a.appCode">
          <li :class="{ active: path.startsWith(a.routes[0]) }" @click="toggle(a)">{{ a.name }}</li>
          <ul v-if="expanded === a.appCode" class="sub">
            <li v-for="c in a.children" :key="c.route" :class="{ active: path === c.route }" @click="navigateTo(c.route)">{{ c.name }}</li>
          </ul>
        </template>
        <li :class="{ active: path === '/test' }" @click="goTo('/test')">测试页</li>
      </ul>
    </nav>
    <main id="content">
      <!-- 壳自有页面（不用 Vue Router） -->
      <HomePage v-if="path === '/'" />
      <TestPage v-else-if="path === '/test'" />
      <ForbiddenPage v-else-if="path === '/403'" />
      <div v-else id="pavilion-container"></div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { navigateTo } from '@pavilion/router'
import mfeConfig from '../mfe.json'
import HomePage from './pages/home.vue'
import TestPage from './pages/test.vue'
import ForbiddenPage from './pages/403.vue'

const apps = mfeConfig.apps
const expanded = ref('')
const path = ref(window.location.pathname)

const update = () => { path.value = window.location.pathname }
onMounted(() => window.addEventListener('popstate', update))
onUnmounted(() => window.removeEventListener('popstate', update))

function goTo(p: string) {
  if (['/', '/test', '/403'].includes(p)) {
    window.history.pushState(null, '', p)
    window.dispatchEvent(new PopStateEvent('popstate'))
  } else {
    navigateTo(p)
  }
}

function toggle(a: any) {
  expanded.value = expanded.value === a.appCode ? '' : a.appCode
  if (a.children?.length) navigateTo(a.children[0].route)
}
</script>

<style>
* { box-sizing: border-box; }
html, body, #app { margin: 0; padding: 0; height: 100%; }
#shell { display: flex; height: 100%; }
#sidebar { width: 220px; min-width: 220px; flex-shrink: 0; background: #1a1a2e; color: #fff; padding: 16px; display: flex; flex-direction: column; }
#sidebar h3 { margin: 0 0 16px; font-size: 16px; opacity: .8; }
#sidebar ul { list-style: none; padding: 0; margin: 0; flex: 1; }
#sidebar > ul > li { padding: 8px 12px; cursor: pointer; border-radius: 4px; margin-bottom: 4px; }
#sidebar > ul > li:hover { background: rgba(255,255,255,.1); }
#sidebar > ul > li.active { background: rgba(255,255,255,.2); font-weight: 600; }
#sidebar .sub { padding: 0 0 0 16px; margin: 0 0 4px; }
#sidebar .sub li { padding: 6px 12px; cursor: pointer; border-radius: 4px; margin-bottom: 2px; font-size: 13px; color: rgba(255,255,255,.7); }
#sidebar .sub li:hover { background: rgba(255,255,255,.08); color: #fff; }
#sidebar .sub li.active { background: rgba(255,255,255,.15); color: #fff; font-weight: 500; }
#content { flex: 1; min-width: 0; padding: 24px; background: #f5f5f5; overflow: auto; }
#pavilion-container { height: 100%; }
</style>
