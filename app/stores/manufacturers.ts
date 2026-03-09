import { defineStore } from 'pinia'
import type { Manufacturer, ManufacturerFilter } from '~/types'
import { mockManufacturers } from '~/utils/mock-data'

let _allManufacturers = [...mockManufacturers]

interface ManufacturerState {
  manufacturers: Manufacturer[]
  selectedManufacturer: Manufacturer | null
  loading: boolean
  error: string | null
  filters: ManufacturerFilter
  totalCount: number
}

export const useManufacturerStore = defineStore('manufacturers', {
  state: (): ManufacturerState => ({
    manufacturers: [],
    selectedManufacturer: null,
    loading: false,
    error: null,
    filters: {},
    totalCount: 0
  }),

  actions: {
    async fetchManufacturers(filters?: ManufacturerFilter) {
      this.loading = true
      this.error = null
      try {
        const f = filters || this.filters
        let data = [..._allManufacturers]
        if (f.search) {
          const q = f.search.toLowerCase()
          data = data.filter(m => m.name.toLowerCase().includes(q) || m.code?.toLowerCase().includes(q))
        }
        this.manufacturers = data
        this.totalCount = data.length
        this.filters = f
      } finally {
        this.loading = false
      }
    },

    async getManufacturerById(id: string) {
      this.loading = true
      this.error = null
      try {
        const data = _allManufacturers.find(m => m.id === id) || null
        this.selectedManufacturer = data
        return data
      } finally {
        this.loading = false
      }
    },

    async createManufacturer(mfrData: Omit<Manufacturer, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      try {
        const now = new Date().toISOString()
        const newMfr: Manufacturer = {
          ...mfrData,
          id: `mfr_${String(_allManufacturers.length + 1).padStart(3, '0')}`,
          createdAt: now,
          updatedAt: now
        }
        _allManufacturers.push(newMfr)
        this.manufacturers.push(newMfr)
        this.totalCount++
        return newMfr
      } finally {
        this.loading = false
      }
    },

    async updateManufacturer(id: string, mfrData: Partial<Manufacturer>) {
      this.loading = true
      this.error = null
      try {
        const idx = _allManufacturers.findIndex(m => m.id === id)
        if (idx === -1) throw new Error('Manufacturer not found')
        const updated = { ..._allManufacturers[idx], ...mfrData, updatedAt: new Date().toISOString() }
        _allManufacturers[idx] = updated
        const storeIdx = this.manufacturers.findIndex(m => m.id === id)
        if (storeIdx !== -1) this.manufacturers[storeIdx] = updated
        if (this.selectedManufacturer?.id === id) this.selectedManufacturer = updated
        return updated
      } finally {
        this.loading = false
      }
    },

    async deleteManufacturer(id: string) {
      this.loading = true
      this.error = null
      try {
        _allManufacturers = _allManufacturers.filter(m => m.id !== id)
        this.manufacturers = this.manufacturers.filter(m => m.id !== id)
        this.totalCount--
        if (this.selectedManufacturer?.id === id) this.selectedManufacturer = null
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: ManufacturerFilter) {
      this.filters = filters
    }
  }
})
