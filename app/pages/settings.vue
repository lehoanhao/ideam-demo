<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

definePageMeta({ layout: 'default' })

const sidebarCollapsed = ref(false)

const links = [
  {
    label: 'タグ管理',
    icon: 'i-lucide-tags',
    to: '/settings'
  },
  {
    label: 'アカウント管理',
    icon: 'i-lucide-users',
    to: '/settings/accounts'
  },
  {
    label: '通知設定',
    icon: 'i-lucide-bell',
    to: '/settings/notifications'
  },
  {
    label: 'セキュリティ',
    icon: 'i-lucide-shield',
    to: '/settings/security'
  }
] satisfies NavigationMenuItem[]
</script>

<template>
  <UDashboardSidebar
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
      <UNavigationMenu
        :collapsed="collapsed"
        :items="links"
        orientation="vertical"
        tooltip
        popover
      />
    </template>
  </UDashboardSidebar>

  <NuxtPage />
</template>
