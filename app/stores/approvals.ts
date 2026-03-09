import { defineStore } from 'pinia'
import type { ApprovalRequest, ApprovalStatus } from '~/types'
import { mockApprovals } from '~/utils/mock-data'

const _allApprovals = [...mockApprovals]

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
    pendingApprovals: state => state.items.filter(a => a.status === 'pending'),
    approvedApprovals: state => state.items.filter(a => a.status === 'approved'),
    rejectedApprovals: state => state.items.filter(a => a.status === 'rejected'),
    filteredItems: (state) => {
      let result = [...state.items]
      if (state.filters.search) {
        const q = state.filters.search.toLowerCase()
        result = result.filter(a =>
          a.targetCode?.toLowerCase().includes(q)
          || a.targetTitle?.toLowerCase().includes(q)
          || a.requesterName.toLowerCase().includes(q)
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
        this.items = [..._allApprovals]
      } finally {
        this.loading = false
      }
    },

    async approveRequest(id: string, notes?: string) {
      const idx = _allApprovals.findIndex(a => a.id === id)
      if (idx === -1) throw new Error('Not found')
      const updated: ApprovalRequest = { ..._allApprovals[idx], status: 'approved' as const, approvedAt: new Date().toISOString(), notes: notes || _allApprovals[idx].notes }
      _allApprovals[idx] = updated
      const storeIdx = this.items.findIndex(a => a.id === id)
      if (storeIdx !== -1) this.items[storeIdx] = updated
      return updated
    },

    async rejectRequest(id: string, rejectionReason: string) {
      const idx = _allApprovals.findIndex(a => a.id === id)
      if (idx === -1) throw new Error('Not found')
      const updated: ApprovalRequest = { ..._allApprovals[idx], status: 'rejected' as const, rejectionReason, approvedAt: new Date().toISOString() }
      _allApprovals[idx] = updated
      const storeIdx = this.items.findIndex(a => a.id === id)
      if (storeIdx !== -1) this.items[storeIdx] = updated
      return updated
    },

    setFilters(filters: Partial<ApprovalState['filters']>) {
      this.filters = { ...this.filters, ...filters }
    }
  }
})
