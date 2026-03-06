import { defineStore } from 'pinia'
import type { SalesActivity, SalesActivityFilter } from '~/types'

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
        const params = filters || this.filters
        const response = await $fetch<{ data: SalesActivity[], total: number }>('/api/activities', { params })
        this.activities = response.data
        this.totalCount = response.total
      } catch (e: any) {
        this.error = e.message || '営業活動の取得に失敗しました'
      } finally {
        this.loading = false
      }
    },

    async getActivityById(id: string) {
      this.loading = true
      this.error = null
      try {
        const activity = await $fetch<SalesActivity>(`/api/activities/${id}`)
        this.selectedActivity = activity
        return activity
      } catch (e: any) {
        this.error = e.message || '営業活動の取得に失敗しました'
        return null
      } finally {
        this.loading = false
      }
    },

    async createActivity(data: Partial<SalesActivity>) {
      this.loading = true
      this.error = null
      try {
        const activity = await $fetch<SalesActivity>('/api/activities', { method: 'POST', body: data })
        this.activities.unshift(activity)
        this.totalCount++
        return activity
      } catch (e: any) {
        this.error = e.message || '営業活動の作成に失敗しました'
        return null
      } finally {
        this.loading = false
      }
    },

    async updateActivity(id: string, data: Partial<SalesActivity>) {
      this.loading = true
      this.error = null
      try {
        const updated = await $fetch<SalesActivity>(`/api/activities/${id}`, { method: 'PUT', body: data })
        const idx = this.activities.findIndex(a => a.id === id)
        if (idx !== -1) this.activities.splice(idx, 1, updated)
        if (this.selectedActivity?.id === id) this.selectedActivity = updated
        return updated
      } catch (e: any) {
        this.error = e.message || '営業活動の更新に失敗しました'
        return null
      } finally {
        this.loading = false
      }
    },

    async deleteActivity(id: string) {
      this.loading = true
      this.error = null
      try {
        await $fetch(`/api/activities/${id}`, { method: 'DELETE' })
        this.activities = this.activities.filter(a => a.id !== id)
        this.totalCount--
        return true
      } catch (e: any) {
        this.error = e.message || '営業活動の削除に失敗しました'
        return false
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: SalesActivityFilter) {
      this.filters = { ...this.filters, ...filters }
    }
  }
})
