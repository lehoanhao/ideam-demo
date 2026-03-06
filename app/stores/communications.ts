import { defineStore } from 'pinia'
import type { CommunicationRecord, CommunicationChannel } from '~/types'

export const useCommunicationsStore = defineStore('communications', {
  state: () => ({
    records: [] as CommunicationRecord[],
    loading: false,
    error: null as string | null,
    total: 0,
    filters: {} as { channel?: CommunicationChannel, search?: string, dateFrom?: string, dateTo?: string }
  }),

  getters: {
    faxRecords: state => state.records.filter(r => r.channel === 'fax'),
    emailRecords: state => state.records.filter(r => r.channel === 'email')
  },

  actions: {
    async fetchRecords(filters?: { channel?: CommunicationChannel, search?: string, dateFrom?: string, dateTo?: string }) {
      this.loading = true
      this.error = null
      try {
        const params = filters || this.filters
        const response = await $fetch<{ data: CommunicationRecord[], total: number }>('/api/communications', { params })
        this.records = response.data
        this.total = response.total
      } catch (e: any) {
        this.error = e.message || '送信履歴の取得に失敗しました'
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: { channel?: CommunicationChannel, search?: string, dateFrom?: string, dateTo?: string }) {
      this.filters = { ...this.filters, ...filters }
    }
  }
})
