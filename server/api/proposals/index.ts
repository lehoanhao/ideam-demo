import type { Proposal } from '~/types'

const mockProposals: Proposal[] = [
  {
    id: 'prop_001',
    code: 'P2026-001',
    customerId: 'cust_001',
    customerName: '株式会社テスト産業',
    title: '総代会組合員記念品提案',
    description: '年次総代会用の記念品として食品・菓子類の提案',
    status: 'submitted',
    lineItems: [
      {
        id: 'li_001',
        manufacturerId: 'mfr_001',
        manufacturerName: '田中食品株式会社',
        productName: '高級羊羹セット',
        productCode: 'TK-001',
        quantity: 100,
        unit: '個',
        unitPrice: 1500,
        total: 150000,
        notes: '個別包装希望',
        deliveryDate: '2026-03-30'
      },
      {
        id: 'li_002',
        manufacturerId: 'mfr_002',
        manufacturerName: '佐藤工芸品製作所',
        productName: '漆器箸セット',
        productCode: 'ST-010',
        quantity: 100,
        unit: '組',
        unitPrice: 2500,
        total: 250000,
        notes: '名入れサービス対応',
        deliveryDate: '2026-03-30'
      }
    ],
    totalAmount: 400000,
    budget: 400000,
    deadline: '2026-03-10',
    requiredDeliveryDate: '2026-04-20',
    createdBy: 'user_001',
    assignedTo: 'user_001',
    tags: ['記念品', '総代会'],
    approvalStatus: 'pending',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-05T14:30:00Z'
  },
  {
    id: 'prop_002',
    code: 'P2026-002',
    customerId: 'cust_002',
    customerName: 'テクノロジー株式会社',
    title: '新入社員研修用品一式',
    description: '新年度新入社員研修に使用するノベルティ・研修用品',
    status: 'draft',
    lineItems: [
      {
        id: 'li_003',
        manufacturerId: 'mfr_003',
        manufacturerName: '関西テキスタイル株式会社',
        productName: 'オリジナルトートバッグ',
        productCode: 'KT-050',
        quantity: 50,
        unit: '枚',
        unitPrice: 1200,
        total: 60000,
        deliveryDate: '2026-04-01'
      }
    ],
    totalAmount: 60000,
    budget: 100000,
    deadline: '2026-03-20',
    requiredDeliveryDate: '2026-04-01',
    createdBy: 'user_002',
    tags: ['研修', 'ノベルティ'],
    approvalStatus: 'pending',
    createdAt: '2026-03-03T11:00:00Z',
    updatedAt: '2026-03-03T11:00:00Z'
  },
  {
    id: 'prop_003',
    code: 'P2026-003',
    customerId: 'cust_003',
    customerName: 'グローバル機械工業',
    title: '夏季社員向けギフト提案',
    description: '夏のお中元・社員向けギフトセット',
    status: 'approved',
    lineItems: [
      {
        id: 'li_004',
        manufacturerId: 'mfr_004',
        manufacturerName: '北海道農産物協同組合',
        productName: '北海道野菜詰め合わせ',
        productCode: 'HK-100',
        quantity: 200,
        unit: '箱',
        unitPrice: 3000,
        total: 600000,
        deliveryDate: '2026-07-15'
      }
    ],
    totalAmount: 600000,
    budget: 600000,
    deadline: '2026-06-01',
    requiredDeliveryDate: '2026-07-15',
    createdBy: 'user_001',
    assignedTo: 'user_003',
    tags: ['お中元', 'ギフト'],
    approvalStatus: 'approved',
    approvedBy: 'admin_001',
    approvalDate: '2026-03-04T10:00:00Z',
    createdAt: '2026-02-28T10:00:00Z',
    updatedAt: '2026-03-04T10:00:00Z'
  }
]

// Generate more mock proposals
function generateMockProposals(): Proposal[] {
  const statuses = ['draft', 'submitted', 'quoted', 'approved', 'rejected', 'completed'] as const
  const customers = [
    { id: 'cust_001', name: '株式会社テスト産業' },
    { id: 'cust_002', name: 'テクノロジー株式会社' },
    { id: 'cust_003', name: 'グローバル機械工業' }
  ]
  const result: Proposal[] = []
  for (let i = 4; i <= 20; i++) {
    const cust = customers[i % customers.length]
    const status = statuses[i % statuses.length]
    result.push({
      id: `prop_${String(i).padStart(3, '0')}`,
      code: `P2026-${String(i).padStart(3, '0')}`,
      customerId: cust.id,
      customerName: cust.name,
      title: `提案案件 #${i}`,
      status,
      lineItems: [],
      totalAmount: Math.floor(Math.random() * 500000) + 50000,
      deadline: `2026-0${3 + (i % 6)}-${10 + (i % 15)}`,
      requiredDeliveryDate: `2026-0${4 + (i % 5)}-20`,
      createdBy: 'user_001',
      tags: [],
      approvalStatus: status === 'approved' ? 'approved' : 'pending',
      createdAt: '2026-03-01T09:00:00Z',
      updatedAt: '2026-03-05T09:00:00Z'
    })
  }
  return result
}

const allProposals = [...mockProposals, ...generateMockProposals()]

export default defineEventHandler(async (event) => {
  const method = event.method
  const query = getQuery(event)

  if (method === 'GET') {
    let results = [...allProposals]

    if (query.search) {
      const q = String(query.search).toLowerCase()
      results = results.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q)
      )
    }

    if (query.status) {
      const statuses = String(query.status).split(',')
      results = results.filter(p => statuses.includes(p.status))
    }

    if (query.customerId) {
      results = results.filter(p => p.customerId === String(query.customerId))
    }

    const total = results.length
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 50
    const data = results.slice((page - 1) * pageSize, page * pageSize)

    return { data, total }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const newProposal: Proposal = {
      id: `prop_${Date.now()}`,
      code: `P${new Date().getFullYear()}-${String(allProposals.length + 1).padStart(3, '0')}`,
      customerId: body.customerId,
      customerName: body.customerName,
      title: body.title,
      description: body.description,
      status: 'draft',
      lineItems: body.lineItems || [],
      totalAmount: body.totalAmount || 0,
      budget: body.budget,
      deadline: body.deadline,
      requiredDeliveryDate: body.requiredDeliveryDate,
      createdBy: body.createdBy || 'user_001',
      assignedTo: body.assignedTo,
      tags: body.tags || [],
      approvalStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    allProposals.unshift(newProposal)
    return newProposal
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})
