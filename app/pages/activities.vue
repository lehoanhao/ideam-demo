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
    </template>
  </UDashboardSidebar>

  <NuxtPage />
</template>
