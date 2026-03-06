import type { Proposal } from '~/types'

const mockProposals: Record<string, Proposal> = {}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = event.method

  if (method === 'GET') {
    if (mockProposals[id!]) return mockProposals[id!]

    const allProposalsList = await $fetch<{ data: Proposal[] }>('/api/proposals')
    const found = allProposalsList.data.find(p => p.id === id)
    if (!found) throw createError({ statusCode: 404, message: '提案が見つかりません' })
    return found
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const allProposalsList = await $fetch<{ data: Proposal[] }>('/api/proposals')
    const idx = allProposalsList.data.findIndex(p => p.id === id)
    if (idx === -1) throw createError({ statusCode: 404, message: '提案が見つかりません' })
    const updated = { ...allProposalsList.data[idx], ...body, updatedAt: new Date().toISOString() }
    mockProposals[id!] = updated
    return updated
  }

  if (method === 'DELETE') {
    return { success: true }
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})
