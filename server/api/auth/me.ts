import type { User } from '~/types'

const mockUsers: Record<string, User> = {
  'user_001': {
    id: 'user_001',
    name: '加藤 誠',
    email: 'kato@ideam.co.jp',
    phone: '03-1111-2222',
    role: 'salesperson',
    status: 'active',
    department: '営業部',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z'
  },
  'user_002': {
    id: 'user_002',
    name: '田中 花子',
    email: 'tanaka@ideam.co.jp',
    role: 'procurement',
    status: 'active',
    department: '仕入れ部',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z'
  },
  'admin_001': {
    id: 'admin_001',
    name: '鈴木 一郎',
    email: 'admin@ideam.co.jp',
    role: 'admin',
    status: 'active',
    department: '経営',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z'
  }
}

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')

  if (!token || !token.startsWith('demo_token_')) {
    throw createError({ statusCode: 401, message: '認証が必要です' })
  }

  // Extract user ID from token: "demo_token_{userId}_{timestamp}"
  const parts = token.split('_')
  const userId = parts.slice(2, parts.length - 1).join('_')
  const user = mockUsers[userId]

  if (!user) {
    throw createError({ statusCode: 401, message: 'セッションが無効です' })
  }

  return user
})
