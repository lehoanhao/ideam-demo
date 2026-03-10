<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
const appConfig = useAppConfig()
// Initialize auth session on layout mount
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.fetchMe()
  }
})

const open = ref(false)

const mainLinks = computed(() => {
  return [
    {
      label: '案件',
      icon: 'i-streamline-plump-news-paper',
      iconActive: 'i-streamline-plump-news-paper-solid',
      to: '/proposals',
      exact: false,
      chip: {
        color: 'error',
        size: 'md'
      },
      color: 'blue'
    },
    {
      label: '顧客',
      icon: 'i-streamline-ultimate-customer-relationship-management-lead-management-1',
      iconActive:
        'i-streamline-ultimate-customer-relationship-management-lead-management-1-bold',
      to: '/customers',
      exact: false,
      color: 'emerald'
    },
    {
      label: 'メーカー',
      icon: 'i-fluent-building-people-20-regular',
      iconActive: 'i-fluent-building-people-20-filled',
      to: '/manufacturers',
      exact: false,
      color: 'amber'
    },
    // 営業活動
    {
      label: '営業活動',
      icon: 'i-icon-park-outline-bank-card-one',
      iconActive: 'i-icon-park-solid-bank-card-one',
      to: '/activities',
      exact: false,
      color: 'violet'
    },
    // FAX送信履歴
    {
      label: '送信履歴',
      icon: 'i-icon-park-outline-inbox-r',
      iconActive: 'i-icon-park-solid-inbox-r',
      to: '/communications',
      exact: false,
      color: 'fuchsia'
    },
    {
      // setting
      label: '設定',
      to: '/settings',
      icon: 'i-icon-park-twotone-setting',
      iconActive: 'i-icon-park-solid-setting',
      exact: false,
      color: 'red'
    }
  ].map(link => ({
    ...link,
    active: route.path.startsWith(link.to)
  }))
})

const activeLink = computed(() => {
  return mainLinks.value.find(link => link.active)
})

// watch activeLink and update appConfig.ui.colors.primary to activeLink.color
watch(
  activeLink,
  (link) => {
    if (link) {
      appConfig.ui.colors.primary = link.color
    }
  },
  { immediate: true }
)

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: '当サイトでは利便性向上のためCookieを使用しています。',
    duration: 0,
    close: false,
    actions: [
      {
        label: '同意する',
        color: 'neutral',
        variant: 'outline',
        onClick: () => {
          cookie.value = 'accepted'
        }
      },
      {
        label: '拒否する',
        color: 'neutral',
        variant: 'ghost'
      }
    ]
  })
})
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      :default-size="2"
      class=""
      :ui="{
        body: 'px-0'
      }"
    >
      <template #default="{ collapsed }">
        <AppLogo :collapsed="collapsed" class="mx-auto mt-2" />
        <UNavigationMenu
          class="mt-0"
          collapsed
          :items="mainLinks"
          orientation="vertical"
          :color="'primary'"
          variant="pill"
          :ui="{
            list: '',
            link: 'flex-col gap-1.5 data-active:bg-primary-500/20',
            linkLabel: 'block text-[10px]/3 text-center'
          }"
        >
          <template #item="{ item }">
            <div class="flex flex-col items-center gap-1">
              <UIcon
                :name="item.active ? item.iconActive : item.icon"
                class="text-2xl"
              />
              <span v-if="!collapsed" class="text-[12px] font-medium">
                {{ item.label }}
              </span>
            </div>
          </template>
        </UNavigationMenu>
      </template>
      <template #footer="{ collapsed }">
        <UserMenu :collapsed="true" />
      </template>
    </UDashboardSidebar>
    <!-- <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <AppLogo :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UButton
          :icon="collapsed ? 'i-lucide-plus' : 'i-simple-line-icons-plus'"
          size="lg"
          color="neutral"
          variant="outline"
          class="rounded-full shadow-stone-500 shadow-sm"
          :class="{
            'py-3': !collapsed,
            'w-7 h-7 px-0 text-center justify-center': collapsed
          }"
        >
          <span v-if="!collapsed">案件を作成</span>
        </UButton>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar> -->

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
