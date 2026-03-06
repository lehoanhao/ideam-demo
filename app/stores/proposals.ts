import { defineStore } from 'pinia'
import type { Proposal, ProposalFilter } from '~/types'

interface ProposalState {
  proposals: Proposal[]
  selectedProposal: Proposal | null
  loading: boolean
  error: string | null
  filters: ProposalFilter
  totalCount: number
}

export const useProposalStore = defineStore('proposals', {
  state: (): ProposalState => ({
    proposals: [],
    selectedProposal: null,
    loading: false,
    error: null,
    filters: {},
    totalCount: 0
  }),

  getters: {
    draftProposals: state => state.proposals.filter(p => p.status === 'draft'),
    pendingApproval: state => state.proposals.filter(p => p.approvalStatus === 'pending'),
    totalAmount: state => state.proposals.reduce((sum, p) => sum + p.totalAmount, 0)
  },

  actions: {
    async fetchProposals(filters?: ProposalFilter) {
      this.loading = true
      this.error = null
      try {
        const res = await $fetch<{ data: Proposal[], total: number }>('/api/proposals', {
          query: filters || this.filters
        })
        this.proposals = res.data
        this.totalCount = res.total
        if (filters) this.filters = filters
      } catch (err) {
        this.error = err instanceof Error ? err.message : '提案の取得に失敗しました'
      } finally {
        this.loading = false
      }
    },

    async getProposalById(id: string) {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch<Proposal>(`/api/proposals/${id}`)
        this.selectedProposal = data
        return data
      } catch (err) {
        this.error = err instanceof Error ? err.message : '提案の取得に失敗しました'
      } finally {
        this.loading = false
      }
    },

    async createProposal(data: Omit<Proposal, 'id' | 'code' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      try {
        const newProposal = await $fetch<Proposal>('/api/proposals', {
          method: 'POST',
          body: data
        })
        this.proposals.unshift(newProposal)
        this.totalCount++
        return newProposal
      } catch (err) {
        this.error = err instanceof Error ? err.message : '提案の作成に失敗しました'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateProposal(id: string, data: Partial<Proposal>) {
      this.loading = true
      this.error = null
      try {
        const updated = await $fetch<Proposal>(`/api/proposals/${id}`, {
          method: 'PUT',
          body: data
        })
        const idx = this.proposals.findIndex(p => p.id === id)
        if (idx !== -1) this.proposals[idx] = updated
        if (this.selectedProposal?.id === id) this.selectedProposal = updated
        return updated
      } catch (err) {
        this.error = err instanceof Error ? err.message : '提案の更新に失敗しました'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteProposal(id: string) {
      this.loading = true
      this.error = null
      try {
        await $fetch(`/api/proposals/${id}`, { method: 'DELETE' })
        this.proposals = this.proposals.filter(p => p.id !== id)
        this.totalCount--
        if (this.selectedProposal?.id === id) this.selectedProposal = null
      } catch (err) {
        this.error = err instanceof Error ? err.message : '提案の削除に失敗しました'
        throw err
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: ProposalFilter) {
      this.filters = filters
    }
  }
})
