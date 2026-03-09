<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()

const navItems = computed(() => [
  {
    label: 'すべて履歴',
    icon: 'i-lucide-list',
    to: '/communications',
    active: route.path === '/communications'
  },
  {
    label: 'FAX送信履歴',
    icon: 'i-lucide-printer',
    to: '/communications/fax',
    active: route.path === '/communications/fax'
  },
  {
    label: 'メール送信履歴',
    icon: 'i-lucide-mail',
    to: '/communications/email',
    active: route.path === '/communications/email'
  }
])
</script>

<template>
  <UDashboardSidebar
    id="communications-sidebar"
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
