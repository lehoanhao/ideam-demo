<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { SalesActivity, SalesActivityStatus, SalesActivityType } from '~/types'
import { useActivitiesStore } from '~/stores/activities'

const store = useActivitiesStore()
const toast = useToast()
const router = useRouter()

const searchQuery = ref('')
const statusFilter = ref<SalesActivityStatus | ''>('')
const typeFilter = ref<SalesActivityType | ''>('')

onMounted(() => store.fetchActivities())

const statusColorMap: Record<SalesActivityStatus, string> = {
  planned: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'neutral'
}
const statusLabelMap: Record<SalesActivityStatus, string> = {
  planned: '予定',
  in_progress: '進行中',
  completed: '完了',
  cancelled: 'キャンセル'
}
const typeLabelMap: Record<SalesActivityType, string> = {
  visit: '訪問',
  phone: '電話',
  email: 'メール',
  meeting: '会議',
  other: 'その他'
}
const typeIconMap: Record<SalesActivityType, string> = {
  visit: 'i-lucide-map-pin',
  phone: 'i-lucide-phone',
  email: 'i-lucide-mail',
  meeting: 'i-lucide-users',
  other: 'i-lucide-circle-dot'
}

const statusOptions = [
  { label: 'すべて', value: '' },
  { label: '予定', value: 'planned' },
  { label: '進行中', value: 'in_progress' },
  { label: '完了', value: 'completed' },
  { label: 'キャンセル', value: 'cancelled' }
]
const typeOptions = [
  { label: 'すべて', value: '' },
  { label: '訪問', value: 'visit' },
  { label: '電話', value: 'phone' },
  { label: 'メール', value: 'email' },
  { label: '会議', value: 'meeting' },
  { label: 'その他', value: 'other' }
]

const filteredActivities = computed(() => {
  let result: SalesActivity[] = store.activities
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((a: SalesActivity) =>
      a.customerName.toLowerCase().includes(q)
      || a.title.toLowerCase().includes(q)
      || a.code.toLowerCase().includes(q)
      || a.assignedToName.toLowerCase().includes(q)
    )
  }
  if (statusFilter.value) {
    result = result.filter((a: SalesActivity) => a.status === statusFilter.value)
  }
  if (typeFilter.value) {
    result = result.filter((a: SalesActivity) => a.type === typeFilter.value)
  }
  return result
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<SalesActivity>[] = [
  {
    accessorKey: 'code',
    header: 'コード',
    cell: ({ row }) => h(UButton, {
      variant: 'link',
      class: 'p-0',
      onClick: () => router.push(`/activities/${row.original.id}`)
    }, () => row.original.code)
  },
  {
    accessorKey: 'type',
    header: '種類',
    cell: ({ row }) => h('div', { class: 'flex items-center gap-1' }, [
      h('span', { class: `${typeIconMap[row.original.type]} w-4 h-4` }),
      h('span', typeLabelMap[row.original.type])
    ])
  },
  {
    accessorKey: 'customerName',
    header: '顧客名',
    cell: ({ row }) => h('span', { class: 'font-medium' }, row.original.customerName)
  },
  {
    accessorKey: 'title',
    header: 'タイトル',
    cell: ({ row }) => h(UButton, {
      variant: 'link',
      class: 'p-0',
      onClick: () => router.push(`/activities/${row.original.id}`)
    }, () => row.original.title)
  },
  {
    accessorKey: 'assignedToName',
    header: '担当者'
  },
  {
    accessorKey: 'status',
    header: 'ステータス',
    cell: ({ row }) => h(UBadge, {
      color: statusColorMap[row.original.status] as any,
      variant: 'subtle',
      size: 'sm'
    }, () => statusLabelMap[row.original.status])
  },
  {
    accessorKey: 'interestLevel',
    header: '意欲',
    cell: ({ row }) => {
      const level = row.original.interestLevel
      if (!level) return ''
      const map: Record<string, { label: string, color: string }> = {
        high: { label: '高', color: 'success' },
        medium: { label: '中', color: 'warning' },
        low: { label: '低', color: 'neutral' }
      }
      const entry = map[level]
      if (!entry) return ''
      return h(UBadge, { color: entry.color as any, variant: 'subtle', size: 'sm' }, () => entry.label)
    }
  },
  {
    accessorKey: 'activityDate',
    header: '活動日'
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => h(UDropdownMenu, {
      content: { align: 'end' as const },
      items: [
        [{
          label: '詳細を見る',
          icon: 'i-lucide-eye',
          onSelect: () => router.push(`/activities/${row.original.id}`)
        }],
        [{
          label: '削除',
          icon: 'i-lucide-trash',
          onSelect: async () => {
            await store.deleteActivity(row.original.id)
            toast.add({ title: '営業活動を削除しました', color: 'success' })
          }
        }]
      ]
    }, {
      default: () => h(UButton, { icon: 'i-lucide-ellipsis-vertical', color: 'neutral', variant: 'ghost', size: 'sm' })
    })
  }
]
</script>

<template>
  <UDashboardPanel>
    <UDashboardNavbar title="営業活動管理">
      <template #right>
        <UButton label="新規活動" icon="i-lucide-plus" color="primary" @click="router.push('/activities/new')" />
      </template>
    </UDashboardNavbar>

    <UDashboardToolbar>
      <template #left>
        <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="検索..." class="w-60" />
        <USelectMenu v-model="statusFilter" :items="statusOptions" value-key="value" class="w-36" placeholder="ステータス" />
        <USelectMenu v-model="typeFilter" :items="typeOptions" value-key="value" class="w-32" placeholder="種類" />
      </template>
      <template #right>
        <span class="text-sm text-muted">{{ filteredActivities.length }}件</span>
      </template>
    </UDashboardToolbar>

    <UTable
      :data="filteredActivities"
      :columns="columns"
      :loading="store.loading"
      class="flex-1"
    />
  </UDashboardPanel>
</template>
