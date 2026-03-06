export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = event.method

  if (method === 'PUT') {
    const body = await readBody(event)
    return { id, ...body, updatedAt: new Date().toISOString() }
  }

  if (method === 'DELETE') {
    return { success: true }
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})
