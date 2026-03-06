import { defineStore } from 'pinia'
import type { ApprovalRequest, ApprovalStatus } from '~/types'

interface ApprovalState {
  items: ApprovalRequest[]
  loading: boolean
  error: string | null
  filters: {
    search?: string
    status?: ApprovalStatus
    type?: string
  }
}

export const useApprovalsStore = defineStore('approvals', {
  state: (): ApprovalState => ({
    items: [],
    loading: false,
    error: null,
    filters: {}
  }),

  getters: {
    pendingApprovals: (state) => state.items.filter(a => a.status === 'pending'),
    approvedApprovals: (state) => state.items.filter(a => a.status === 'approved'),
    rejectedApprovals: (state) => state.items.filter(a => a.status === 'rejected'),
    filteredItems: (state) => {
      let result = [...state.items]
      if (state.filters.search) {
        const q = state.filters.search.toLowerCase()
        result = result.filter(a =>
          a.targetCode?.toLowerCase().includes(q) ||
          a.targetTitle?.toLowerCase().includes(q) ||
          a.requesterName.toLowerCase().includes(q)
        )
      }
      if (state.filters.status) {
        result = result.filter(a => a.status === state.filters.status)
      }
      if (state.filters.type) {
        result = result.filter(a => a.type === state.filters.type)
      }
      return result
    }
  },

  actions: {
    async fetchApprovals() {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch<ApprovalRequest[]>('/api/approvals')
        this.items = data
      } catch (e: unknown) {
        this.error = e instanceof Error ? e.message : '承認一覧の取得に失敗しました'
      } finally {
        this.loading = false
      }
    },

    async approveRequest(id: string, notes?: string) {
      const data = await $fetch<ApprovalRequest>(`/api/approvals/${id}`, {
        method: 'PUT',
        body: { action: 'approve', notes }
      })
      const idx = this.items.findIndex(a => a.id === id)
      if (idx !== -1) this.items[idx] = data
      return data
    },

    async rejectRequest(id: string, rejectionReason: string) {
      const data = await $fetch<ApprovalRequest>(`/api/approvals/${id}`, {
        method: 'PUT',
        body: { action: 'reject', rejectionReason }
      })
      const idx = this.items.findIndex(a => a.id === id)
      if (idx !== -1) this.items[idx] = data
      return data
    },

    setFilters(filters: Partial<ApprovalState['filters']>) {
      this.filters = { ...this.filters, ...filters }
    }
  }
})
