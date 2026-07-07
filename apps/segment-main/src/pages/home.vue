<template>
  <div class="welcome">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <img
          class="hero-logo"
          src="../assets/pavilion-mfe-logo.svg"
          alt="PavilionMfe"
        />
        <div class="hero-body">
          <h1 class="hero-title">PavilionMfe</h1>
          <p class="hero-subtitle">
            基于 Module Federation 的微前端开源框架，支持 Vue / React 混合渲染
          </p>
          <div class="hero-badges">
            <a
              class="badge badge-gh"
              href="https://github.com/mrtanweijie/pavilion-mfe"
              target="_blank"
              rel="noopener"
            >
              <el-icon :size="14"><Link /></el-icon>
              <span>GitHub</span>
            </a>
            <span class="badge badge-stat">
              <span class="badge-num">{{ appCards.length }}</span>
              <span>个子应用</span>
            </span>
            <span class="badge badge-stat">
              <span class="badge-num">{{ totalPages }}</span>
              <span>个页面</span>
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- App Cards -->
    <section class="apps-section">
      <div class="section-header">
        <h2 class="section-title">应用模块</h2>
        <span class="section-count">{{ appCards.length }} 个模块</span>
      </div>

      <div class="app-cards">
        <article
          v-for="(app, index) in appCards"
          :key="app.menuCode"
          class="app-card"
          :style="{
            '--accent': accents[index % accents.length],
            animationDelay: `${index * 80}ms`,
          }"
        >
          <div class="card-accent"></div>
          <div class="card-content">
            <div class="card-header">
              <div class="card-icon-circle">
                <el-icon :size="18" v-if="app.menuIcon">
                  <component :is="app.menuIcon" />
                </el-icon>
              </div>
              <div class="card-title-group">
                <h3 class="card-title">{{ app.menuName }}</h3>
                <span class="card-page-count">
                  {{ app.childrenMenuInfoList?.length ?? 0 }} 个页面
                </span>
              </div>
            </div>
            <div class="card-tags">
              <button
                v-for="child in app.childrenMenuInfoList"
                :key="child.menuUrl"
                class="card-tag"
                @click="navigateTo(child.menuUrl)"
              >
                <el-icon :size="12" v-if="child.menuIcon" class="tag-icon">
                  <component :is="child.menuIcon" />
                </el-icon>
                {{ child.menuName }}
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Footer -->
    <p class="footer-note">
      更多文档请访问
      <a
        href="https://github.com/mrtanweijie/pavilion-mfe"
        target="_blank"
        rel="noopener"
      >GitHub 仓库</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { navigateTo } from '@pavilion-mfe/router'
import { menus } from '../api/menu'

const menuList = menus

/** 过滤出有子页面的应用模块（排除首页等无子菜单的项） */
const appCards = computed(() =>
  menuList.value.filter((m) => m.childrenMenuInfoList?.length)
)

/** 所有子页面总数 */
const totalPages = computed(() =>
  appCards.value.reduce((sum, m) => sum + (m.childrenMenuInfoList?.length ?? 0), 0)
)

/** 卡片 accent 色板（按索引循环） */
const accents = [
  '#42B883',
  '#38BDF8',
  '#61DAFB',
  '#F59E0B',
  '#64748B',
  '#EF4444',
]
</script>

<style scoped>
/* ─── Hero ─── */
.hero {
  margin-bottom: 40px;
}
.hero-inner {
  display: flex;
  align-items: center;
  gap: 24px;
}
.hero-logo {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
}
.hero-body {
  min-width: 0;
}
.hero-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 4px;
  letter-spacing: -0.5px;
  line-height: 1.2;
}
.hero-subtitle {
  font-size: 14px;
  color: var(--text-regular);
  margin: 0 0 14px;
  line-height: 1.5;
  max-width: 480px;
}

/* Badges row */
.hero-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}
.badge:hover {
  transform: translateY(-1px);
}
.badge-gh {
  background: #24292f;
  color: #fff;
}
.badge-gh:hover {
  box-shadow: 0 2px 12px rgba(36, 41, 47, 0.3);
}
.badge-stat {
  background: var(--card-bg);
  border: 1px solid var(--border);
  color: var(--text-regular);
}
.badge-stat:hover {
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgba(99, 91, 255, 0.1);
}
.badge-num {
  font-weight: 700;
  color: var(--primary);
  font-size: 15px;
}

/* ─── Section Header ─── */
.section-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}
.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}
.section-count {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

/* ─── Cards Grid ─── */
.app-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 18px;
}

/* ─── Single Card ─── */
.app-card {
  --accent: var(--primary);

  position: relative;
  display: flex;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  min-height: 130px;

  opacity: 0;
  transform: translateY(16px);
  animation: cardEntrance 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;

  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.app-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07);
  border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
}

/* Left accent strip */
.card-accent {
  width: 4px;
  flex-shrink: 0;
  background: var(--accent);
  border-radius: 4px 0 0 4px;
}

.card-content {
  flex: 1;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

/* Card header: icon + title */
.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
}
.card-icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  flex-shrink: 0;
}
.card-title-group {
  min-width: 0;
}
.card-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}
.card-page-count {
  font-size: 12px;
  color: var(--text-muted);
}

/* Tags */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.card-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  line-height: 1.4;
  color: var(--text-regular);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s;
}
.card-tag:hover {
  color: #fff;
  background: var(--accent);
  border-color: var(--accent);
  transform: translateY(-1px);
}
.tag-icon {
  flex-shrink: 0;
}

/* ─── Footer ─── */
.footer-note {
  margin: 32px 0 0;
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
}
.footer-note a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}
.footer-note a:hover {
  text-decoration: underline;
}

/* ─── Card Entrance Animation ─── */
@keyframes cardEntrance {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .hero-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .hero-logo {
    width: 56px;
    height: 56px;
  }
  .hero-title {
    font-size: 24px;
  }
  .app-cards {
    grid-template-columns: 1fr;
  }
}
</style>
