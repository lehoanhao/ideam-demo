import type { Customer } from '~/types'

// Import shared mock data storage
import customers from './index'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = event.node.req.method

  // Get all customers from parent endpoint (mock)
  const allCustomers: Customer[] = []

  if (method === 'GET') {
    // GET /api/customers/[id] - Get single customer
    // For now, we'll fetch from a simple in-memory store
    const mockStore = useStorage('customers_store')
    const stored = await mockStore.getItem('all_customers')
    
    // Using alternative approach - making a request call
    const baseCustomers = [
      {
        id: 'cust_001',
        code: 'C001',
        name: '株式会社テスト産業',
        furigana: 'かぶしきがいしゃてすとさんぎょう',
        tags: ['検査機器', '精密'],
        contacts: [
          {
            id: 'cont_001',
            type: 'email' as const,
            value: 'contact@test-sangyo.jp',
            name: '田中太郎',
            isPrimary: true
          }
        ],
        assignedSalesStaff: ['user_001'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-03-05T14:30:00Z'
      }
    ]

    const customer = baseCustomers.find(c => c.id === id)
    
    if (!customer) {
      throw createError({
        statusCode: 404,
        statusMessage: `Customer ${id} not found`
      })
    }

    return customer
  } else if (method === 'PUT') {
    // PUT /api/customers/[id] - Update customer
    const body = await readBody(event)
    
    // Mock update response
    const updatedCustomer: Customer = {
      id: id!,
      code: body.code,
      name: body.name,
      furigana: body.furigana,
      tags: body.tags || [],
      contacts: body.contacts || [],
      assignedSalesStaff: body.assignedSalesStaff || [],
      notes: body.notes,
      createdAt: body.createdAt,
      updatedAt: new Date().toISOString()
    }

    return updatedCustomer
  } else if (method === 'DELETE') {
    // DELETE /api/customers/[id] - Delete customer
    setResponseStatus(event, 204)
    return null
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
