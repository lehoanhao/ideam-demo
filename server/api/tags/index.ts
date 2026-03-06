import type { Tag } from '~/types'

const mockTags: Tag[] = [
  { id: 'tag_001', name: '新規訪問', category: 'activity', color: 'primary', usageCount: 12, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_002', name: 'フォローアップ', category: 'activity', color: 'info', usageCount: 8, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_003', name: '定期訪問', category: 'activity', color: 'neutral', usageCount: 5, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_004', name: 'クレーム', category: 'activity', color: 'error', usageCount: 2, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_005', name: '記念品', category: 'proposal', color: 'success', usageCount: 15, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_006', name: 'ノベルティ', category: 'proposal', color: 'warning', usageCount: 10, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_007', name: 'ギフト', category: 'proposal', color: 'primary', usageCount: 7, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_008', name: '防災', category: 'proposal', color: 'error', usageCount: 3, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_009', name: '食品', category: 'manufacturer', color: 'success', usageCount: 20, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_010', name: '工芸品', category: 'manufacturer', color: 'info', usageCount: 6, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_011', name: 'VIP', category: 'customer', color: 'warning', usageCount: 4, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_012', name: '農協', category: 'customer', color: 'success', usageCount: 8, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_013', name: '大口', category: 'customer', color: 'primary', usageCount: 6, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_014', name: '緊急対応', category: 'procurement', color: 'error', usageCount: 3, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_015', name: '長期取引', category: 'procurement', color: 'neutral', usageCount: 11, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' }
]

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const query = getQuery(event)
    let filtered = [...mockTags]
    if (query.category) {
      filtered = filtered.filter(t => t.category === query.category)
    }
    return { data: filtered }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const newTag: Tag = {
      id: `tag_${Date.now()}`,
      name: body.name,
      category: body.category,
      color: body.color || 'neutral',
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockTags.unshift(newTag)
    return newTag
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})
