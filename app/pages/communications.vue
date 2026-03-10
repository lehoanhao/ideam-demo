<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { CommunicationRecord, CommunicationChannel, CommunicationStatus } from '~/types'
import { useCommunicationsStore } from '~/stores/communications'

definePageMeta({ layout: 'default' })

const store = useCommunicationsStore()
const searchQuery = ref('')

const tabItems = [
  { label: 'すべて', value: 'all', icon: 'i-lucide-list' },
  { label: 'FAX', value: 'fax', icon: 'i-lucide-printer' },
  { label: 'メール', value: 'email', icon: 'i-lucide-mail' }
]
const selectedTab = ref('all')

onMounted(() => fetchByTab())

watch(selectedTab, () => fetchByTab())

function fetchByTab() {
  const channel = selectedTab.value === 'all' ? undefined : selectedTab.value as CommunicationChannel
  store.setFilters({ channel })
  store.fetchRecords()
}

const statusColorMap: Record<CommunicationStatus, string> = {
  sent: 'info',
  delivered: 'success',
  failed: 'error',
  pending: 'warning'
}
const statusLabelMap: Record<CommunicationStatus, string> = {
  sent: '送信済',
  delivered: '配信済',
  failed: '失敗',
  pending: '送信待ち'
}

const filteredRecords = computed(() => {
  let result: CommunicationRecord[] = store.records
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((r: CommunicationRecord) =>
      (r.recipientName?.toLowerCase().includes(q))
      || r.recipientAddress.toLowerCase().includes(q)
      || (r.procurementCode?.toLowerCase().includes(q))
      || r.operatorName.toLowerCase().includes(q)
    )
  }
  return result
})

const UBadge = resolveComponent('UBadge')

const columns: TableColumn<CommunicationRecord>[] = [
  {
    accessorKey: 'sentAt',
    header: '送信日時',
    cell: ({ row }) => new Date(row.original.sentAt).toLocaleString('ja-JP')
  },
  {
    accessorKey: 'channel',
    header: 'チャネル',
    cell: ({ row }) => h(UBadge, {
      color: row.original.channel === 'fax' ? 'neutral' : 'primary',
      variant: 'subtle',
      size: 'sm'
    }, () => row.original.channel === 'fax' ? 'FAX' : 'メール')
  },
  {
    accessorKey: 'procurementCode',
    header: '仕入れNo.'
  },
  {
    accessorKey: 'recipientName',
    header: '宛先',
    cell: ({ row }) => h('div', [
      h('p', { class: 'font-medium text-sm' }, row.original.recipientName || '—'),
      h('p', { class: 'text-xs text-muted' }, row.original.recipientAddress)
    ])
  },
  {
    accessorKey: 'subject',
    header: '件名',
    cell: ({ row }) => row.original.subject || '—'
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
    accessorKey: 'operatorName',
    header: '操作者'
  },
  {
    accessorKey: 'notes',
    header: '備考',
    cell: ({ row }) => row.original.notes || ''
  }
]
</script>

<template>
  <UDashboardPanel id="communications">
    <UDashboardNavbar title="送信履歴">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>

      <template #trailing>
        <UBadge v-if="store.records.length" variant="subtle" color="neutral">
          FAX: {{ store.faxRecords.length }}件 / メール: {{ store.emailRecords.length }}件
        </UBadge>
      </template>

      <template #right>
        <UTabs
          v-model="selectedTab"
          :items="tabItems"
          :content="false"
          size="xs"
        />
      </template>
    </UDashboardNavbar>

    <UDashboardToolbar>
      <template #left>
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="検索..."
          class="w-60"
        />
      </template>
      <template #right>
        <span class="text-sm text-muted">{{ filteredRecords.length }}件</span>
      </template>
    </UDashboardToolbar>

    <UTable
      :data="filteredRecords"
      :columns="columns"
      :loading="store.loading"
      class="flex-1"
    />
  </UDashboardPanel>
</template>
