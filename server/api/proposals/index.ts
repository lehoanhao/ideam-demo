import type { Proposal } from '~/types'

import type { FormRow, RivalEntry, NoteEntry, ProcessHistoryEntry } from '~/stores/proposals'

interface ProposalFormData {
  formRows: FormRow[]
  rivals: RivalEntry[]
  notes: NoteEntry[]
  processHistory: ProcessHistoryEntry[]
}

// Mock form row data per proposal
export const mockProposalFormData: Record<string, ProposalFormData> = {
  // prop_001: draft
  prop_001: {
    formRows: [
      {
        id: 1,
        data: {
          budgetQty: 50, itemGroup: 'ノベルティ', productCode: 'KT-050', productName: 'オリジナルトートバッグ',
          sellingPrice: '1200', packQty: '1', listPrice: '1500', budgetPrice: 1200,
          catalogName: '関西テキスタイルカタログ', catalogPage: 'P.8', manufacturerName: '関西テキスタイル株式会社',
          accountName: 'テクノロジー株式会社', rfqType: '見積依頼', requestDate: '2026-03-03',
          costPrice: '', sampleQty: '1', arrivalDate: '', costNotes: '',
          deliveryNotes: '4/1までに納品', adoptionType: '', contactDate: ''
        },
        createdAt: '2026-03-03T11:00:00Z', updatedAt: null
      }
    ],
    rivals: [{ id: 1, rival: '', note: '' }],
    notes: [],
    processHistory: []
  },
  // prop_002: submitted
  prop_002: {
    formRows: [
      {
        id: 1,
        data: {
          budgetQty: 100, itemGroup: '食品', productCode: 'TK-001', productName: '高級羊羹セット',
          sellingPrice: '1500', packQty: '1', listPrice: '1800', budgetPrice: 1500,
          catalogName: '田中食品2026春', catalogPage: 'P.12', manufacturerName: '田中食品株式会社',
          accountName: '株式会社テスト産業', rfqType: '見積依頼', requestDate: '2026-03-01',
          costPrice: '1200', sampleQty: '2', arrivalDate: '2026-03-25', costNotes: '個別包装希望',
          deliveryNotes: '3/30までに納品', adoptionType: '採用予定', contactDate: '2026-03-02'
        },
        createdAt: '2026-03-01T09:00:00Z', updatedAt: '2026-03-05T14:30:00Z'
      },
      {
        id: 2,
        data: {
          budgetQty: 100, itemGroup: '工芸品', productCode: 'ST-010', productName: '漆器箸セット',
          sellingPrice: '2500', packQty: '1', listPrice: '3000', budgetPrice: 2500,
          catalogName: '佐藤工芸品カタログ', catalogPage: 'P.45', manufacturerName: '佐藤工芸品製作所',
          accountName: '株式会社テスト産業', rfqType: '見積依頼', requestDate: '2026-03-01',
          costPrice: '2000', sampleQty: '1', arrivalDate: '2026-03-25', costNotes: '名入れサービス対応',
          deliveryNotes: '3/30までに納品', adoptionType: '採用予定', contactDate: '2026-03-02'
        },
        createdAt: '2026-03-01T09:30:00Z', updatedAt: '2026-03-05T14:30:00Z'
      }
    ],
    rivals: [{ id: 1, rival: 'ライバルA社', note: '同等品を低価格で提案中' }],
    notes: [{ id: 1, text: '総代会の日程は4/20。記念品は当日配布予定。', rowId: 1, fieldKey: 'deliveryNotes' }],
    processHistory: [
      { step: 1, userName: '加藤 誠', completedAt: '2026-03-01T09:00:00Z' }
    ]
  },
  // prop_003: quoted
  prop_003: {
    formRows: [
      {
        id: 1,
        data: {
          budgetQty: 30, itemGroup: '安全用品', productCode: 'SH-010', productName: '安全ヘルメット',
          sellingPrice: '10000', packQty: '1', listPrice: '12000', budgetPrice: 8000,
          catalogName: '安全用品カタログ', catalogPage: 'P.15', manufacturerName: '田中食品株式会社',
          accountName: 'グローバル機械工業', rfqType: '見積依頼', requestDate: '2026-02-25',
          costPrice: '6500', sampleQty: '1', arrivalDate: '2026-04-05', costNotes: '色:白',
          deliveryNotes: '4/10までに納品', adoptionType: '採用予定', contactDate: '2026-02-27'
        },
        createdAt: '2026-02-25T10:00:00Z', updatedAt: '2026-03-05T11:00:00Z'
      }
    ],
    rivals: [{ id: 1, rival: 'ライバルB社', note: '同型で安価' }],
    notes: [],
    processHistory: [
      { step: 1, userName: '加藤 誠', completedAt: '2026-02-25T10:00:00Z' },
      { step: 2, userName: '加藤 誠', completedAt: '2026-02-27T09:00:00Z' }
    ]
  },
  // prop_004: pricing
  prop_004: {
    formRows: [
      {
        id: 1,
        data: {
          budgetQty: 20, itemGroup: '事務用品', productCode: 'OC-001', productName: 'オフィスチェア',
          sellingPrice: '30000', packQty: '1', listPrice: '35000', budgetPrice: 25000,
          catalogName: 'オフィス家具カタログ', catalogPage: 'P.55', manufacturerName: '田中食品株式会社',
          accountName: '株式会社テスト産業', rfqType: '見積依頼', requestDate: '2026-02-20',
          costPrice: '22000', sampleQty: '1', arrivalDate: '2026-04-10', costNotes: '色指定あり（グレー）',
          deliveryNotes: '4/15までに納品', adoptionType: '採用予定', contactDate: '2026-02-22'
        },
        createdAt: '2026-02-20T09:00:00Z', updatedAt: '2026-03-06T10:00:00Z'
      }
    ],
    rivals: [{ id: 1, rival: 'オフィス用品C社', note: '同型品で安価' }],
    notes: [{ id: 1, text: '色指定を忘れずに', rowId: 1, fieldKey: 'costNotes' }],
    processHistory: [
      { step: 1, userName: '加藤 誠', completedAt: '2026-02-20T09:00:00Z' },
      { step: 2, userName: '加藤 誠', completedAt: '2026-02-22T10:00:00Z' },
      { step: 3, userName: '田中 花子', completedAt: '2026-03-01T09:00:00Z' }
    ]
  },
  // prop_005: pending_approval
  prop_005: {
    formRows: [
      {
        id: 1,
        data: {
          budgetQty: 10, itemGroup: 'IT機器', productCode: 'NPC-100', productName: 'ノートPC',
          sellingPrice: '180000', packQty: '1', listPrice: '200000', budgetPrice: 150000,
          catalogName: 'IT機器カタログ2026', catalogPage: 'P.10', manufacturerName: '関西テキスタイル株式会社',
          accountName: 'テクノロジー株式会社', rfqType: '見積依頼', requestDate: '2026-02-25',
          costPrice: '130000', sampleQty: '0', arrivalDate: '2026-04-15', costNotes: 'メモリ16GB、SSD512GB',
          deliveryNotes: '4/20までに納品', adoptionType: '採用', contactDate: '2026-02-27'
        },
        createdAt: '2026-02-25T11:00:00Z', updatedAt: '2026-03-07T14:00:00Z'
      }
    ],
    rivals: [{ id: 1, rival: '', note: '' }],
    notes: [],
    processHistory: [
      { step: 1, userName: '田中 花子', completedAt: '2026-02-25T11:00:00Z' },
      { step: 2, userName: '田中 花子', completedAt: '2026-02-27T09:00:00Z' },
      { step: 3, userName: '加藤 誠', completedAt: '2026-03-02T10:00:00Z' },
      { step: 4, userName: '加藤 誠', completedAt: '2026-03-05T14:00:00Z' }
    ]
  },
  // prop_006: approved
  prop_006: {
    formRows: [
      {
        id: 1,
        data: {
          budgetQty: 200, itemGroup: '食品', productCode: 'HK-100', productName: '北海道野菜詰め合わせ',
          sellingPrice: '3000', packQty: '1', listPrice: '3500', budgetPrice: 3000,
          catalogName: '北海道農産物カタログ', catalogPage: 'P.22', manufacturerName: '北海道農産物協同組合',
          accountName: 'グローバル機械工業', rfqType: '見積依頼', requestDate: '2026-02-28',
          costPrice: '2400', sampleQty: '3', arrivalDate: '2026-07-10', costNotes: '冷蔵配送必須',
          deliveryNotes: '7/15までに納品', adoptionType: '採用', contactDate: '2026-03-01'
        },
        createdAt: '2026-02-28T10:00:00Z', updatedAt: '2026-03-04T10:00:00Z'
      }
    ],
    rivals: [{ id: 1, rival: 'ライバルB社', note: '果物セットで対抗' }],
    notes: [{ id: 1, text: '冷蔵配送の手配を確認する必要あり', rowId: 1, fieldKey: 'costNotes' }],
    processHistory: [
      { step: 1, userName: '加藤 誠', completedAt: '2026-02-28T10:00:00Z' },
      { step: 2, userName: '加藤 誠', completedAt: '2026-03-01T09:00:00Z' },
      { step: 3, userName: '田中 花子', completedAt: '2026-03-02T10:00:00Z' },
      { step: 4, userName: '田中 花子', completedAt: '2026-03-03T11:00:00Z' },
      { step: 5, userName: '鈴木 一郎', completedAt: '2026-03-04T10:00:00Z' }
    ]
  },
  // prop_008: confirming
  prop_008: {
    formRows: [
      {
        id: 1,
        data: {
          budgetQty: 5, itemGroup: '設備', productCode: 'IP-200', productName: '工業用ポンプ',
          sellingPrice: '350000', packQty: '1', listPrice: '400000', budgetPrice: 300000,
          catalogName: '産業機器カタログ', catalogPage: 'P.30', manufacturerName: '北海道農産物協同組合',
          accountName: 'グローバル機械工業', rfqType: '見積依頼', requestDate: '2026-02-15',
          costPrice: '270000', sampleQty: '0', arrivalDate: '2026-04-25', costNotes: '設置工事込み',
          deliveryNotes: '5/1までに納品・設置', adoptionType: '採用', contactDate: '2026-02-18'
        },
        createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-03-08T09:00:00Z'
      }
    ],
    rivals: [{ id: 1, rival: '設備D社', note: '国産で保証が長い' }],
    notes: [{ id: 1, text: '設置場所のスペース確認済み', rowId: 1, fieldKey: 'deliveryNotes' }],
    processHistory: [
      { step: 1, userName: '加藤 誠', completedAt: '2026-02-15T10:00:00Z' },
      { step: 2, userName: '加藤 誠', completedAt: '2026-02-18T09:00:00Z' },
      { step: 3, userName: '田中 花子', completedAt: '2026-02-25T10:00:00Z' },
      { step: 4, userName: '田中 花子', completedAt: '2026-03-01T14:00:00Z' },
      { step: 5, userName: '鈴木 一郎', completedAt: '2026-03-06T10:00:00Z' }
    ]
  }
}

