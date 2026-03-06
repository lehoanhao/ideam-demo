<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

// Initialize auth session on layout mount
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.fetchMe()
  }
})

const open = ref(false)

const mainLinks = [
  {
    label: '案件',
    icon: 'i-lucide-file-text',
    to: '/proposals',
    chip: {
      color: 'error',
      size: 'md'
    }
  },
  {
    label: '顧客',
    icon: 'i-lucide-users',
    to: '/customers'
  },
  {
    label: 'メーカー',
    icon: 'i-lucide-building-2',
    to: '/manufacturers'
  },
  // 営業活動
  {
    label: '営業活動',
    icon: 'i-lucide-activity',
    to: '/activities'
  },
  // FAX送信履歴
  {
    label: '送信履歴',
    icon: 'i-lucide-send',
    to: '/communications'
  },
  {
    // setting
    label: '設定',
    to: '/settings',
    icon: 'i-lucide-settings'
  }
]

const links = [
  [
    {
      label: 'ダッシュボード',
      icon: 'i-lucide-chart-column',
      to: '/',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: '提案管理',
      icon: 'i-lucide-file-text',
      to: '/proposals',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: '顧客管理',
      icon: 'i-lucide-users',
      to: '/customers',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'メーカー管理',
      icon: 'i-lucide-building-2',
      to: '/manufacturers',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: '仕入れ管理',
      icon: 'i-lucide-shopping-cart',
      to: '/procurements',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: '承認管理',
      icon: 'i-lucide-check-circle',
      to: '/approvals',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: '営業活動',
      icon: 'i-lucide-activity',
      to: '/activities',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: '日報',
      icon: 'i-lucide-notebook-pen',
      to: '/reports',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: '送信履歴',
      icon: 'i-lucide-send',
      to: '/communications',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'タグ管理',
      icon: 'i-lucide-tags',
      to: '/tags',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: '設定',
      to: '/settings',
      icon: 'i-lucide-settings',
      defaultOpen: true,
      type: 'trigger',
      children: [
        {
          label: '全般',
          to: '/settings',
          exact: true,
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'メンバー',
          to: '/settings/members',
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: '通知',
          to: '/settings/notifications',
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'セキュリティ',
          to: '/settings/security',
          onSelect: () => {
            open.value = false
          }
        }
      ]
    }
  ],
  [
    {
      label: 'フィードバック',
      icon: 'i-lucide-message-circle',
      to: 'https://github.com/nuxt-ui-templates/dashboard',
      target: '_blank'
    },
    {
      label: 'ヘルプ',
      icon: 'i-lucide-info',
      to: 'https://github.com/nuxt-ui-templates/dashboard',
      target: '_blank'
    }
  ]
] satisfies NavigationMenuItem[][]

const groups = computed(() => [
  {
    id: 'links',
    label: '移動先',
    items: links.flat()
  }
])

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
    <UDashboardSidebar :default-size="5" class="">
      <template #default="{ collapsed }">
        <UButton
          icon="i-material-symbols-menu"
          size="md"
          color="neutral"
          variant="subtle"
          class="justify-center mt-3"
        />

        <UNavigationMenu
          class="mt-4"
          collapsed
          :items="mainLinks"
          orientation="vertical"
          color="primary"
          variant="pill"
          :ui="{
            list: 'space-y-2',
            link: 'flex-col gap-1.5',
            linkLabel: 'block text-[10px]/3 text-center'
          }"
        />
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
