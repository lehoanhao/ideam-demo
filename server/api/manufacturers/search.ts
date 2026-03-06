export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { query } = body

  if (!query) return []

  const res = await $fetch<{ data: Array<{ id: string, name: string, code: string }> }>('/api/manufacturers')
  const q = String(query).toLowerCase()

  return res.data
    .filter(m => m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q))
    .slice(0, 10)
    .map(m => ({ id: m.id, name: m.name, code: m.code }))
})
