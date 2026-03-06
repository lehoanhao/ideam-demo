import type { Manufacturer } from '~/types'

// In-memory store (shared via module scope in dev)
const manufacturers: Record<string, Manufacturer> = {}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const method = event.method

  if (method === 'GET') {
    // Fetch from index endpoint mock
    const res = await $fetch<{ data: Manufacturer[] }>('/api/manufacturers')
    const found = res.data.find(m => m.id === id)
    if (!found) throw createError({ statusCode: 404, message: 'メーカーが見つかりません' })
    return found
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const res = await $fetch<{ data: Manufacturer[] }>('/api/manufacturers')
    const found = res.data.find(m => m.id === id)
    if (!found) throw createError({ statusCode: 404, message: 'メーカーが見つかりません' })
    const updated = { ...found, ...body, updatedAt: new Date().toISOString() }
    return updated
  }

  if (method === 'DELETE') {
    return { success: true }
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})
