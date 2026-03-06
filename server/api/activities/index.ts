import type { SalesActivity } from '~/types'

const mockActivities: SalesActivity[] = [
  {
    id: 'act_001',
    code: 'SA2026-001',
    customerId: 'cust_001',
    customerName: '株式会社テスト産業',
    proposalId: 'prop_001',
    proposalCode: 'P2026-001',
    assignedTo: 'user_001',
    assignedToName: '加藤 誠',
    type: 'visit',
    status: 'completed',
    title: '総代会記念品ヒアリング',
    description: '総代会向け記念品の要望ヒアリング。予算400万円、4000個の見込み。食品・菓子系を中心に提案希望。',
    contactPerson: '山田太郎',
    interestLevel: 'high',
    activityDate: '2026-03-01',
    tags: ['新規訪問', '記念品'],
    comments: [
      { id: 'c1', userId: 'user_001', userName: '加藤 誠', content: '顧客は食品系に強い関心あり。次回は具体的なサンプルを持参予定。', createdAt: '2026-03-01T17:00:00Z' }
    ],
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T17:00:00Z'
  },
  {
    id: 'act_002',
    code: 'SA2026-002',
    customerId: 'cust_002',
    customerName: 'テクノロジー株式会社',
    assignedTo: 'user_002',
    assignedToName: '鈴木 花子',
    type: 'phone',
    status: 'completed',
    title: '新入社員研修用品の確認電話',
    description: '研修用品のニーズを電話でヒアリング。トートバッグ50枚程度。',
    contactPerson: '佐藤次郎',
    interestLevel: 'medium',
    activityDate: '2026-03-02',
    tags: ['フォローアップ'],
    createdAt: '2026-03-02T10:00:00Z',
    updatedAt: '2026-03-02T10:30:00Z'
  },
  {
    id: 'act_003',
    code: 'SA2026-003',
    customerId: 'cust_003',
    customerName: 'グローバル機械工業',
    proposalId: 'prop_003',
    proposalCode: 'P2026-003',
    assignedTo: 'user_001',
    assignedToName: '加藤 誠',
    type: 'visit',
    status: 'in_progress',
    title: '夏季ギフト打ち合わせ',
    description: 'お中元期間の社員向けギフト提案。カタログギフト中心で検討中。',
    contactPerson: '高橋三郎',
    interestLevel: 'high',
    activityDate: '2026-03-05',
    tags: ['新規訪問', 'ギフト'],
    createdAt: '2026-03-04T14:00:00Z',
    updatedAt: '2026-03-05T09:00:00Z'
  },
  {
    id: 'act_004',
    code: 'SA2026-004',
    customerId: 'cust_001',
    customerName: '株式会社テスト産業',
    assignedTo: 'user_001',
    assignedToName: '加藤 誠',
    type: 'email',
    status: 'completed',
    title: 'サンプル送付の連絡',
    description: '記念品候補のサンプル3点を送付した旨をメールで連絡。',
    contactPerson: '山田太郎',
    interestLevel: 'high',
    activityDate: '2026-03-03',
    tags: ['フォローアップ', '記念品'],
    createdAt: '2026-03-03T11:00:00Z',
    updatedAt: '2026-03-03T11:00:00Z'
  },
  {
    id: 'act_005',
    code: 'SA2026-005',
    customerId: 'cust_004',
    customerName: '中部電力グループ',
    assignedTo: 'user_002',
    assignedToName: '鈴木 花子',
    type: 'meeting',
    status: 'planned',
    title: '防災用品提案ミーティング',
    description: '防災グッズのまとめ発注について提案予定。',
    contactPerson: '田中四郎',
    interestLevel: 'medium',
    activityDate: '2026-03-10',
    tags: ['新規訪問', '防災'],
    createdAt: '2026-03-04T09:00:00Z',
    updatedAt: '2026-03-04T09:00:00Z'
  },
  {
    id: 'act_006',
    code: 'SA2026-006',
    customerId: 'cust_005',
    customerName: '東海農業協同組合',
    assignedTo: 'user_001',
    assignedToName: '加藤 誠',
    type: 'visit',
    status: 'planned',
    title: '年度末挨拶訪問',
    description: '年度末のご挨拶と来年度の計画ヒアリング。',
    contactPerson: '伊藤五郎',
    interestLevel: 'low',
    activityDate: '2026-03-15',
    tags: ['定期訪問'],
    createdAt: '2026-03-05T08:00:00Z',
    updatedAt: '2026-03-05T08:00:00Z'
  }
]

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    return { data: mockActivities, total: mockActivities.length }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const newActivity: SalesActivity = {
      id: `act_${Date.now()}`,
      code: `SA2026-${String(mockActivities.length + 1).padStart(3, '0')}`,
      ...body,
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockActivities.unshift(newActivity)
    return newActivity
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})
