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
const route = useRoute()
const toast = useToast()
const proposalStore = useProposalStore()

const tagToStatuses: Record<string, ProposalStatus[]> = {
  'purchase-requests': ['submitted'],
  'submitted': ['quoted'],
  'quoted': ['pricing'],
  'approved': ['approved', 'pending_approval'],
  'rejected': ['rejected'],
  'completed': ['completed', 'confirming'],
  'drafts': ['draft'],
  'archived': ['archived']
}

const tagLabelMap: Record<string, string> = {
  'purchase-requests': '仕入れ依頼',
  'submitted': 'メーカー依頼済',
  'quoted': '仕入れ値段決定',
  'approved': '承認済み',
  'rejected': '却下',
  'completed': '完了',
  'drafts': '下書き',
  'archived': 'アーカイブ'
}

const currentTag = computed(() => {
  const t = route.params.tag
  const val = Array.isArray(t) ? t.join('/') : (t || '')
  return val
})

const pageTitle = computed(() => {
  if (!currentTag.value) return '提案管理'
  return tagLabelMap[currentTag.value] || '提案管理'
})

const pagination = ref({ pageIndex: 0, pageSize: 20 })
const columnFilters = ref([{ id: 'title', value: '' }])
const rowSelection = ref({})
const selectedStatuses = ref<ProposalStatus[]>([])

onMounted(() => { proposalStore.fetchProposals() })

const statusOptions = [
  { label: 'すべて', value: '' },
  { label: '新規作成中', value: 'draft' },
  { label: '仕入れ依頼中', value: 'submitted' },
  { label: 'メーカー依頼中', value: 'quoted' },
  { label: '仕入れ値段決定中', value: 'pricing' },
  { label: '承認中', value: 'pending_approval' },
  { label: '承認済', value: 'approved' },
  { label: '差し戻し', value: 'rejected' },
  { label: '顧客と確認中', value: 'confirming' },
  { label: '完了', value: 'completed' },
  { label: 'アーカイブ', value: 'archived' }
]

const statusColorMap: Record<ProposalStatus, string> = {
  draft: 'neutral',
  submitted: 'info',
  quoted: 'primary',
  pricing: 'warning',
  pending_approval: 'warning',
  approved: 'success',
  rejected: 'error',
  confirming: 'info',
  completed: 'success',
  archived: 'neutral'
}

const statusLabelMap: Record<ProposalStatus, string> = {
  draft: '新規作成中',
  submitted: '仕入れ依頼中',
  quoted: 'メーカー依頼中',
  pricing: '仕入れ値段決定中',
  pending_approval: '承認中',
  approved: '承認済',
  rejected: '差し戻し',
  confirming: '顧客と確認中',
  completed: '完了',
  archived: 'アーカイブ'
}

const searchQuery = ref('')

const activeStatuses = computed(() => {
  if (!currentTag.value) return []
  return tagToStatuses[currentTag.value] || []
})

const filteredProposals = computed(() => {
  let list: Proposal[] = proposalStore.proposals
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((p: Proposal) =>
      p.title.toLowerCase().includes(q)
      || p.code.toLowerCase().includes(q)
      || p.customerName.toLowerCase().includes(q)
    )
  }
  if (activeStatuses.value.length > 0) {
    list = list.filter((p: Proposal) => activeStatuses.value.includes(p.status as ProposalStatus))
  }
  return list
})

function getRowItems(row: { original: Proposal }) {
  return [
    { type: 'label' as const, label: '操作' },
    {
      label: '詳細を表示',
      icon: 'i-lucide-eye',
      onSelect() { router.push(`/proposals/d/${row.original.id}`) }
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
        onClick: () => router.push(`/proposals/d/${row.original.id}`)
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
        'items': getRowItems(row),
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
      <UDashboardNavbar :title="pageTitle">
        <template #right>
          <UButton
            icon="i-lucide-plus"
            label="新規提案"
            @click="router.push('/proposals/d/new')"
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
