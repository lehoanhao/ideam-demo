import { defineStore } from 'pinia'
import type { User } from '~/types'
import { mockUsers } from '~/utils/mock-data'

const AUTH_STORAGE_KEY = 'ideam_auth_user'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => state.user?.role === 'admin',
    isManager: state => ['admin', 'manager'].includes(state.user?.role || ''),
    userDisplayName: state => state.user?.name || '',
    userRole: (state) => {
      const roleMap: Record<string, string> = {
        admin: '管理者',
        manager: 'マネージャー',
        salesperson: '営業',
        procurement: '仕入れ担当',
        viewer: '閲覧者'
      }
      return roleMap[state.user?.role || ''] || ''
    }
  },

  actions: {
    async login(email: string, _password: string) {
      this.loading = true
      this.error = null
      try {
        const user = mockUsers.find(u => u.email === email)
        if (!user) {
          this.error = 'メールアドレスまたはパスワードが正しくありません'
          throw new Error(this.error)
        }
        this.user = user
        this.token = `mock-token-${user.id}`
        if (import.meta.client) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
        }
        return { user, token: { accessToken: this.token, expiresAt: '' } }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.user = null
      this.token = null
      if (import.meta.client) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
      navigateTo('/auth/login')
    },

    async fetchMe() {
      this.loading = true
      try {
        if (import.meta.client) {
          const stored = localStorage.getItem(AUTH_STORAGE_KEY)
          if (stored) {
            this.user = JSON.parse(stored)
            this.token = `mock-token-${this.user!.id}`
            return this.user
          }
        }
        this.user = null
        this.token = null
        return null
      } finally {
        this.loading = false
      }
    }
  }
})
