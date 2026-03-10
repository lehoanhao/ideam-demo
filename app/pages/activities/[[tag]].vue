<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { SalesActivity, SalesActivityStatus, SalesActivityType } from '~/types'
import { useActivitiesStore } from '~/stores/activities'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const store = useActivitiesStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const pagination = ref({ pageIndex: 0, pageSize: 20 })

const tagToStatuses: Record<string, SalesActivityStatus[]> = {
  'planned': ['planned'],
  'in-progress': ['in_progress'],
  'completed': ['completed'],
  'cancelled': ['cancelled']
}

const tagLabelMap: Record<string, string> = {
  'planned': '予定',
  'in-progress': '進行中',
  'completed': '完了',
  'cancelled': 'キャンセル'
}

const currentTag = computed(() => {
  const t = route.params.tag
  return Array.isArray(t) ? t.join('/') : (t || '')
})

const pageTitle = computed(() => {
  if (!currentTag.value) return '営業活動管理'
  return tagLabelMap[currentTag.value] || '営業活動管理'
})

const searchQuery = ref('')
const typeFilter = ref<SalesActivityType | ''>('')

// Advanced search
const showAdvancedSearch = ref(false)
const advancedSearch = ref({
  code: '',
  customerName: '',
  title: '',
  assignedToName: '',
  contactPerson: '',
  type: '' as SalesActivityType | '',
  status: '' as SalesActivityStatus | '',
  interestLevel: '' as '' | 'high' | 'medium' | 'low',
  dateFrom: '',
  dateTo: '',
  createdFrom: '',
  createdTo: '',
  tags: [] as string[]
})

function resetAdvancedSearch() {
  advancedSearch.value = {
    code: '',
    customerName: '',
    title: '',
    assignedToName: '',
    contactPerson: '',
    type: '',
    status: '',
    interestLevel: '',
    dateFrom: '',
    dateTo: '',
    createdFrom: '',
    createdTo: '',
    tags: []
  }
}

const statusOptions = [
  { label: 'すべて', value: '' },
  { label: '予定', value: 'planned' },
  { label: '進行中', value: 'in_progress' },
  { label: '完了', value: 'completed' },
  { label: 'キャンセル', value: 'cancelled' }
]

const interestLevelOptions = [
  { label: 'すべて', value: '' },
  { label: '高', value: 'high' },
  { label: '中', value: 'medium' },
  { label: '低', value: 'low' }
]

const allTags = computed(() => {
  const tagSet = new Set<string>()
  store.activities.forEach(a => a.tags.forEach(t => tagSet.add(t)))
  return [...tagSet].sort()
})

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

const typeOptions = [
  { label: 'すべて', value: '' },
  { label: '訪問', value: 'visit' },
  { label: '電話', value: 'phone' },
  { label: 'メール', value: 'email' },
  { label: '会議', value: 'meeting' },
  { label: 'その他', value: 'other' }
]

const activeStatuses = computed(() => {
  if (!currentTag.value) return []
  return tagToStatuses[currentTag.value] || []
})

const filteredActivities = computed(() => {
  let result: SalesActivity[] = store.activities

  // Simple search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((a: SalesActivity) =>
      a.customerName.toLowerCase().includes(q)
      || a.title.toLowerCase().includes(q)
      || a.code.toLowerCase().includes(q)
      || a.assignedToName.toLowerCase().includes(q)
    )
  }

  // Tag-based status filter
  if (activeStatuses.value.length > 0) {
    result = result.filter((a: SalesActivity) => activeStatuses.value.includes(a.status))
  }

  // Type filter from toolbar
  if (typeFilter.value) {
    result = result.filter((a: SalesActivity) => a.type === typeFilter.value)
  }

  // Advanced search filters
  const adv = advancedSearch.value
  if (adv.code) {
    const q = adv.code.toLowerCase()
    result = result.filter(a => a.code.toLowerCase().includes(q))
  }
  if (adv.customerName) {
    const q = adv.customerName.toLowerCase()
    result = result.filter(a => a.customerName.toLowerCase().includes(q))
  }
  if (adv.title) {
    const q = adv.title.toLowerCase()
    result = result.filter(a => a.title.toLowerCase().includes(q))
  }
  if (adv.assignedToName) {
    const q = adv.assignedToName.toLowerCase()
    result = result.filter(a => a.assignedToName.toLowerCase().includes(q))
  }
  if (adv.contactPerson) {
    const q = adv.contactPerson.toLowerCase()
    result = result.filter(a => (a.contactPerson ?? '').toLowerCase().includes(q))
  }
  if (adv.type) {
    result = result.filter(a => a.type === adv.type)
  }
  if (adv.status) {
    result = result.filter(a => a.status === adv.status)
  }
  if (adv.interestLevel) {
    result = result.filter(a => a.interestLevel === adv.interestLevel)
  }
  if (adv.dateFrom) {
    result = result.filter(a => a.activityDate >= adv.dateFrom)
  }
  if (adv.dateTo) {
    result = result.filter(a => a.activityDate <= adv.dateTo)
  }
  if (adv.createdFrom) {
    result = result.filter(a => a.createdAt >= adv.createdFrom)
  }
  if (adv.createdTo) {
    result = result.filter(a => a.createdAt <= adv.createdTo)
  }
  if (adv.tags.length > 0) {
    result = result.filter(a => adv.tags.every(t => a.tags.includes(t)))
  }

  return result
})

