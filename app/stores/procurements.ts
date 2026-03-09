import { defineStore } from 'pinia'
import type { Procurement, ProcurementFilter } from '~/types'
import { mockProcurements } from '~/utils/mock-data'

let _allProcurements = [...mockProcurements]

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
    draftProcurements: state => state.procurements.filter(p => p.status === 'draft'),
    activeProcurements: state =>
      state.procurements.filter(p => !['completed', 'cancelled'].includes(p.status)),
    totalOrdered: state =>
      state.procurements.reduce((sum, p) => sum + (p.totalOrderedAmount || 0), 0)
  },

  actions: {
    async fetchProcurements(filters?: ProcurementFilter) {
      this.loading = true
      this.error = null
      try {
        const f = { ...this.filters, ...filters }
        let data = [..._allProcurements]
        if (f.search) {
          const q = f.search.toLowerCase()
          data = data.filter(p => p.code?.toLowerCase().includes(q) || p.proposalCode?.toLowerCase().includes(q))
        }
        if (f.status) data = data.filter(p => p.status === f.status)
        this.procurements = data
        this.total = data.length
      } finally {
        this.loading = false
      }
    },

    async getProcurementById(id: string) {
      this.loading = true
      try {
        const data = _allProcurements.find(p => p.id === id) || null
        this.currentProcurement = data
        return data
      } finally {
        this.loading = false
      }
    },

    async createProcurement(data: Omit<Procurement, 'id' | 'code' | 'createdAt' | 'updatedAt'>) {
      const now = new Date().toISOString()
      const result: Procurement = {
        ...data,
        id: `proc_${String(_allProcurements.length + 1).padStart(3, '0')}`,
        code: `SC2026-${String(_allProcurements.length + 1).padStart(3, '0')}`,
        createdAt: now,
        updatedAt: now
      }
      _allProcurements.unshift(result)
      this.procurements.unshift(result)
      return result
    },

    async updateProcurement(id: string, data: Partial<Procurement>) {
      const idx = _allProcurements.findIndex(p => p.id === id)
      if (idx === -1) throw new Error('Not found')
      const result = { ..._allProcurements[idx], ...data, updatedAt: new Date().toISOString() }
      _allProcurements[idx] = result
      const storeIdx = this.procurements.findIndex(p => p.id === id)
      if (storeIdx !== -1) this.procurements[storeIdx] = result
      this.currentProcurement = result
      return result
    },

    async deleteProcurement(id: string) {
      _allProcurements = _allProcurements.filter(p => p.id !== id)
      this.procurements = this.procurements.filter(p => p.id !== id)
    },

    setFilters(filters: ProcurementFilter) {
      this.filters = { ...this.filters, ...filters }
    }
  }
})
