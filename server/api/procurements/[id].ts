import type { Procurement } from '~/types'

const procurementOverrides: Record<string, Procurement> = {}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = event.method

  if (method === 'GET') {
    if (procurementOverrides[id!]) return procurementOverrides[id!]
    const list = await $fetch<{ data: Procurement[] }>('/api/procurements')
    const found = list.data.find(p => p.id === id)
    if (!found) throw createError({ statusCode: 404, message: '仕入れデータが見つかりません' })
    return found
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const list = await $fetch<{ data: Procurement[] }>('/api/procurements')
    const found = list.data.find(p => p.id === id)
    if (!found) throw createError({ statusCode: 404, message: '仕入れデータが見つかりません' })
    const updated = { ...found, ...body, updatedAt: new Date().toISOString() }
    procurementOverrides[id!] = updated
    return updated
  }

  if (method === 'DELETE') {
    return { success: true }
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})
