import { mockProposalFormData, allProposals } from './index'

const updatedProposals: Record<string, any> = {}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = event.method

  if (method === 'GET') {
    if (updatedProposals[id!]) return updatedProposals[id!]

    const found = allProposals.find(p => p.id === id)
    if (!found) throw createError({ statusCode: 404, message: '提案が見つかりません' })

    const formData = mockProposalFormData[id!] || { formRows: [], rivals: [], notes: [], processHistory: [] }
    return { ...found, ...formData }
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const found = allProposals.find(p => p.id === id)
    if (!found) throw createError({ statusCode: 404, message: '提案が見つかりません' })
    const updated = { ...found, ...body, updatedAt: new Date().toISOString() }
    updatedProposals[id!] = updated
    return updated
  }

  if (method === 'DELETE') {
    return { success: true }
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})
