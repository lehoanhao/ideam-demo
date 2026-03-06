<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { Proposal, ProposalStatus } from '~/types'
import { useProposalStore } from '~/stores/proposals'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const router = useRouter()
const toast = useToast()
const proposalStore = useProposalStore()

const pagination = ref({ pageIndex: 0, pageSize: 20 })
const columnFilters = ref([{ id: 'title', value: '' }])
const rowSelection = ref({})
const selectedStatuses = ref<ProposalStatus[]>([])

onMounted(() => { proposalStore.fetchProposals() })

const statusOptions = [
  { label: 'すべて', value: '' },
  { label: '下書き', value: 'draft' },
  { label: '提出済み', value: 'submitted' },
  { label: '見積済み', value: 'quoted' },
  { label: '承認済み', value: 'approved' },
  { label: '却下', value: 'rejected' },
  { label: '完了', value: 'completed' },
  { label: 'アーカイブ', value: 'archived' }
]

const statusColorMap: Record<ProposalStatus, string> = {
  draft: 'neutral',
  submitted: 'info',
  quoted: 'primary',
  approved: 'success',
  rejected: 'error',
  completed: 'success',
  archived: 'neutral'
}

const statusLabelMap: Record<ProposalStatus, string> = {
  draft: '下書き',
  submitted: '提出済み',
  quoted: '見積済み',
  approved: '承認済み',
  rejected: '却下',
  completed: '完了',
  archived: 'アーカイブ'
}

const searchQuery = ref('')
const statusFilter = ref('')

const filteredProposals = computed(() => {
  let list = proposalStore.proposals
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q)
    )
  }
  if (statusFilter.value) {
    list = list.filter(p => p.status === statusFilter.value)
  }
  return list
})

function getRowItems(row: { original: Proposal }) {
  return [
    { type: 'label' as const, label: '操作' },
    {
      label: '詳細を表示',
      icon: 'i-lucide-eye',
      onSelect() { router.push(`/proposals/${row.original.id}`) }
    },
    { type: 'separator' as const },
    {
      label: '削除',
      icon: 'i-lucide-trash',
      color: 'error' as const,
      async onSelect() {
        try {
          await proposalStore.deleteProposal(row.original.id)
          toast.add({ title: '提案を削除しました', color: 'success' })
        } catch {
          toast.add({ title: '削除に失敗しました', color: 'error' })
        }
      }
    }
  ]
}

const columns: TableColumn<Proposal>[] = [
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
  { accessorKey: 'code', header: '提案No' },
  {
    accessorKey: 'customerName',
    header: '顧客名',
    cell: ({ row }) =>
      h('span', { class: 'font-medium' }, row.original.customerName)
  },
  {
    accessorKey: 'title',
    header: 'タイトル',
    cell: ({ row }) =>
      h('a', {
        class: 'text-primary hover:underline cursor-pointer',
        onClick: () => router.push(`/proposals/${row.original.id}`)
      }, row.original.title)
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
    accessorKey: 'totalAmount',
    header: '合計金額',
    cell: ({ row }) =>
      h('span', { class: 'tabular-nums' }, `¥${row.original.totalAmount.toLocaleString('ja-JP')}`)
  },
  {
    accessorKey: 'deadline',
    header: '締切日',
    cell: ({ row }) => {
      if (!row.original.deadline) return h('span', '-')
      return h('span', new Date(row.original.deadline).toLocaleDateString('ja-JP'))
    }
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
      <UDashboardNavbar title="提案管理">
        <template #right>
          <UButton
            icon="i-lucide-plus"
            label="新規提案"
            @click="router.push('/proposals/new')"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <UDashboardToolbar>
      <template #left>
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="提案番号・顧客名・タイトルで検索..."
          class="w-72"
        />
        <USelect
          v-model="statusFilter"
          :options="statusOptions"
          value-key="value"
          label-key="label"
          placeholder="ステータス"
          class="w-36"
        />
      </template>
      <template #right>
        <span class="text-sm text-muted">
          {{ filteredProposals.length }} 件
        </span>
      </template>
    </UDashboardToolbar>

    <UTable
      v-model:row-selection="rowSelection"
      v-model:pagination="pagination"
      :data="filteredProposals"
      :columns="columns"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      class="w-full"
    />

    <template #footer>
      <UPagination
        v-if="filteredProposals.length > pagination.pageSize"
        v-model:page="pagination.pageIndex"
        :total="filteredProposals.length"
        :page-size="pagination.pageSize"
        size="sm"
      />
    </template>
  </UDashboardPanel>
</template>
