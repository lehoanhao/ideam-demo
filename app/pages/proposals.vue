<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const sidebarCollapsed = ref(route.path === '/proposals/new')
const showMenu = ref(route.path !== '/proposals/new')
watch(
  () => route.path,
  (path) => {
    if (path === '/proposals/new') {
      sidebarCollapsed.value = true
      showMenu.value = false
    } else {
      sidebarCollapsed.value = false
      showMenu.value = true
    }
  }
)

// { label: 'すべて', value: '' },
// { label: '下書き', value: 'draft' },
// { label: '提出済み', value: 'submitted' },
// { label: '見積済み', value: 'quoted' },
// { label: '承認済み', value: 'approved' },
// { label: '却下', value: 'rejected' },
// { label: '完了', value: 'completed' },
// { label: 'アーカイブ', value: 'archived' }
const links = [
  {
    label: 'すべて案件',
    icon: 'i-material-symbols-light-all-inbox-rounded',
    to: '/proposals'
  },
  {
    label: '仕入れ依頼',
    icon: 'i-game-icons-hand-truck',
    to: '/proposals/purchase-requests'
  },

  {
    label: 'メーカー依頼済',
    icon: 'i-bi-send-check-fill',
    to: '/proposals/submitted'
  },
  {
    label: '仕入れ値段決定',
    icon: 'i-fluent-money-calculator-20-regular',
    to: '/proposals/quoted'
  },
  {
    label: '承認済み',
    icon: 'i-material-symbols-order-approve',
    to: '/proposals/approved'
  },
  {
    label: '却下',
    icon: 'i-material-symbols-light-inactive-order-outline',
    to: '/proposals/rejected'
  },
  {
    label: '完了',
    icon: 'i-nrk-media-media-complete',
    to: '/proposals/completed'
  },
  {
    label: '下書き',
    icon: 'i-hugeicons-license-draft',
    to: '/proposals/drafts'
  },
  {
    label: 'アーカイブ',
    icon: 'i-lucide-archive',
    to: '/proposals/archived'
  }
] satisfies NavigationMenuItem[]

const labels = [
  {
    label: '大切な案件',
    color: 'warning'
  },
  {
    label: '緊急',
    color: 'error'
  },
  {
    label: 'フォローアップ',
    color: 'info'
  }
]
</script>

<template>
  <UDashboardSidebar
    v-if="showMenu"
    id="default"
    v-model:collapsed="sidebarCollapsed"
    collapsible
    resizable
    class="bg-elevated/25 overflow-hidden"
    :ui="{ footer: 'lg:border-t lg:border-default' }"
  >
    <template #header="{ collapsed }">
      <AppLogo :collapsed="collapsed" />
    </template>

    <template #default="{ collapsed }">
      <div
        class="animated-border-wrapper"
        :class="{ 'collapsed-btn': collapsed, 'ml-2': !collapsed }"
      >
        <UButton
          :icon="collapsed ? 'i-lucide-plus' : 'i-simple-line-icons-plus'"
          size="lg"
          color="neutral"
          variant="outline"
          class="animated-border-btn rounded-full w-fit px-2 pr-4 cursor-pointer"
          :class="{
            'py-2': !collapsed,
            'w-7 h-7 px-0 text-center justify-center': collapsed
          }"
          @click="$router.push('/proposals/new')"
        >
          <span v-if="!collapsed">案件を作成</span>
        </UButton>
      </div>

      <UNavigationMenu
        :collapsed="collapsed"
        :items="links"
        orientation="vertical"
        tooltip
        popover
      />
      <div>
        <div>
          <USeparator class="mt-2" />
          <small v-if="!collapsed" class="px-2 text-xs text-muted">
            ラベル
          </small>
        </div>
        <UNavigationMenu
          :collapsed="collapsed"
          :items="labels"
          orientation="vertical"
          tooltip
          popover
        >
          <template #item-leading="{ item }">
            <UBadge :color="item.color" variant="solid" />
          </template>
        </UNavigationMenu>
        <UButton
          icon="i-ei-plus"
          color="neutral"
          variant="soft"
          label="ラベルを追加"
          size="sm"
          class="mt-2 w-full rounded-full"
        />
      </div>
    </template>

    <template #footer="{ collapsed }">
      <UserMenu :collapsed="collapsed" />
    </template>
  </UDashboardSidebar>

  <NuxtPage />
</template>

<style scoped>
.animated-border-wrapper {
  position: relative;
  width: fit-content;
  padding: 1px;
  border-radius: 9999px;
  background: conic-gradient(
    from var(--border-angle, 0deg),
    #6366f1,
    #ec4899,
    #f59e0b,
    #10b981,
    #3b82f6,
    #6366f1
  );
  animation: spin-border 3s linear infinite;
  cursor: pointer;
}

.animated-border-wrapper.collapsed-btn {
  padding: 2px;
}

.animated-border-btn {
  position: relative;
  overflow: hidden;
  background: var(--ui-bg) !important;
  border: none !important;
  box-shadow: none !important;
}

:root:not(.dark) .animated-border-btn {
  background: #ebe9ee !important;
}

.animated-border-btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0) 30%,
    rgba(255, 255, 255, 0.45) 50%,
    rgba(255, 255, 255, 0) 70%,
    transparent 100%
  );
  animation: shimmer 4s ease-in-out infinite;
  animation-delay: 3s;
  pointer-events: none;
}

@keyframes shimmer {
  0%,
  100% {
    left: -100%;
  }
  40%,
  60% {
    left: 150%;
  }
}

@property --border-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes spin-border {
  to {
    --border-angle: 360deg;
  }
}
</style>
