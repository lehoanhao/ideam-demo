import { defineStore } from 'pinia'
import type { CommunicationRecord, CommunicationChannel } from '~/types'
import { mockCommunications } from '~/utils/mock-data'

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
        const f = filters || this.filters
        let data = [...mockCommunications]
        if (f.channel) data = data.filter(r => r.channel === f.channel)
        if (f.search) {
          const q = f.search.toLowerCase()
          data = data.filter(r => r.recipientName?.toLowerCase().includes(q) || r.procurementCode?.toLowerCase().includes(q))
        }
        this.records = data
        this.total = data.length
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: { channel?: CommunicationChannel, search?: string, dateFrom?: string, dateTo?: string }) {
      this.filters = { ...this.filters, ...filters }
    }
  }
})
