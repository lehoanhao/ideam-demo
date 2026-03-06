import { defineStore } from 'pinia'
import type { HistoricalRecord, HistoricalFilter } from '~/types'

interface HistoricalState {
  records: HistoricalRecord[]
  loading: boolean
  error: string | null
  total: number
  filters: HistoricalFilter
}

export const useHistoricalStore = defineStore('historical', {
  state: (): HistoricalState => ({
    records: [],
    loading: false,
    error: null,
    total: 0,
    filters: {}
  }),

  getters: {
    totalAmount: (state) => state.records.reduce((s, r) => s + r.totalAmount, 0),
    totalProfit: (state) => state.records.reduce((s, r) => s + (r.profit || 0), 0)
  },

  actions: {
    async fetchRecords(filters?: HistoricalFilter) {
      this.loading = true
      this.error = null
      try {
        const params = { ...this.filters, ...filters }
        const result = await $fetch<{ data: HistoricalRecord[]; total: number }>('/api/historical', { params })
        this.records = result.data
        this.total = result.total
      } catch (e: any) {
        this.error = e.message || '過去データの取得に失敗しました'
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: HistoricalFilter) {
      this.filters = { ...this.filters, ...filters }
    }
  }
})
