<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const isDetailPage = computed(() => route.path.startsWith('/manufacturers/d/'))
const sidebarCollapsed = ref(isDetailPage.value)
const showMenu = ref(!isDetailPage.value)
watch(
  () => route.path,
  (path) => {
    if (path.startsWith('/manufacturers/d/')) {
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
    label: 'すべてメーカー',
    icon: 'i-lucide-factory',
    to: '/manufacturers'
  }
] satisfies NavigationMenuItem[]

const tags = [
  {
    label: '大切なメーカー',
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
        @click="$router.push('/manufacturers/d/new')"
      >
        <span v-if="!collapsed">メーカーを追加</span>
      </UButton>

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
