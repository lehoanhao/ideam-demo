import { defineStore } from 'pinia'
import type { Procurement, ProcurementFilter } from '~/types'

interface ProcurementState {
  procurements: Procurement[]
  currentProcurement: Procurement | null
  loading: boolean
  error: string | null
  filters: ProcurementFilter
  total: number
}

export const useProcurementStore = defineStore('procurements', {
  state: (): ProcurementState => ({
    procurements: [],
    currentProcurement: null,
    loading: false,
    error: null,
    filters: {},
    total: 0
  }),

  getters: {
    draftProcurements: (state) => state.procurements.filter(p => p.status === 'draft'),
    activeProcurements: (state) =>
      state.procurements.filter(p => !['completed', 'cancelled'].includes(p.status)),
    totalOrdered: (state) =>
      state.procurements.reduce((sum, p) => sum + (p.totalOrderedAmount || 0), 0)
  },

  actions: {
    async fetchProcurements(filters?: ProcurementFilter) {
      this.loading = true
      this.error = null
      try {
        const params = { ...this.filters, ...filters }
        const result = await $fetch<{ data: Procurement[]; total: number }>('/api/procurements', { params })
        this.procurements = result.data
        this.total = result.total
      } catch (e: any) {
        this.error = e.message || '仕入れデータの取得に失敗しました'
      } finally {
        this.loading = false
      }
    },

    async getProcurementById(id: string) {
      this.loading = true
      try {
        const data = await $fetch<Procurement>(`/api/procurements/${id}`)
        this.currentProcurement = data
        return data
      } catch (e: any) {
        this.error = e.message
        return null
      } finally {
        this.loading = false
      }
    },

    async createProcurement(data: Omit<Procurement, 'id' | 'code' | 'createdAt' | 'updatedAt'>) {
      const result = await $fetch<Procurement>('/api/procurements', { method: 'POST', body: data })
      this.procurements.unshift(result)
      return result
    },

    async updateProcurement(id: string, data: Partial<Procurement>) {
      const result = await $fetch<Procurement>(`/api/procurements/${id}`, { method: 'PUT', body: data })
      const idx = this.procurements.findIndex(p => p.id === id)
      if (idx !== -1) this.procurements[idx] = result
      this.currentProcurement = result
      return result
    },

    async deleteProcurement(id: string) {
      await $fetch(`/api/procurements/${id}`, { method: 'DELETE' })
      this.procurements = this.procurements.filter(p => p.id !== id)
    },

    setFilters(filters: ProcurementFilter) {
      this.filters = { ...this.filters, ...filters }
    }
  }
})
