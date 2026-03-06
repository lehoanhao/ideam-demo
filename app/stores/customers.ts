import { defineStore } from 'pinia'
import type { Customer, CustomerFilter } from '~/types'

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
      return state.customers.filter(customer => {
        if (state.filters.search) {
          const query = state.filters.search.toLowerCase()
          return (
            customer.name.toLowerCase().includes(query) ||
            customer.code.toLowerCase().includes(query)
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
        const { data, total } = await $fetch('/api/customers', {
          method: 'GET',
          query: filters || this.filters
        })
        this.customers = data
        this.totalCount = total
        this.filters = filters || this.filters
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch customers'
        console.error('Error fetching customers:', err)
      } finally {
        this.loading = false
      }
    },

    async getCustomerById(id: string) {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch(`/api/customers/${id}`)
        this.selectedCustomer = data
        return data
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch customer'
        console.error('Error fetching customer:', err)
      } finally {
        this.loading = false
      }
    },

    async createCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      try {
        const newCustomer = await $fetch('/api/customers', {
          method: 'POST',
          body: customerData
        })
        this.customers.push(newCustomer)
        this.totalCount++
        return newCustomer
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to create customer'
        console.error('Error creating customer:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateCustomer(id: string, customerData: Partial<Customer>) {
      this.loading = true
      this.error = null
      try {
        const updatedCustomer = await $fetch(`/api/customers/${id}`, {
          method: 'PUT',
          body: customerData
        })
        const index = this.customers.findIndex(c => c.id === id)
        if (index !== -1) {
          this.customers[index] = updatedCustomer
        }
        if (this.selectedCustomer?.id === id) {
          this.selectedCustomer = updatedCustomer
        }
        return updatedCustomer
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to update customer'
        console.error('Error updating customer:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteCustomer(id: string) {
      this.loading = true
      this.error = null
      try {
        await $fetch(`/api/customers/${id}`, {
          method: 'DELETE'
        })
        this.customers = this.customers.filter(c => c.id !== id)
        this.totalCount--
        if (this.selectedCustomer?.id === id) {
          this.selectedCustomer = null
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to delete customer'
        console.error('Error deleting customer:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async searchCustomers(query: string) {
      this.loading = true
      this.error = null
      try {
        const results = await $fetch('/api/customers/search', {
          method: 'POST',
          body: { query }
        })
        return results
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to search customers'
        console.error('Error searching customers:', err)
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
