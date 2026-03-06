<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { Procurement, ProcurementStatus } from '~/types'
import { useProcurementStore } from '~/stores/procurements'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const router = useRouter()
const toast = useToast()
const procStore = useProcurementStore()

const pagination = ref({ pageIndex: 0, pageSize: 20 })
const rowSelection = ref({})
const searchQuery = ref('')
const statusFilter = ref('')

onMounted(() => { procStore.fetchProcurements() })

const statusColorMap: Record<ProcurementStatus, string> = {
  draft: 'neutral',
  rfq_sent: 'info',
  quoted: 'primary',
  ordered: 'warning',
  received: 'success',
  completed: 'success',
  cancelled: 'error'
}

const statusLabelMap: Record<ProcurementStatus, string> = {
  draft: '下書き',
  rfq_sent: '見積依頼済み',
  quoted: '見積済み',
  ordered: '発注済み',
  received: '受領済み',
  completed: '完了',
  cancelled: 'キャンセル'
}

const channelLabelMap: Record<string, string> = {
  email: 'メール',
  fax: 'FAX',
  phone: '電話',
  manual: '手動'
}

const statusOptions = [
  { label: 'すべて', value: '' },
  ...Object.entries(statusLabelMap).map(([value, label]) => ({ label, value }))
]

const filteredProcurements = computed(() => {
  let list = procStore.procurements
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p =>
      p.code.toLowerCase().includes(q) ||
      (p.proposalCode || '').toLowerCase().includes(q)
    )
  }
  if (statusFilter.value) {
    list = list.filter(p => p.status === statusFilter.value)
  }
  return list
})

function getRowItems(row: { original: Procurement }) {
  return [
    { type: 'label' as const, label: '操作' },
    {
      label: '詳細を表示',
      icon: 'i-lucide-eye',
      onSelect() { router.push(`/procurements/${row.original.id}`) }
    },
    { type: 'separator' as const },
    {
      label: '削除',
      icon: 'i-lucide-trash',
      color: 'error' as const,
      async onSelect() {
        try {
          await procStore.deleteProcurement(row.original.id)
          toast.add({ title: '仕入れデータを削除しました', color: 'success' })
        } catch {
          toast.add({ title: '削除に失敗しました', color: 'error' })
        }
      }
    }
  ]
}

const columns: TableColumn<Procurement>[] = [
  {
    id: 'select',
    header: ({ table: t }) =>
      h(UCheckbox, {
        'modelValue': t.getIsSomePageRowsSelected() ? 'indeterminate' : t.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (v: boolean | 'indeterminate') => t.toggleAllPageRowsSelected(!!v),
        'ariaLabel': '全て選択'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (v: boolean | 'indeterminate') => row.toggleSelected(!!v),
        'ariaLabel': '行を選択'
      })
  },
  { accessorKey: 'code', header: '仕入れNo' },
  {
    accessorKey: 'proposalCode',
    header: '提案No',
    cell: ({ row }) => row.original.proposalCode
      ? h('a', {
          class: 'text-primary hover:underline cursor-pointer',
          onClick: () => router.push(`/proposals/${row.original.proposalId}`)
        }, row.original.proposalCode)
      : h('span', '-')
  },
  {
    id: 'items',
    header: '品目数',
    cell: ({ row }) => h('span', `${row.original.items.length} 品目`)
  },
  {
    accessorKey: 'status',
    header: 'ステータス',
    cell: ({ row }) =>
      h(UBadge, {
        label: statusLabelMap[row.original.status],
        color: statusColorMap[row.original.status] as any,
        variant: 'subtle'
      })
  },
  {
    accessorKey: 'rfqChannel',
    header: '依頼方法',
    cell: ({ row }) => row.original.rfqChannel
      ? h('span', channelLabelMap[row.original.rfqChannel] || row.original.rfqChannel)
      : h('span', '-')
  },
  {
    accessorKey: 'totalOrderedAmount',
    header: '発注金額',
    cell: ({ row }) => row.original.totalOrderedAmount
      ? h('span', { class: 'tabular-nums' }, `¥${row.original.totalOrderedAmount.toLocaleString('ja-JP')}`)
      : h('span', '-')
  },
  {
    accessorKey: 'expectedDeliveryDate',
    header: '納入予定日',
    cell: ({ row }) => row.original.expectedDeliveryDate
      ? h('span', new Date(row.original.expectedDeliveryDate).toLocaleDateString('ja-JP'))
      : h('span', '-')
  },
  {
    id: 'actions',
    cell: ({ row }) =>
      h(UDropdownMenu, {
        items: getRowItems(row),
        'aria-label': '操作メニュー'
      }, {
        default: () =>
          h(UButton, {
            icon: 'i-lucide-ellipsis',
            color: 'neutral',
            variant: 'ghost',
            size: 'sm'
          })
      })
  }
]
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="仕入れ管理">
        <template #right>
          <UButton
            icon="i-lucide-plus"
            label="新規仕入れ"
            @click="router.push('/procurements/new')"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <UDashboardToolbar>
      <template #left>
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="仕入れNo・提案Noで検索..."
          class="w-72"
        />
        <USelect
          v-model="statusFilter"
          :options="statusOptions"
          value-key="value"
          label-key="label"
          placeholder="ステータス"
          class="w-40"
        />
      </template>
      <template #right>
        <span class="text-sm text-muted">
          {{ filteredProcurements.length }} 件
        </span>
      </template>
    </UDashboardToolbar>

    <UTable
      v-model:row-selection="rowSelection"
      v-model:pagination="pagination"
      :data="filteredProcurements"
      :columns="columns"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      class="w-full"
    />
  </UDashboardPanel>
</template>