const mockProposals: Proposal[] = [
  {
    id: 'prop_001',
    code: 'P2026-001',
    customerId: 'cust_002',
    customerName: 'テクノロジー株式会社',
    title: '新入社員研修用品一式',
    description: '新年度新入社員研修に使用するノベルティ・研修用品',
    status: 'draft',
    lineItems: [
      { id: 'li_001', manufacturerId: 'mfr_003', manufacturerName: '関西テキスタイル株式会社', productName: 'オリジナルトートバッグ', productCode: 'KT-050', quantity: 50, unit: '枚', unitPrice: 1200, total: 60000, deliveryDate: '2026-04-01' }
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
    id: 'prop_002',
    code: 'P2026-002',
    customerId: 'cust_001',
    customerName: '株式会社テスト産業',
    title: '総代会組合員記念品提案',
    description: '年次総代会用の記念品として食品・菓子類の提案',
    status: 'submitted',
    lineItems: [
      { id: 'li_002', manufacturerId: 'mfr_001', manufacturerName: '田中食品株式会社', productName: '高級羊羹セット', productCode: 'TK-001', quantity: 100, unit: '個', unitPrice: 1500, total: 150000, notes: '個別包装希望', deliveryDate: '2026-03-30' },
      { id: 'li_003', manufacturerId: 'mfr_002', manufacturerName: '佐藤工芸品製作所', productName: '漆器箸セット', productCode: 'ST-010', quantity: 100, unit: '組', unitPrice: 2500, total: 250000, notes: '名入れサービス対応', deliveryDate: '2026-03-30' }
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
    id: 'prop_003',
    code: 'P2026-003',
    customerId: 'cust_003',
    customerName: 'グローバル機械工業',
    title: '工場向け安全用品セット',
    description: '工場作業員向けの安全用品一式',
    status: 'quoted',
    lineItems: [
      { id: 'li_004', manufacturerId: 'mfr_001', manufacturerName: '田中食品株式会社', productName: '安全ヘルメット', productCode: 'SH-010', quantity: 30, unit: '個', unitPrice: 8000, total: 240000, deliveryDate: '2026-04-10' }
    ],
    totalAmount: 240000,
    budget: 300000,
    deadline: '2026-04-05',
    requiredDeliveryDate: '2026-04-10',
    createdBy: 'user_001',
    assignedTo: 'user_001',
    tags: ['安全用品', '工場'],
    approvalStatus: 'pending',
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-03-05T11:00:00Z'
  },
  {
    id: 'prop_004',
    code: 'P2026-004',
    customerId: 'cust_001',
    customerName: '株式会社テスト産業',
    title: '事務用品提案 - オフィスチェア',
    description: '事務用品の仕入れ値段を決定中',
    status: 'pricing',
    lineItems: [
      { id: 'li_005', manufacturerId: 'mfr_001', manufacturerName: '田中食品株式会社', productName: 'オフィスチェア', productCode: 'OC-001', quantity: 20, unit: '脚', unitPrice: 25000, total: 500000, deliveryDate: '2026-04-15' }
    ],
    totalAmount: 500000,
    budget: 550000,
    deadline: '2026-04-01',
    requiredDeliveryDate: '2026-04-15',
    createdBy: 'user_001',
    assignedTo: 'user_001',
    tags: ['事務用品'],
    approvalStatus: 'pending',
    createdAt: '2026-02-20T09:00:00Z',
    updatedAt: '2026-03-06T10:00:00Z'
  },
  {
    id: 'prop_005',
    code: 'P2026-005',
    customerId: 'cust_002',
    customerName: 'テクノロジー株式会社',
    title: 'IT機器提案 - ノートPC一括購入',
    description: '承認依頼中のIT機器提案',
    status: 'pending_approval',
    lineItems: [
      { id: 'li_006', manufacturerId: 'mfr_003', manufacturerName: '関西テキスタイル株式会社', productName: 'ノートPC', productCode: 'NPC-100', quantity: 10, unit: '台', unitPrice: 150000, total: 1500000, deliveryDate: '2026-04-20' }
    ],
    totalAmount: 1500000,
    budget: 1600000,
    deadline: '2026-04-10',
    requiredDeliveryDate: '2026-04-20',
    createdBy: 'user_002',
    assignedTo: 'user_002',
    tags: ['IT機器'],
    approvalStatus: 'pending',
    createdAt: '2026-02-25T11:00:00Z',
    updatedAt: '2026-03-07T14:00:00Z'
  },
  {
    id: 'prop_006',
    code: 'P2026-006',
    customerId: 'cust_003',
    customerName: 'グローバル機械工業',
    title: '夏季社員向けギフト提案',
    description: '夏のお中元・社員向けギフトセット',
    status: 'approved',
    lineItems: [
      { id: 'li_007', manufacturerId: 'mfr_004', manufacturerName: '北海道農産物協同組合', productName: '北海道野菜詰め合わせ', productCode: 'HK-100', quantity: 200, unit: '箱', unitPrice: 3000, total: 600000, deliveryDate: '2026-07-15' }
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
  },
  {
    id: 'prop_007',
    code: 'P2026-007',
    customerId: 'cust_001',
    customerName: '株式会社テスト産業',
    title: '社内イベント用カタログギフト',
    description: '却下された社内イベント提案',
    status: 'rejected',
    lineItems: [
      { id: 'li_008', manufacturerId: 'mfr_002', manufacturerName: '佐藤工芸品製作所', productName: 'カタログギフト', productCode: 'CG-030', quantity: 50, unit: '冊', unitPrice: 5000, total: 250000, deliveryDate: '2026-05-10' }
    ],
    totalAmount: 250000,
    budget: 200000,
    deadline: '2026-05-01',
    requiredDeliveryDate: '2026-05-10',
    createdBy: 'user_001',
    tags: ['イベント', 'ギフト'],
    approvalStatus: 'rejected',
    createdAt: '2026-02-20T09:00:00Z',
    updatedAt: '2026-03-05T16:00:00Z'
  },
  {
    id: 'prop_008',
    code: 'P2026-008',
    customerId: 'cust_003',
    customerName: 'グローバル機械工業',
    title: '設備提案 - 工業用ポンプ',
    description: '顧客と最終確認中の設備提案',
    status: 'confirming',
    lineItems: [
      { id: 'li_009', manufacturerId: 'mfr_004', manufacturerName: '北海道農産物協同組合', productName: '工業用ポンプ', productCode: 'IP-200', quantity: 5, unit: '台', unitPrice: 300000, total: 1500000, deliveryDate: '2026-05-01' }
    ],
    totalAmount: 1500000,
    budget: 1500000,
    deadline: '2026-04-15',
    requiredDeliveryDate: '2026-05-01',
    createdBy: 'user_001',
    assignedTo: 'user_003',
    tags: ['設備'],
    approvalStatus: 'approved',
    approvedBy: 'admin_001',
    approvalDate: '2026-03-06T10:00:00Z',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-08T09:00:00Z'
  },
  {
    id: 'prop_009',
    code: 'P2026-009',
    customerId: 'cust_002',
    customerName: 'テクノロジー株式会社',
    title: '年末記念品セット納品完了',
    description: '顧客確認済み・完了した年末記念品',
    status: 'completed',
    lineItems: [
      { id: 'li_010', manufacturerId: 'mfr_001', manufacturerName: '田中食品株式会社', productName: '高級茶葉セット', productCode: 'TC-005', quantity: 80, unit: '箱', unitPrice: 2000, total: 160000, deliveryDate: '2025-12-20' }
    ],
    totalAmount: 160000,
    budget: 200000,
    deadline: '2025-12-15',
    requiredDeliveryDate: '2025-12-20',
    createdBy: 'user_002',
    assignedTo: 'user_002',
    tags: ['年末', '記念品'],
    approvalStatus: 'approved',
    approvedBy: 'admin_001',
    approvalDate: '2025-12-01T10:00:00Z',
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2025-12-22T09:00:00Z'
  },
  {
    id: 'prop_010',
    code: 'P2026-010',
    customerId: 'cust_001',
    customerName: '株式会社テスト産業',
    title: '旧年度ノベルティ提案（保管中）',
    description: 'アーカイブ済みの旧年度提案',
    status: 'archived',
    lineItems: [
      { id: 'li_011', manufacturerId: 'mfr_003', manufacturerName: '関西テキスタイル株式会社', productName: 'エコバッグ', productCode: 'EB-020', quantity: 100, unit: '枚', unitPrice: 800, total: 80000, deliveryDate: '2025-09-01' }
    ],
    totalAmount: 80000,
    budget: 100000,
    deadline: '2025-08-25',
    requiredDeliveryDate: '2025-09-01',
    createdBy: 'user_001',
    tags: ['ノベルティ'],
    approvalStatus: 'approved',
    createdAt: '2025-07-01T10:00:00Z',
    updatedAt: '2025-09-10T10:00:00Z'
  }
]

export const allProposals = [...mockProposals]

// Generate mock form data for generated proposals that don't have explicit form data
function generateFormDataForProposal(id: string, proposal: Proposal): ProposalFormData | null {
  if (mockProposalFormData[id]) return null // already has explicit data
  const statusStepMap: Record<string, number> = { draft: 1, submitted: 2, quoted: 3, pricing: 4, pending_approval: 5, approved: 5, completed: 6, confirming: 6, rejected: 5, archived: 6 }
  const currentStepNum = statusStepMap[proposal.status] || 1
  const history: ProcessHistoryEntry[] = []
  for (let s = 1; s < currentStepNum; s++) {
    history.push({ step: s, userName: '加藤 誠', completedAt: '2026-03-01T09:00:00Z' })
  }
  return {
    formRows: [
      {
        id: 1,
        data: {
          budgetQty: 50, itemGroup: '食品', productCode: `GEN-${id.replace('prop_', '')}`,
          productName: `${proposal.title}商品`, sellingPrice: '1500', packQty: '1',
          listPrice: '1800', budgetPrice: 1500, catalogName: 'サンプルカタログ',
          catalogPage: 'P.1', manufacturerName: 'サンプルメーカー', accountName: proposal.customerName,
          rfqType: '見積依頼', requestDate: '2026-03-01', costPrice: '1200',
          sampleQty: '1', arrivalDate: '', costNotes: '', deliveryNotes: '',
          adoptionType: '', contactDate: ''
        },
        createdAt: proposal.createdAt, updatedAt: proposal.updatedAt
      }
    ],
    rivals: [{ id: 1, rival: '', note: '' }],
    notes: [],
    processHistory: history
  }
}

// Pre-populate form data for generated proposals
for (const p of allProposals) {
  if (!mockProposalFormData[p.id]) {
    const generated = generateFormDataForProposal(p.id, p)
    if (generated) mockProposalFormData[p.id] = generated
  }
}

export default defineEventHandler(async (event) => {
  const method = event.method
  const query = getQuery(event)

  if (method === 'GET') {
    let results = [...allProposals]

    if (query.search) {
      const q = String(query.search).toLowerCase()
      results = results.filter(p =>
        p.title.toLowerCase().includes(q)
        || p.code.toLowerCase().includes(q)
        || p.customerName.toLowerCase().includes(q)
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
