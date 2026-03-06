<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { ApprovalRequest, ApprovalStatus } from '~/types'
import { useApprovalsStore } from '~/stores/approvals'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const approvalsStore = useApprovalsStore()

const pagination = ref({ pageIndex: 0, pageSize: 20 })
const searchQuery = ref('')
const statusFilter = ref('')

// Reject modal state
const showRejectModal = ref(false)
const rejectTarget = ref<ApprovalRequest | null>(null)
const rejectReason = ref('')

onMounted(() => { approvalsStore.fetchApprovals() })

const statusOptions = [
  { label: 'すべて', value: '' },
  { label: '承認待ち', value: 'pending' },
  { label: '承認済み', value: 'approved' },
  { label: '否認', value: 'rejected' }
]

const statusColorMap: Record<ApprovalStatus, string> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error'
}

const statusLabelMap: Record<ApprovalStatus, string> = {
  pending: '承認待ち',
  approved: '承認済み',
  rejected: '否認'
}

const typeColorMap: Record<string, string> = {
  proposal: 'primary',
  procurement: 'info',
  order: 'warning'
}

const typeLabelMap: Record<string, string> = {
  proposal: '提案',
  procurement: '仕入れ',
  order: '発注'
}

const filteredApprovals = computed(() => {
  let list = approvalsStore.items
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(a =>
      a.targetCode?.toLowerCase().includes(q) ||
      a.targetTitle?.toLowerCase().includes(q) ||
      a.requesterName.toLowerCase().includes(q)
    )
  }
  if (statusFilter.value) {
    list = list.filter(a => a.status === statusFilter.value)
  }
  return list
})

const pendingCount = computed(() => approvalsStore.pendingApprovals.length)

const columns: TableColumn<ApprovalRequest>[] = [
  {
    accessorKey: 'targetCode',
    header: '番号',
    cell: ({ row }) => h(UButton, {
      variant: 'link',
      label: row.original.targetCode ?? '-',
      onClick: () => navigateTo(`/${row.original.type === 'proposal' ? 'proposals' : 'procurements'}/${row.original.targetId}`)
    })
  },
  {
    accessorKey: 'type',
    header: '種別',
    cell: ({ row }) => h(UBadge, {
      label: typeLabelMap[row.original.type] ?? row.original.type,
      color: typeColorMap[row.original.type] ?? 'neutral',
      variant: 'subtle'
    })
  },
  { accessorKey: 'targetTitle', header: '件名' },
  { accessorKey: 'requesterName', header: '申請者' },
  {
    accessorKey: 'requestedAt',
    header: '申請日',
    cell: ({ row }) => new Date(row.original.requestedAt).toLocaleDateString('ja-JP')
  },
  {
    accessorKey: 'status',
    header: 'ステータス',
    cell: ({ row }) => h(UBadge, {
      label: statusLabelMap[row.original.status],
      color: statusColorMap[row.original.status],
      variant: 'subtle'
    })
  },
  { accessorKey: 'approverName', header: '承認者', cell: ({ row }) => row.original.approverName ?? '-' },
  {
    accessorKey: 'approvedAt',
    header: '承認日',
    cell: ({ row }) => row.original.approvedAt ? new Date(row.original.approvedAt).toLocaleDateString('ja-JP') : '-'
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => {
      if (row.original.status !== 'pending') return null
      return h('div', { class: 'flex gap-2' }, [
        h(UButton, {
          size: 'xs',
          color: 'success',
          variant: 'soft',
          label: '承認',
          onClick: () => handleApprove(row.original)
        }),
        h(UButton, {
          size: 'xs',
          color: 'error',
          variant: 'soft',
          label: '否認',
          onClick: () => openRejectModal(row.original)
        })
      ])
    }
  }
]

async function handleApprove(approval: ApprovalRequest) {
  try {
    await approvalsStore.approveRequest(approval.id)
    toast.add({ title: '承認しました', color: 'success' })
  } catch {
    toast.add({ title: '承認に失敗しました', color: 'error' })
  }
}

function openRejectModal(approval: ApprovalRequest) {
  rejectTarget.value = approval
  rejectReason.value = ''
  showRejectModal.value = true
}

async function handleReject() {
  if (!rejectTarget.value) return
  if (!rejectReason.value.trim()) {
    toast.add({ title: '否認理由を入力してください', color: 'warning' })
    return
  }
  try {
    await approvalsStore.rejectRequest(rejectTarget.value.id, rejectReason.value)
    toast.add({ title: '否認しました', color: 'info' })
    showRejectModal.value = false
    rejectTarget.value = null
  } catch {
    toast.add({ title: '否認に失敗しました', color: 'error' })
  }
}
</script>

<template>
  <UDashboardPanel id="approvals">
    <template #header>
      <UDashboardNavbar title="承認管理">
        <template #right>
          <UBadge v-if="pendingCount > 0" :label="`${pendingCount}件 承認待ち`" color="warning" variant="solid" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Filters -->
      <div class="flex items-center gap-3 p-4 border-b border-default">
        <UInput
          v-model="searchQuery"
          placeholder="番号・件名・申請者を検索..."
          icon="i-lucide-search"
          class="flex-1 max-w-xs"
        />
        <USelect
          v-model="statusFilter"
          :items="statusOptions"
          value-key="value"
          placeholder="ステータス"
          class="w-36"
        />
        <UButton
          variant="outline"
          icon="i-lucide-refresh-cw"
          label="更新"
          :loading="approvalsStore.loading"
          @click="approvalsStore.fetchApprovals()"
        />
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-3 gap-4 p-4">
        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-warning-500">{{ approvalsStore.pendingApprovals.length }}</div>
            <div class="text-sm text-muted mt-1">承認待ち</div>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-success-500">{{ approvalsStore.approvedApprovals.length }}</div>
            <div class="text-sm text-muted mt-1">承認済み</div>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-error-500">{{ approvalsStore.rejectedApprovals.length }}</div>
            <div class="text-sm text-muted mt-1">否認</div>
          </div>
        </UCard>
      </div>

      <!-- Table -->
      <div class="px-4 pb-4">
        <UTable
          :data="filteredApprovals"
          :columns="columns"
          :pagination="pagination"
          :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
          :loading="approvalsStore.loading"
          class="w-full"
        />
      </div>
    </template>
  </UDashboardPanel>

  <!-- Reject Modal -->
  <UModal v-model:open="showRejectModal" title="否認理由">
    <template #body>
      <div class="space-y-3">
        <p class="text-sm text-muted">
          「{{ rejectTarget?.targetCode }}」を否認します。理由を入力してください。
        </p>
        <UTextarea
          v-model="rejectReason"
          placeholder="否認理由を入力してください..."
          :rows="4"
        />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="キャンセル" @click="showRejectModal = false" />
        <UButton color="error" label="否認する" @click="handleReject" />
      </div>
    </template>
  </UModal>
</template>