const columns: TableColumn<SalesActivity>[] = [
  {
    accessorKey: 'code',
    header: 'コード',
    cell: ({ row }) => h(UButton, {
      variant: 'link',
      class: 'p-0',
      onClick: () => router.push(`/activities/d/${row.original.id}`)
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
    cell: ({ row }) => h('a', {
      class: 'text-primary hover:underline cursor-pointer',
      onClick: () => router.push(`/activities/d/${row.original.id}`)
    }, row.original.title)
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
    header: '活動日',
    cell: ({ row }) => new Date(row.original.activityDate).toLocaleDateString('ja-JP')
  },
  {
    id: 'actions',
    cell: ({ row }) => h(UDropdownMenu, {
      content: { align: 'end' as const },
      items: [
        { type: 'label' as const, label: '操作' },
        {
          label: '詳細を見る',
          icon: 'i-lucide-eye',
          onSelect: () => router.push(`/activities/d/${row.original.id}`)
        },
        { type: 'separator' as const },
        {
          label: '削除',
          icon: 'i-lucide-trash',
          color: 'error' as const,
          onSelect: async () => {
            await store.deleteActivity(row.original.id)
            toast.add({ title: '営業活動を削除しました', color: 'success' })
          }
        }
      ]
    }, {
      default: () => h(UButton, { icon: 'i-lucide-ellipsis-vertical', color: 'neutral', variant: 'ghost', size: 'sm' })
    })
  }
]
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="pageTitle">
        <template #right>
          <UButton
            label="新規活動"
            icon="i-lucide-plus"
            color="primary"
            @click="router.push('/activities/d/new')"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <UDashboardToolbar>
      <template #left>
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="コード・顧客名・タイトル・担当者で検索..."
          class="w-72"
        />
        <USelectMenu
          v-model="typeFilter"
          :items="typeOptions"
          value-key="value"
          class="w-32"
          placeholder="種類"
        />
        <UButton
          :icon="showAdvancedSearch ? 'i-lucide-chevron-up' : 'i-lucide-sliders-horizontal'"
          :label="showAdvancedSearch ? '検索を閉じる' : '高度な検索'"
          :color="showAdvancedSearch ? 'primary' : 'neutral'"
          variant="outline"
          @click="showAdvancedSearch = !showAdvancedSearch"
        />
      </template>
      <template #right>
        <span class="text-sm text-muted">{{ filteredActivities.length }}件</span>
      </template>
    </UDashboardToolbar>

    <!-- Advanced Search Panel -->
    <div
      v-show="showAdvancedSearch"
      class="border-b border-default bg-default/50 px-4 py-4 transition-all duration-200 ease-out"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <UFormField label="コード" size="xs">
          <UInput
            v-model="advancedSearch.code"
            placeholder="例: ACT-001"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="顧客名" size="xs">
          <UInput
            v-model="advancedSearch.customerName"
            placeholder="顧客名で検索"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="タイトル" size="xs">
          <UInput
            v-model="advancedSearch.title"
            placeholder="タイトルで検索"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="担当者" size="xs">
          <UInput
            v-model="advancedSearch.assignedToName"
            placeholder="担当者名で検索"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="連絡先担当者" size="xs">
          <UInput
            v-model="advancedSearch.contactPerson"
            placeholder="連絡先担当者で検索"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="種類" size="xs">
          <USelect
            v-model="advancedSearch.type"
            :items="typeOptions"
            value-key="value"
            placeholder="すべて"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="ステータス" size="xs">
          <USelect
            v-model="advancedSearch.status"
            :items="statusOptions"
            value-key="value"
            placeholder="すべて"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="意欲" size="xs">
          <USelect
            v-model="advancedSearch.interestLevel"
            :items="interestLevelOptions"
            value-key="value"
            placeholder="すべて"
            size="xs"
            class="w-full"
          />
        </UFormField>
        <UFormField label="活動日（開始）" size="xs">
          <CommonDatePicker v-model="advancedSearch.dateFrom" size="xs" class="w-full" />
        </UFormField>
        <UFormField label="活動日（終了）" size="xs">
          <CommonDatePicker v-model="advancedSearch.dateTo" size="xs" class="w-full" />
        </UFormField>
        <UFormField label="作成日（開始）" size="xs">
          <CommonDatePicker v-model="advancedSearch.createdFrom" size="xs" class="w-full" />
        </UFormField>
        <UFormField label="作成日（終了）" size="xs">
          <CommonDatePicker v-model="advancedSearch.createdTo" size="xs" class="w-full" />
        </UFormField>
        <UFormField label="タグ" size="xs">
          <USelectMenu
            v-model="advancedSearch.tags"
            :items="allTags"
            multiple
            placeholder="タグで絞り込み"
            size="xs"
            class="w-full"
          />
        </UFormField>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <UButton
          icon="i-lucide-rotate-ccw"
          label="リセット"
          color="neutral"
          variant="outline"
          size="xs"
          @click="resetAdvancedSearch"
        />
        <UButton
          icon="i-lucide-search"
          label="検索"
          color="primary"
          size="xs"
          @click="pagination.pageIndex = 0"
        />
      </div>
    </div>

    <UTable
      v-model:pagination="pagination"
      :data="filteredActivities"
      :columns="columns"
      :loading="store.loading"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      class="flex-1"
    />

    <template #footer>
      <UPagination
        v-if="filteredActivities.length > pagination.pageSize"
        v-model:page="pagination.pageIndex"
        :total="filteredActivities.length"
        :page-size="pagination.pageSize"
        size="sm"
      />
    </template>
  </UDashboardPanel>
</template>
