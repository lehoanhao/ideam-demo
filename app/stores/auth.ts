import { defineStore } from 'pinia'
import type { User, AuthSession } from '~/types'

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
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isManager: (state) => ['admin', 'manager'].includes(state.user?.role || ''),
    userDisplayName: (state) => state.user?.name || '',
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
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const session = await $fetch<AuthSession>('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })
        this.user = session.user
        this.token = session.token.accessToken
        return session
      } catch (e: any) {
        this.error = e.data?.message || 'ログインに失敗しました'
        throw e
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } finally {
        this.user = null
        this.token = null
        navigateTo('/login')
      }
    },

    async fetchMe() {
      this.loading = true
      try {
        const user = await $fetch<User>('/api/auth/me')
        this.user = user
        return user
      } catch {
        this.user = null
        this.token = null
        return null
      } finally {
        this.loading = false
      }
    }
  }
})
