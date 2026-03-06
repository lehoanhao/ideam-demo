import type { User } from '~/types'

const mockUsers: User[] = [
  {
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
  {
    id: 'user_002',
    name: '田中 花子',
    email: 'tanaka@ideam.co.jp',
    role: 'procurement',
    status: 'active',
    department: '仕入れ部',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z'
  },
  {
    id: 'admin_001',
    name: '鈴木 一郎',
    email: 'admin@ideam.co.jp',
    role: 'admin',
    status: 'active',
    department: '経営',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z'
  },
  {
    id: 'user_003',
    name: '佐藤 次郎',
    email: 'sato@ideam.co.jp',
    role: 'manager',
    status: 'active',
    department: '営業部',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z'
  }
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'メールアドレスとパスワードを入力してください' })
  }

  // For demo: any user with password "password" can login
  const user = mockUsers.find(u => u.email === email)
  if (!user || password !== 'password') {
    throw createError({ statusCode: 401, message: 'メールアドレスまたはパスワードが正しくありません' })
  }

  const token = `demo_token_${user.id}_${Date.now()}`

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return {
    user,
    token: {
      accessToken: token,
      expiresIn: 60 * 60 * 24 * 7
    },
    loginAt: new Date().toISOString()
  }
})
