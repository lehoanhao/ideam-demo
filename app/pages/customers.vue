<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const isDetailPage = computed(() => route.path.startsWith('/customers/d/'))
const sidebarCollapsed = ref(isDetailPage.value)
const showMenu = ref(!isDetailPage.value)
watch(
  () => route.path,
  (path) => {
    if (path.startsWith('/customers/d/')) {
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
    label: 'すべて顧客',
    icon: 'i-lucide-users',
    to: '/customers'
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
        @click="$router.push('/customers/d/new')"
      >
        <span v-if="!collapsed">顧客を追加</span>
      </UButton>

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
