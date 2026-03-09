<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()

const navItems = computed(() => [
  {
    label: 'タグ管理',
    icon: 'i-lucide-tags',
    to: '/settings',
    active: route.path === '/settings' || route.path === '/settings/tags'
  },
  {
    label: 'アカウント管理',
    icon: 'i-lucide-users',
    to: '/settings/accounts',
    active: route.path === '/settings/accounts'
  },
  {
    label: '通知設定',
    icon: 'i-lucide-bell',
    to: '/settings/notifications',
    active: route.path === '/settings/notifications'
  },
  {
    label: 'セキュリティ',
    icon: 'i-lucide-shield',
    to: '/settings/security',
    active: route.path === '/settings/security'
  }
])
</script>

<template>
  <UDashboardSidebar
    id="settings-sidebar"
    collapsible
    resizable
    :min-size="15"
    :default-size="20"
    :max-size="30"
    class="bg-elevated/60"
  >
    <UNavigationMenu :items="navItems" />
  </UDashboardSidebar>

  <NuxtPage />
</template>
