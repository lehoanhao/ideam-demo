<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { HistoricalRecord } from '~/types'
import { useHistoricalStore } from '~/stores/historical'

const UBadge = resolveComponent('UBadge')

const histStore = useHistoricalStore()

const pagination = ref({ pageIndex: 0, pageSize: 20 })
const rowSelection = ref({})
const searchQuery = ref('')
const dateFrom = ref('')
const dateTo = ref('')

onMounted(() => { histStore.fetchRecords() })

watch([searchQuery, dateFrom, dateTo], () => {
  histStore.fetchRecords({
    search: searchQuery.value || undefined,
    dateFrom: dateFrom.value || undefined,
    dateTo: dateTo.value || undefined
  })
})

const profitRateColor = (rate: number) => {
  if (rate >= 40) return 'success'
  if (rate >= 25) return 'primary'
  if (rate >= 10) return 'warning'
  return 'error'
}

const columns: TableColumn<HistoricalRecord>[] = [
  { accessorKey: 'proposalCode', header: '提案No' },
  {
    accessorKey: 'customerName',
    header: '顧客名',
    cell: ({ row }) => h('span', { class: 'font-medium' }, row.original.customerName)
  },
  {
    accessorKey: 'productName',
    header: '品名',
    cell: ({ row }) => h('div', [
      h('p', { class: 'font-medium' }, row.original.productName),
      h('p', { class: 'text-xs text-muted-foreground' }, row.original.manufacturerName)
    ])
  },
  {
    accessorKey: 'quantity',
    header: '数量',
    cell: ({ row }) => h('span', { class: 'tabular-nums' }, `${row.original.quantity.toLocaleString('ja-JP')} ${row.original.unit}`)
  },
  {
    accessorKey: 'unitPrice',
    header: '単価',
    cell: ({ row }) => h('span', { class: 'tabular-nums' }, `¥${row.original.unitPrice.toLocaleString('ja-JP')}`)
  },
  {
    accessorKey: 'totalAmount',
    header: '売上金額',
    cell: ({ row }) => h('span', { class: 'tabular-nums font-medium' }, `¥${row.original.totalAmount.toLocaleString('ja-JP')}`)
  },
  {
    accessorKey: 'profitMargin',
    header: '利益率',
    cell: ({ row }) =>
      h(UBadge, {
        label: `${row.original.profitMargin ?? 0}%`,
        color: profitRateColor(row.original.profitMargin ?? 0) as any,
        variant: 'subtle'
      })
  },
  {
    accessorKey: 'orderDate',
    header: '受注日',
    cell: ({ row }) => h('span', new Date(row.original.orderDate).toLocaleDateString('ja-JP'))
  },
  {
    accessorKey: 'deliveryDate',
    header: '納入日',
    cell: ({ row }) => h('span', new Date(row.original.deliveryDate).toLocaleDateString('ja-JP'))
  }
]
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="過去データ" />
    </template>

    <UDashboardToolbar>
      <template #left>
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="顧客名・品名・提案Noで検索..."
          class="w-72"
        />
        <UInput v-model="dateFrom" type="date" class="w-36" />
        <span class="text-muted-foreground text-sm">〜</span>
        <UInput v-model="dateTo" type="date" class="w-36" />
      </template>
      <template #right>
        <div class="text-sm text-muted-foreground space-x-4">
          <span>{{ histStore.records.length }} 件</span>
          <span class="font-medium">合計: ¥{{ histStore.totalAmount.toLocaleString('ja-JP') }}</span>
        </div>
      </template>
    </UDashboardToolbar>

    <UTable
      v-model:row-selection="rowSelection"
      v-model:pagination="pagination"
      :data="histStore.records"
      :columns="columns"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      class="w-full"
    />
  </UDashboardPanel>
</template>
