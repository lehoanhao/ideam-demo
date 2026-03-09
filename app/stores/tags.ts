import { defineStore } from 'pinia'
import type { Tag, TagCategory } from '~/types'
import { mockTags } from '~/utils/mock-data'

const _allTags = [...mockTags]

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
        let data = [..._allTags]
        if (category) data = data.filter(t => t.category === category)
        this.tags = data
      } finally {
        this.loading = false
      }
    },

    async createTag(data: Partial<Tag>) {
      this.loading = true
      this.error = null
      try {
        const now = new Date().toISOString()
        const tag: Tag = {
          id: `tag_${String(_allTags.length + 1).padStart(3, '0')}`,
          name: data.name || '',
          category: data.category || 'activity',
          color: data.color || 'neutral',
          usageCount: 0,
          createdAt: now,
          updatedAt: now,
          ...data
        }
        _allTags.unshift(tag)
        this.tags.unshift(tag)
        return tag
      } finally {
        this.loading = false
      }
    },

    async updateTag(id: string, data: Partial<Tag>) {
      this.loading = true
      this.error = null
      try {
        const idx = _allTags.findIndex(t => t.id === id)
        if (idx === -1) return null
        const updated = { ..._allTags[idx], ...data, updatedAt: new Date().toISOString() }
        _allTags[idx] = updated
        const storeIdx = this.tags.findIndex(t => t.id === id)
        if (storeIdx !== -1) this.tags.splice(storeIdx, 1, updated)
        return updated
      } finally {
        this.loading = false
      }
    },

    async deleteTag(id: string) {
      this.loading = true
      this.error = null
      try {
        const idx = _allTags.findIndex(t => t.id === id)
        if (idx !== -1) _allTags.splice(idx, 1)
        this.tags = this.tags.filter(t => t.id !== id)
        return true
      } finally {
        this.loading = false
      }
    }
  }
})
