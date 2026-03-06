import { defineStore } from 'pinia'
import type { Manufacturer, ManufacturerFilter } from '~/types'

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
        const res = await $fetch<{ data: Manufacturer[], total: number }>('/api/manufacturers', {
          query: filters || this.filters
        })
        this.manufacturers = res.data
        this.totalCount = res.total
        this.filters = filters || this.filters
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'メーカーの取得に失敗しました'
      } finally {
        this.loading = false
      }
    },

    async getManufacturerById(id: string) {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch<Manufacturer>(`/api/manufacturers/${id}`)
        this.selectedManufacturer = data
        return data
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'メーカーの取得に失敗しました'
      } finally {
        this.loading = false
      }
    },

    async createManufacturer(mfrData: Omit<Manufacturer, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      try {
        const newMfr = await $fetch<Manufacturer>('/api/manufacturers', {
          method: 'POST',
          body: mfrData
        })
        this.manufacturers.push(newMfr)
        this.totalCount++
        return newMfr
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'メーカーの作成に失敗しました'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateManufacturer(id: string, mfrData: Partial<Manufacturer>) {
      this.loading = true
      this.error = null
      try {
        const updated = await $fetch<Manufacturer>(`/api/manufacturers/${id}`, {
          method: 'PUT',
          body: mfrData
        })
        const idx = this.manufacturers.findIndex(m => m.id === id)
        if (idx !== -1) this.manufacturers[idx] = updated
        if (this.selectedManufacturer?.id === id) this.selectedManufacturer = updated
        return updated
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'メーカーの更新に失敗しました'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteManufacturer(id: string) {
      this.loading = true
      this.error = null
      try {
        await $fetch(`/api/manufacturers/${id}`, { method: 'DELETE' })
        this.manufacturers = this.manufacturers.filter(m => m.id !== id)
        this.totalCount--
        if (this.selectedManufacturer?.id === id) this.selectedManufacturer = null
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'メーカーの削除に失敗しました'
        throw err
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: ManufacturerFilter) {
      this.filters = filters
    }
  }
})
