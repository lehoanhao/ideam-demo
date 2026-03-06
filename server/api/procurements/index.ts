import type { Procurement } from '~/types'

const mockProcurements: Procurement[] = [
  {
    id: 'proc_001',
    code: 'SC2026-001',
    proposalId: 'prop_001',
    proposalCode: 'P2026-001',
    items: [
      {
        id: 'pi_001',
        proposalLineItemId: 'li_001',
        manufacturerId: 'mfr_001',
        manufacturerName: '田中食品株式会社',
        productName: '高級羊羹セット',
        quantity: 100,
        unit: '個',
        requestedUnitPrice: 1500,
        quotedUnitPrice: 1400,
        finalUnitPrice: 1400,
        deliveryDate: '2026-03-25',
        notes: '個別包装希望'
      }
    ],
    status: 'ordered',
    rfqSentDate: '2026-03-05',
    rfqChannel: 'email',
    quotationReceivedDate: '2026-03-08',
    orderDate: '2026-03-10',
    expectedDeliveryDate: '2026-03-25',
    totalQuotedAmount: 140000,
    totalOrderedAmount: 140000,
    notes: '総代会用記念品',
    createdBy: 'user_001',
    assignedTo: 'user_001',
    createdAt: '2026-03-05T09:00:00Z',
    updatedAt: '2026-03-10T14:00:00Z'
  },
  {
    id: 'proc_002',
    code: 'SC2026-002',
    proposalId: 'prop_002',
    proposalCode: 'P2026-002',
    items: [
      {
        id: 'pi_002',
        manufacturerId: 'mfr_003',
        manufacturerName: '関西テキスタイル株式会社',
        productName: 'オリジナルトートバッグ',
        quantity: 50,
        unit: '枚',
        requestedUnitPrice: 1200,
        deliveryDate: '2026-04-01'
      }
    ],
    status: 'rfq_sent',
    rfqSentDate: '2026-03-04',
    rfqChannel: 'fax',
    expectedDeliveryDate: '2026-04-01',
    createdBy: 'user_002',
    assignedTo: 'user_002',
    createdAt: '2026-03-04T10:00:00Z',
    updatedAt: '2026-03-04T10:00:00Z'
  },
  {
    id: 'proc_003',
    code: 'SC2026-003',
    proposalId: 'prop_003',
    proposalCode: 'P2026-003',
    items: [
      {
        id: 'pi_003',
        manufacturerId: 'mfr_004',
        manufacturerName: '北海道農産物協同組合',
        productName: '北海道野菜詰め合わせ',
        quantity: 200,
        unit: '箱',
        requestedUnitPrice: 2800,
        quotedUnitPrice: 2750,
        finalUnitPrice: 2750,
        deliveryDate: '2026-07-12'
      }
    ],
    status: 'quoted',
    rfqSentDate: '2026-03-01',
    rfqChannel: 'email',
    quotationReceivedDate: '2026-03-06',
    expectedDeliveryDate: '2026-07-12',
    totalQuotedAmount: 550000,
    notes: 'お中元ギフト用',
    createdBy: 'user_001',
    assignedTo: 'user_003',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-06T16:00:00Z'
  }
]

function generateProcurements(): Procurement[] {
  const statuses = ['draft', 'rfq_sent', 'quoted', 'ordered', 'received', 'completed'] as const
  const result: Procurement[] = []
  for (let i = 4; i <= 15; i++) {
    result.push({
      id: `proc_${String(i).padStart(3, '0')}`,
      code: `SC2026-${String(i).padStart(3, '0')}`,
      items: [],
      status: statuses[i % statuses.length],
      expectedDeliveryDate: `2026-0${3 + (i % 5)}-${10 + (i % 15)}`,
      createdBy: 'user_001',
      assignedTo: 'user_001',
      createdAt: '2026-03-01T09:00:00Z',
      updatedAt: '2026-03-05T09:00:00Z'
    })
  }
  return result
}

const allProcurements = [...mockProcurements, ...generateProcurements()]

export default defineEventHandler(async (event) => {
  const method = event.method
  const query = getQuery(event)

  if (method === 'GET') {
    let results = [...allProcurements]

    if (query.search) {
      const q = String(query.search).toLowerCase()
      results = results.filter(p =>
        p.code.toLowerCase().includes(q) ||
        (p.proposalCode || '').toLowerCase().includes(q) ||
        p.items.some(item => item.productName.toLowerCase().includes(q))
      )
    }

    if (query.status) {
      const statuses = String(query.status).split(',')
      results = results.filter(p => statuses.includes(p.status))
    }

    const total = results.length
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 50
    const data = results.slice((page - 1) * pageSize, page * pageSize)

    return { data, total }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const newProc: Procurement = {
      id: `proc_${Date.now()}`,
      code: `SC${new Date().getFullYear()}-${String(allProcurements.length + 1).padStart(3, '0')}`,
      proposalId: body.proposalId,
      proposalCode: body.proposalCode,
      items: body.items || [],
      status: 'draft',
      expectedDeliveryDate: body.expectedDeliveryDate,
      rfqChannel: body.rfqChannel,
      notes: body.notes,
      createdBy: body.createdBy || 'user_001',
      assignedTo: body.assignedTo || 'user_001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    allProcurements.unshift(newProc)
    return newProc
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})
