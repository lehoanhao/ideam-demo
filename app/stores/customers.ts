import { defineStore } from 'pinia'
import type { Customer, CustomerFilter } from '~/types'
import { mockCustomers } from '~/utils/mock-data'

let _allCustomers = [...mockCustomers]

interface CustomerState {
  customers: Customer[]
  selectedCustomer: Customer | null
  loading: boolean
  error: string | null
  filters: CustomerFilter
  totalCount: number
  pageSize: number
  currentPage: number
}

export const useCustomerStore = defineStore('customers', {
  state: (): CustomerState => ({
    customers: [],
    selectedCustomer: null,
    loading: false,
    error: null,
    filters: {},
    totalCount: 0,
    pageSize: 20,
    currentPage: 1
  }),

  getters: {
    filteredCustomers: (state) => {
      return state.customers.filter((customer) => {
        if (state.filters.search) {
          const query = state.filters.search.toLowerCase()
          return (
            customer.name.toLowerCase().includes(query)
            || customer.code.toLowerCase().includes(query)
          )
        }
        return true
      })
    },

    paginatedCustomers: (state) => {
      const start = (state.currentPage - 1) * state.pageSize
      const end = start + state.pageSize
      return state.customers.slice(start, end)
    },

    totalPages: (state) => {
      return Math.ceil(state.totalCount / state.pageSize)
    }
  },

  actions: {
    async fetchCustomers(filters?: CustomerFilter) {
      this.loading = true
      this.error = null
      try {
        const f = filters || this.filters
        let data = [..._allCustomers]
        if (f.search) {
          const q = f.search.toLowerCase()
          data = data.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
        }
        this.customers = data
        this.totalCount = data.length
        this.filters = f
      } finally {
        this.loading = false
      }
    },

    async getCustomerById(id: string) {
      this.loading = true
      this.error = null
      try {
        const data = _allCustomers.find(c => c.id === id) || null
        this.selectedCustomer = data
        return data
      } finally {
        this.loading = false
      }
    },

    async createCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      try {
        const now = new Date().toISOString()
        const newCustomer: Customer = {
          ...customerData,
          id: `cust_${String(_allCustomers.length + 1).padStart(3, '0')}`,
          createdAt: now,
          updatedAt: now
        }
        _allCustomers.push(newCustomer)
        this.customers.push(newCustomer)
        this.totalCount++
        return newCustomer
      } finally {
        this.loading = false
      }
    },

    async updateCustomer(id: string, customerData: Partial<Customer>) {
      this.loading = true
      this.error = null
      try {
        const idx = _allCustomers.findIndex(c => c.id === id)
        if (idx === -1) throw new Error('Customer not found')
        const updatedCustomer = { ..._allCustomers[idx], ...customerData, updatedAt: new Date().toISOString() }
        _allCustomers[idx] = updatedCustomer
        const storeIdx = this.customers.findIndex(c => c.id === id)
        if (storeIdx !== -1) this.customers[storeIdx] = updatedCustomer
        if (this.selectedCustomer?.id === id) this.selectedCustomer = updatedCustomer
        return updatedCustomer
      } finally {
        this.loading = false
      }
    },

    async deleteCustomer(id: string) {
      this.loading = true
      this.error = null
      try {
        _allCustomers = _allCustomers.filter(c => c.id !== id)
        this.customers = this.customers.filter(c => c.id !== id)
        this.totalCount--
        if (this.selectedCustomer?.id === id) this.selectedCustomer = null
      } finally {
        this.loading = false
      }
    },

    async searchCustomers(query: string) {
      this.loading = true
      this.error = null
      try {
        const q = query.toLowerCase()
        return _allCustomers.filter(c =>
          c.name.toLowerCase().includes(q)
          || c.code.toLowerCase().includes(q)
          || c.furigana?.toLowerCase().includes(q)
        )
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: CustomerFilter) {
      this.filters = filters
      this.currentPage = 1
    },

    setPage(page: number) {
      this.currentPage = page
    }
  }
})
