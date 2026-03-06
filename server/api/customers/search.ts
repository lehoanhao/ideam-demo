export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const query = (body.query || '').toLowerCase()

  if (!query) {
    setResponseStatus(event, 400)
    return {
      error: 'Search query is required'
    }
  }

  // Mock search results
  const mockResults = [
    {
      id: 'cust_001',
      code: 'C001',
      name: '株式会社テスト産業',
      tags: ['検査機器', '精密']
    },
    {
      id: 'cust_002',
      code: 'C002',
      name: 'テクノロジー株式会社',
      tags: ['電子部品', 'IoT']
    },
    {
      id: 'cust_003',
      code: 'C003',
      name: 'グローバル機械工業',
      tags: ['機械部品', '自動車']
    }
  ]

  const results = mockResults.filter(
    c => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)
  )

  return {
    results,
    total: results.length,
    query
  }
})
