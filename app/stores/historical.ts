import { defineStore } from 'pinia'
import type { HistoricalRecord, HistoricalFilter } from '~/types'
import { mockHistoricalRecords } from '~/utils/mock-data'

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
        const f = { ...this.filters, ...filters }
        let data = [...mockHistoricalRecords]
        if (f.search) {
          const q = f.search.toLowerCase()
          data = data.filter(r => r.customerName?.toLowerCase().includes(q) || r.productName?.toLowerCase().includes(q))
        }
        this.records = data
        this.total = data.length
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: HistoricalFilter) {
      this.filters = { ...this.filters, ...filters }
    }
  }
})
