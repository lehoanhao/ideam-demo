import { defineStore } from 'pinia'
import type { Tag, TagCategory } from '~/types'

interface TagsState {
  tags: Tag[]
  loading: boolean
  error: string | null
}

export const useTagsStore = defineStore('tags', {
  state: (): TagsState => ({
    tags: [],
    loading: false,
    error: null
  }),

  getters: {
    tagsByCategory: (state: TagsState) => {
      return (category: TagCategory) => state.tags.filter(t => t.category === category)
    }
  },

  actions: {
    async fetchTags(category?: TagCategory) {
      this.loading = true
      this.error = null
      try {
        const params = category ? { category } : {}
        const response = await $fetch<{ data: Tag[] }>('/api/tags', { params })
        this.tags = response.data
      } catch (e: any) {
        this.error = e.message || 'タグの取得に失敗しました'
      } finally {
        this.loading = false
      }
    },

    async createTag(data: Partial<Tag>) {
      this.loading = true
      this.error = null
      try {
        const tag = await $fetch<Tag>('/api/tags', { method: 'POST', body: data })
        this.tags.unshift(tag)
        return tag
      } catch (e: any) {
        this.error = e.message || 'タグの作成に失敗しました'
        return null
      } finally {
        this.loading = false
      }
    },

    async updateTag(id: string, data: Partial<Tag>) {
      this.loading = true
      this.error = null
      try {
        const updated = await $fetch<Tag>(`/api/tags/${id}`, { method: 'PUT', body: data })
        const idx = this.tags.findIndex(t => t.id === id)
        if (idx !== -1) this.tags.splice(idx, 1, updated)
        return updated
      } catch (e: any) {
        this.error = e.message || 'タグの更新に失敗しました'
        return null
      } finally {
        this.loading = false
      }
    },

    async deleteTag(id: string) {
      this.loading = true
      this.error = null
      try {
        await $fetch(`/api/tags/${id}`, { method: 'DELETE' })
        this.tags = this.tags.filter(t => t.id !== id)
        return true
      } catch (e: any) {
        this.error = e.message || 'タグの削除に失敗しました'
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
