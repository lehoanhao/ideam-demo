<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const isDetailPage = computed(() => route.path.startsWith('/activities/d/'))
const sidebarCollapsed = ref(isDetailPage.value)
const showMenu = ref(!isDetailPage.value)
watch(
  () => route.path,
  (path) => {
    if (path.startsWith('/activities/d/')) {
      sidebarCollapsed.value = true
      showMenu.value = false
    } else {
      sidebarCollapsed.value = false
      showMenu.value = true
    }
  }
)

const links = [
  {
    label: 'すべて活動',
    icon: 'i-lucide-activity',
    to: '/activities'
  },
  {
    label: '予定',
    icon: 'i-lucide-calendar',
    to: '/activities/planned'
  },
  {
    label: '進行中',
    icon: 'i-lucide-loader',
    to: '/activities/in-progress'
  },
  {
    label: '完了',
    icon: 'i-lucide-check-circle',
    to: '/activities/completed'
  },
  {
    label: 'キャンセル',
    icon: 'i-lucide-x-circle',
    to: '/activities/cancelled'
  }
] satisfies NavigationMenuItem[]

const extraLinks = [
  {
    label: '日報',
    icon: 'i-lucide-file-text',
    to: '/activities/report'
  }
] satisfies NavigationMenuItem[]

const tags = [
  {
    label: '大切な活動',
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
      <AppTitle :collapsed="collapsed" />
    </template>

    <template #default="{ collapsed }">
      <UButton
        :icon="collapsed ? 'i-lucide-plus' : 'i-lucide-plus'"
        size="lg"
        color="neutral"
        variant="outline"
        class="rounded-full px-2 pr-4 cursor-pointer"
        :class="{
          'py-2': !collapsed,
          'w-7 h-7 px-0 text-center justify-center': collapsed
        }"
        block
        @click="$router.push('/activities/d/new')"
      >
        <span v-if="!collapsed">新規活動</span>
      </UButton>

      <UNavigationMenu
        :collapsed="collapsed"
        :items="links"
        orientation="vertical"
        tooltip
        popover
      />

      <USeparator class="mt-2" />

      <UNavigationMenu
        :collapsed="collapsed"
        :items="extraLinks"
        orientation="vertical"
        tooltip
        popover
      />
      <div>
        <div>
          <USeparator class="mt-2" />
          <small v-if="!collapsed" class="px-2 text-xs text-muted">
            タグ
          </small>
        </div>
        <UNavigationMenu
          :collapsed="collapsed"
          :items="tags"
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
          label="タグを追加"
          size="sm"
          class="mt-2 w-full rounded-full"
        />
      </div>
    </template>
  </UDashboardSidebar>

  <NuxtPage />
</template>
