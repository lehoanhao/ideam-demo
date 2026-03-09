import { defineStore } from 'pinia'
import type { SalesActivity, SalesActivityFilter } from '~/types'
import { mockActivities } from '~/utils/mock-data'

let _allActivities = [...mockActivities]

interface ActivitiesState {
  activities: SalesActivity[]
  selectedActivity: SalesActivity | null
  loading: boolean
  error: string | null
  filters: SalesActivityFilter
  totalCount: number
}

export const useActivitiesStore = defineStore('activities', {
  state: (): ActivitiesState => ({
    activities: [],
    selectedActivity: null,
    loading: false,
    error: null,
    filters: {},
    totalCount: 0
  }),

  getters: {
    plannedActivities: (state: ActivitiesState) => state.activities.filter(a => a.status === 'planned'),
    inProgressActivities: (state: ActivitiesState) => state.activities.filter(a => a.status === 'in_progress'),
    completedActivities: (state: ActivitiesState) => state.activities.filter(a => a.status === 'completed')
  },

  actions: {
    async fetchActivities(filters?: SalesActivityFilter) {
      this.loading = true
      this.error = null
      try {
        const f = filters || this.filters
        let data = [..._allActivities]
        if (f.search) {
          const q = f.search.toLowerCase()
          data = data.filter(a => a.title.toLowerCase().includes(q) || a.customerName?.toLowerCase().includes(q))
        }
        if (f.status) data = data.filter(a => a.status === f.status)
        if (f.type) data = data.filter(a => a.type === f.type)
        this.activities = data
        this.totalCount = data.length
      } finally {
        this.loading = false
      }
    },

    async getActivityById(id: string) {
      this.loading = true
      this.error = null
      try {
        const activity = _allActivities.find(a => a.id === id) || null
        this.selectedActivity = activity
        return activity
      } finally {
        this.loading = false
      }
    },

    async createActivity(data: Partial<SalesActivity>) {
      this.loading = true
      this.error = null
      try {
        const now = new Date().toISOString()
        const activity: SalesActivity = {
          id: `act_${String(_allActivities.length + 1).padStart(3, '0')}`,
          code: `SA2026-${String(_allActivities.length + 1).padStart(3, '0')}`,
          ...data,
          createdAt: now,
          updatedAt: now
        } as SalesActivity
        _allActivities.unshift(activity)
        this.activities.unshift(activity)
        this.totalCount++
        return activity
      } finally {
        this.loading = false
      }
    },

    async updateActivity(id: string, data: Partial<SalesActivity>) {
      this.loading = true
      this.error = null
      try {
        const idx = _allActivities.findIndex(a => a.id === id)
        if (idx === -1) return null
        const updated = { ..._allActivities[idx], ...data, updatedAt: new Date().toISOString() }
        _allActivities[idx] = updated
        const storeIdx = this.activities.findIndex(a => a.id === id)
        if (storeIdx !== -1) this.activities.splice(storeIdx, 1, updated)
        if (this.selectedActivity?.id === id) this.selectedActivity = updated
        return updated
      } finally {
        this.loading = false
      }
    },

    async deleteActivity(id: string) {
      this.loading = true
      this.error = null
      try {
        _allActivities = _allActivities.filter(a => a.id !== id)
        this.activities = this.activities.filter(a => a.id !== id)
        this.totalCount--
        return true
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: SalesActivityFilter) {
      this.filters = { ...this.filters, ...filters }
    }
  }
})
