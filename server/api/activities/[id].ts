import type { SalesActivity } from '~/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = event.method

  if (method === 'GET') {
    const allList = await $fetch<{ data: SalesActivity[] }>('/api/activities')
    const found = allList.data.find(a => a.id === id)
    if (!found) throw createError({ statusCode: 404, message: '営業活動が見つかりません' })
    return found
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const allList = await $fetch<{ data: SalesActivity[] }>('/api/activities')
    const found = allList.data.find(a => a.id === id)
    if (!found) throw createError({ statusCode: 404, message: '営業活動が見つかりません' })
    const updated = { ...found, ...body, updatedAt: new Date().toISOString() }
    return updated
  }

  if (method === 'DELETE') {
    return { success: true }
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})
