import type {
  User,
  Customer,
  Manufacturer,
  SalesActivity,
  ApprovalRequest,
  CommunicationRecord,
  HistoricalRecord,
  Procurement,
  Proposal,
  Tag,
  DailyReport,
  DailyReportEntry,
  Mail,
  Member,
  Notification
} from '~/types'
import type { FormRow, RivalEntry, NoteEntry, ProcessHistoryEntry } from '~/stores/proposals'
import { createEmptyRowData } from '~/stores/proposals'
import { sub } from 'date-fns'

// ============================================================================
// USERS
// ============================================================================

export const mockUsers: User[] = [
  {
    id: 'user_001',
    name: '加藤 誠',
    email: 'kato@ideam.co.jp',
    phone: '03-1111-2222',
    role: 'salesperson',
    status: 'active',
    department: '営業部',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z'
  },
  {
    id: 'user_002',
    name: '田中 花子',
    email: 'tanaka@ideam.co.jp',
    role: 'procurement',
    status: 'active',
    department: '仕入れ部',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z'
  },
  {
    id: 'admin_001',
    name: '鈴木 一郎',
    email: 'admin@ideam.co.jp',
    role: 'admin',
    status: 'active',
    department: '経営',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z'
  },
  {
    id: 'user_003',
    name: '佐藤 次郎',
    email: 'sato@ideam.co.jp',
    role: 'manager',
    status: 'active',
    department: '営業部',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z'
  }
]

// ============================================================================
// CUSTOMERS
// ============================================================================

const baseCustomers: Customer[] = [
  {
    id: 'cust_001',
    code: 'C001',
    name: '株式会社テスト産業',
    furigana: 'かぶしきがいしゃてすとさんぎょう',
    tags: ['検査機器', '精密機器', 'VIP'],
    contacts: [
      { id: 'cont_001', type: 'email', value: 'contact@test-sangyo.jp', name: '田中太郎', isPrimary: true },
      { id: 'cont_002', type: 'phone', value: '03-1234-5678', isPrimary: false }
    ],
    assignedSalesStaff: ['user_001', 'user_002'],
    notes: '毎月定期発注あり。VIP顧客として最優先対応。',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-05T14:30:00Z'
  },
  {
    id: 'cust_002',
    code: 'C002',
    name: 'テクノロジー株式会社',
    furigana: 'てくのろじーかぶしきがいしゃ',
    tags: ['電子部品', 'IoT', '新規'],
    contacts: [
      { id: 'cont_003', type: 'email', value: 'info@technology-co.jp', name: '鈴木花子', isPrimary: true },
      { id: 'cont_006', type: 'phone', value: '03-9876-5432', isPrimary: false }
    ],
    assignedSalesStaff: ['user_003'],
    notes: '定期的な調達あり。IoTデバイス関連部品が主要品目。',
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-03-04T16:00:00Z'
  },
  {
    id: 'cust_003',
    code: 'C003',
    name: 'グローバル機械工業株式会社',
    furigana: 'ぐろーばるきかいこうぎょうかぶしきがいしゃ',
    tags: ['機械部品', '自動車', 'VIP'],
    contacts: [
      { id: 'cont_004', type: 'fax', value: '06-5678-9012', name: '佐藤次郎', isPrimary: true },
      { id: 'cont_005', type: 'email', value: 'procurement@global-machinery.jp', isPrimary: false }
    ],
    assignedSalesStaff: ['user_001', 'user_004'],
    notes: '四半期ごとのレビューあり。大口顧客。',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-03-03T13:45:00Z'
  },
  {
    id: 'cust_004',
    code: 'C004',
    name: '精工電機株式会社',
    furigana: 'せいこうでんきかぶしきがいしゃ',
    tags: ['電子部品', '精密機器'],
    contacts: [
      { id: 'cont_007', type: 'email', value: 'sales@seiko-denki.jp', name: '高橋一郎', isPrimary: true }
    ],
    assignedSalesStaff: ['user_002'],
    notes: '精密電子部品の大手メーカーへの納入実績あり。',
    createdAt: '2024-01-20T08:30:00Z',
    updatedAt: '2024-02-28T11:00:00Z'
  },
  {
    id: 'cust_005',
    code: 'C005',
    name: '北海道食品工業株式会社',
    furigana: 'ほっかいどうしょくひんこうぎょうかぶしきがいしゃ',
    tags: ['食品', '製造装置'],
    contacts: [
      { id: 'cont_008', type: 'email', value: 'info@hokkaido-food.jp', name: '伊藤美咲', isPrimary: true },
      { id: 'cont_009', type: 'fax', value: '011-234-5678', isPrimary: false }
    ],
    assignedSalesStaff: ['user_003', 'user_004'],
    notes: '食品製造ライン向け装置の定期メンテナンス契約あり。',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-03-01T10:30:00Z'
  },
  {
    id: 'cust_006',
    code: 'C006',
    name: '大阪化学工業株式会社',
    furigana: 'おおさかかがくこうぎょうかぶしきがいしゃ',
    tags: ['化学', '特殊素材', 'VIP'],
    contacts: [
      { id: 'cont_010', type: 'email', value: 'contact@osaka-chem.jp', name: '渡辺健太', isPrimary: true },
      { id: 'cont_011', type: 'phone', value: '06-1111-2222', isPrimary: false }
    ],
    assignedSalesStaff: ['user_001'],
    notes: '特殊化学素材の専門商社。年間契約更新済み。',
    createdAt: '2023-12-15T14:00:00Z',
    updatedAt: '2024-03-05T09:00:00Z'
  },
  {
    id: 'cust_007',
    code: 'C007',
    name: '名古屋自動車部品工業',
    furigana: 'なごやじどうしゃぶひんこうぎょう',
    tags: ['自動車', '金属加工'],
    contacts: [
      { id: 'cont_012', type: 'email', value: 'parts@nagoya-auto.jp', name: '山田浩司', isPrimary: true }
    ],
    assignedSalesStaff: ['user_002', 'user_003'],
    notes: '自動車OEMの下請け。品質基準が非常に厳しい。',
    createdAt: '2024-01-10T13:00:00Z',
    updatedAt: '2024-02-20T15:00:00Z'
  },
  {
    id: 'cust_008',
    code: 'C008',
    name: '東京メディカル機器株式会社',
    furigana: 'とうきょうめでぃかるきけいかぶしきがいしゃ',
    tags: ['医療機器', '精密機器', '新規'],
    contacts: [
      { id: 'cont_013', type: 'email', value: 'procurement@tokyo-medical.jp', name: '中村さゆり', isPrimary: true },
      { id: 'cont_014', type: 'phone', value: '03-5555-6666', isPrimary: false }
    ],
    assignedSalesStaff: ['user_004'],
    notes: '医療機器向け精密部品。ISO認定必須。新規取引開始。',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z'
  },
  {
    id: 'cust_009',
    code: 'C009',
    name: '九州プラスチック工業',
    furigana: 'きゅうしゅうぷらすちっくこうぎょう',
    tags: ['プラスチック', '成形品'],
    contacts: [
      { id: 'cont_015', type: 'email', value: 'sales@kyushu-plastic.jp', name: '小林誠', isPrimary: true }
    ],
    assignedSalesStaff: ['user_001'],
    notes: '樹脂成形品専門。射出成形・ブロー成形対応。',
    createdAt: '2024-01-25T08:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z'
  },
  {
    id: 'cust_010',
    code: 'C010',
    name: '横浜セラミックス株式会社',
    furigana: 'よこはませらみっくすかぶしきがいしゃ',
    tags: ['セラミック', '特殊素材'],
    contacts: [
      { id: 'cont_016', type: 'email', value: 'info@yokohama-ceramics.jp', name: '松本幸子', isPrimary: true },
      { id: 'cont_017', type: 'fax', value: '045-333-4444', isPrimary: false }
    ],
    assignedSalesStaff: ['user_002', 'user_004'],
    notes: '高機能セラミック部品の製造。耐熱・耐腐食性素材が主力。',
    createdAt: '2024-02-05T11:00:00Z',
    updatedAt: '2024-03-02T14:00:00Z'
  },
  {
    id: 'cust_011',
    code: 'C011',
    name: '札幌金属加工センター',
    furigana: 'さっぽろきんぞくかこうせんたー',
    tags: ['金属加工', '切削加工'],
    contacts: [
      { id: 'cont_018', type: 'email', value: 'contact@sapporo-metal.jp', name: '加藤雄一', isPrimary: true }
    ],
    assignedSalesStaff: ['user_003'],
    notes: 'NC旋盤・マシニングセンタによる精密加工。短納期対応可。',
    createdAt: '2023-11-20T09:00:00Z',
    updatedAt: '2024-02-10T16:00:00Z'
  },
  {
    id: 'cust_012',
    code: 'C012',
    name: '福岡電子工業株式会社',
    furigana: 'ふくおかでんしこうぎょうかぶしきがいしゃ',
    tags: ['電子部品', 'IoT', 'VIP'],
    contacts: [
      { id: 'cont_019', type: 'email', value: 'info@fukuoka-electronics.jp', name: '村上真一', isPrimary: true },
      { id: 'cont_020', type: 'phone', value: '092-777-8888', isPrimary: false }
    ],
    assignedSalesStaff: ['user_001', 'user_002'],
    notes: 'IoT端末向け電子回路基板の主要サプライヤー。',
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2024-03-04T09:00:00Z'
  }
]

function generateExtraCustomers(): Customer[] {
  const industries = ['機械', '電子', 'プラスチック', '化学', '食品', '金属', 'セラミック']
  const cities = ['東京', '大阪', '名古屋', '福岡', '札幌', '横浜', '仙台', '広島', '神戸', '京都']
  const suffixes = ['株式会社', '有限会社', '工業', '工業株式会社', '産業株式会社']
  const cityFurigana: Record<string, string> = {
    東京: 'とうきょう', 大阪: 'おおさか', 名古屋: 'なごや', 福岡: 'ふくおか',
    札幌: 'さっぽろ', 横浜: 'よこはま', 仙台: 'せんだい', 広島: 'ひろしま',
    神戸: 'こうべ', 京都: 'きょうと'
  }
  const industryFurigana: Record<string, string> = {
    機械: 'きかい', 電子: 'でんし', プラスチック: 'ぷらすちっく',
    化学: 'かがく', 食品: 'しょくひん', 金属: 'きんぞく', セラミック: 'せらみっく'
  }
  const tagOptions = ['VIP', '新規', '要注意', '一般', '優良顧客']
  const result: Customer[] = []

  for (let i = 13; i <= 60; i++) {
    const industry = industries[(i - 1) % industries.length]
    const city = cities[(i - 1) % cities.length]
    const suffix = suffixes[i % suffixes.length]
    const extraTag = tagOptions[i % tagOptions.length]

    result.push({
      id: `cust_${String(i).padStart(3, '0')}`,
      code: `C${String(i).padStart(3, '0')}`,
      name: `${city}${industry}${suffix}`,
      furigana: `${cityFurigana[city]}${industryFurigana[industry]}${suffix === '株式会社' ? 'かぶしきがいしゃ' : suffix === '有限会社' ? 'ゆうげんがいしゃ' : 'こうぎょう'}`,
      tags: [industry, extraTag],
      contacts: [
        { id: `cont_${String(i).padStart(3, '0')}`, type: 'email', value: `contact@company-${i}.jp`, name: `担当者${i}`, isPrimary: true }
      ],
      assignedSalesStaff: [`user_${(i % 4) + 1}`],
      createdAt: new Date(2024, (i % 12), 1 + (i % 28)).toISOString(),
      updatedAt: new Date(2024, (i % 12), 1 + (i % 28)).toISOString()
    })
  }
  return result
}

export const mockCustomers: Customer[] = [...baseCustomers, ...generateExtraCustomers()]

// ============================================================================
// MANUFACTURERS
// ============================================================================

const baseManufacturers: Manufacturer[] = [
  {
    id: 'mfr_001', code: 'M001', name: '田中食品株式会社', furigana: 'たなかしょくひんかぶしきがいしゃ',
    tags: ['食品', '菓子'], contactEmail: 'contact@tanaka-foods.jp', contactPhone: '03-1234-5678',
    faxNumber: '03-1234-5679', preferredContactMethod: 'email',
    productCategories: ['食品', '菓子', 'ドリンク'], notes: '定期的な取引あり。月次でカタログ提供。',
    createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-03-01T14:00:00Z'
  },
  {
    id: 'mfr_002', code: 'M002', name: '佐藤工芸品製作所', furigana: 'さとうこうげいひんせいさくしょ',
    tags: ['工芸品', '雑貨'], contactEmail: 'info@sato-crafts.jp', contactPhone: '06-9876-5432',
    faxNumber: '06-9876-5433', preferredContactMethod: 'fax',
    productCategories: ['工芸品', '雑貨', 'ギフト'], notes: '',
    createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-28T16:30:00Z'
  },
  {
    id: 'mfr_003', code: 'M003', name: '関西テキスタイル株式会社', furigana: 'かんさいてきすたいるかぶしきがいしゃ',
    tags: ['繊維', 'アパレル'], contactEmail: 'sales@kansai-textile.jp', contactPhone: '06-2222-3333',
    preferredContactMethod: 'email', productCategories: ['繊維', 'テキスタイル'],
    createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-03-04T09:15:00Z'
  },
  {
    id: 'mfr_004', code: 'M004', name: '北海道農産物協同組合', furigana: 'ほっかいどうのうさんぶつきょうどうくみあい',
    tags: ['農産物', '有機'], contactEmail: 'order@hokkaido-nosan.jp', faxNumber: '011-456-7890',
    contactPhone: '011-456-7800', preferredContactMethod: 'fax',
    productCategories: ['農産物', '野菜', '果物'], notes: '季節限定商品あり',
    createdAt: '2024-01-05T08:00:00Z', updatedAt: '2024-03-05T10:00:00Z'
  },
  {
    id: 'mfr_005', code: 'M005', name: '東洋プラスチック工業', furigana: 'とうようぷらすちっくこうぎょう',
    tags: ['プラスチック', '容器'], contactEmail: 'sales@toyo-plastic.jp', contactPhone: '03-5555-6666',
    preferredContactMethod: 'email', productCategories: ['プラスチック容器', '包装材'],
    createdAt: '2024-02-15T13:00:00Z', updatedAt: '2024-03-02T11:00:00Z'
  }
]

function generateExtraManufacturers(): Manufacturer[] {
  const categories = ['食品', '電子部品', '化学品', '機械部品', '繊維', 'プラスチック', '金属']
  const prefectures = ['東京', '大阪', '名古屋', '福岡', '札幌', '仙台', '広島']
  const result: Manufacturer[] = []
  for (let i = 6; i <= 30; i++) {
    const idx = i - 6
    result.push({
      id: `mfr_${String(i).padStart(3, '0')}`,
      code: `M${String(i).padStart(3, '0')}`,
      name: `${prefectures[idx % prefectures.length]}製造株式会社${i}`,
      tags: [categories[idx % categories.length]],
      contactEmail: `contact${i}@example.jp`,
      contactPhone: `0${3 + (i % 5)}-${1000 + i}-${2000 + i}`,
      preferredContactMethod: i % 2 === 0 ? 'email' : 'fax',
      productCategories: [categories[idx % categories.length]],
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-03-01T09:00:00Z'
    })
  }
  return result
}

export const mockManufacturers: Manufacturer[] = [...baseManufacturers, ...generateExtraManufacturers()]

// ============================================================================
// ACTIVITIES
// ============================================================================

export const mockActivities: SalesActivity[] = [
  {
    id: 'act_001', code: 'SA2026-001', customerId: 'cust_001', customerName: '株式会社テスト産業',
    proposalId: 'prop_001', proposalCode: 'P2026-001', assignedTo: 'user_001', assignedToName: '加藤 誠',
    type: 'visit', status: 'completed', title: '総代会記念品ヒアリング',
    description: '総代会向け記念品の要望ヒアリング。予算400万円、4000個の見込み。食品・菓子系を中心に提案希望。',
    contactPerson: '山田太郎', interestLevel: 'high', activityDate: '2026-03-01',
    tags: ['新規訪問', '記念品'],
    comments: [{ id: 'c1', userId: 'user_001', userName: '加藤 誠', content: '顧客は食品系に強い関心あり。次回は具体的なサンプルを持参予定。', createdAt: '2026-03-01T17:00:00Z' }],
    createdAt: '2026-03-01T09:00:00Z', updatedAt: '2026-03-01T17:00:00Z'
  },
  {
    id: 'act_002', code: 'SA2026-002', customerId: 'cust_002', customerName: 'テクノロジー株式会社',
    assignedTo: 'user_002', assignedToName: '鈴木 花子', type: 'phone', status: 'completed',
    title: '新入社員研修用品の確認電話',
    description: '研修用品のニーズを電話でヒアリング。トートバッグ50枚程度。',
    contactPerson: '佐藤次郎', interestLevel: 'medium', activityDate: '2026-03-02',
    tags: ['フォローアップ'], createdAt: '2026-03-02T10:00:00Z', updatedAt: '2026-03-02T10:30:00Z'
  },
  {
    id: 'act_003', code: 'SA2026-003', customerId: 'cust_003', customerName: 'グローバル機械工業',
    proposalId: 'prop_003', proposalCode: 'P2026-003', assignedTo: 'user_001', assignedToName: '加藤 誠',
    type: 'visit', status: 'in_progress', title: '夏季ギフト打ち合わせ',
    description: 'お中元期間の社員向けギフト提案。カタログギフト中心で検討中。',
    contactPerson: '高橋三郎', interestLevel: 'high', activityDate: '2026-03-05',
    tags: ['新規訪問', 'ギフト'], createdAt: '2026-03-04T14:00:00Z', updatedAt: '2026-03-05T09:00:00Z'
  },
  {
    id: 'act_004', code: 'SA2026-004', customerId: 'cust_001', customerName: '株式会社テスト産業',
    assignedTo: 'user_001', assignedToName: '加藤 誠', type: 'email', status: 'completed',
    title: 'サンプル送付の連絡',
    description: '記念品候補のサンプル3点を送付した旨をメールで連絡。',
    contactPerson: '山田太郎', interestLevel: 'high', activityDate: '2026-03-03',
    tags: ['フォローアップ', '記念品'], createdAt: '2026-03-03T11:00:00Z', updatedAt: '2026-03-03T11:00:00Z'
  },
  {
    id: 'act_005', code: 'SA2026-005', customerId: 'cust_004', customerName: '中部電力グループ',
    assignedTo: 'user_002', assignedToName: '鈴木 花子', type: 'meeting', status: 'planned',
    title: '防災用品提案ミーティング', description: '防災グッズのまとめ発注について提案予定。',
    contactPerson: '田中四郎', interestLevel: 'medium', activityDate: '2026-03-10',
    tags: ['新規訪問', '防災'], createdAt: '2026-03-04T09:00:00Z', updatedAt: '2026-03-04T09:00:00Z'
  },
  {
    id: 'act_006', code: 'SA2026-006', customerId: 'cust_005', customerName: '東海農業協同組合',
    assignedTo: 'user_001', assignedToName: '加藤 誠', type: 'visit', status: 'planned',
    title: '年度末挨拶訪問', description: '年度末のご挨拶と来年度の計画ヒアリング。',
    contactPerson: '伊藤五郎', interestLevel: 'low', activityDate: '2026-03-15',
    tags: ['定期訪問'], createdAt: '2026-03-05T08:00:00Z', updatedAt: '2026-03-05T08:00:00Z'
  }
]

// ============================================================================
// APPROVALS
// ============================================================================

export const mockApprovals: ApprovalRequest[] = [
  { id: 'apr-001', type: 'proposal', targetId: 'prop-001', targetCode: 'P2026-001', targetTitle: 'PCサーバー更新提案', requesterName: '加藤 太郎', requestedAt: '2026-03-01T09:00:00Z', status: 'pending', approverRole: 'manager', notes: '至急ご確認をお願いします' },
  { id: 'apr-002', type: 'proposal', targetId: 'prop-002', targetCode: 'P2026-002', targetTitle: 'ネットワーク機器リプレース', requesterName: '田中 花子', requestedAt: '2026-02-28T14:30:00Z', status: 'approved', approverRole: 'manager', approverName: '鈴木 部長', approvedAt: '2026-03-01T10:00:00Z', notes: '承認済み' },
  { id: 'apr-003', type: 'procurement', targetId: 'proc-001', targetCode: 'PO2026-001', targetTitle: 'サーバーラック購入', requesterName: '佐藤 次郎', requestedAt: '2026-02-27T11:00:00Z', status: 'rejected', approverRole: 'manager', approverName: '鈴木 部長', approvedAt: '2026-02-28T09:00:00Z', rejectionReason: '予算超過のため再検討が必要です', notes: '否認' },
  { id: 'apr-004', type: 'proposal', targetId: 'prop-003', targetCode: 'P2026-003', targetTitle: 'セキュリティソフトウェア導入', requesterName: '加藤 太郎', requestedAt: '2026-03-02T08:00:00Z', status: 'pending', approverRole: 'admin', notes: '来週の会議に向けて確認お願いします' },
  { id: 'apr-005', type: 'order', targetId: 'proc-003', targetCode: 'PO2026-003', targetTitle: 'クラウドストレージサービス契約', requesterName: '田中 花子', requestedAt: '2026-03-03T10:00:00Z', status: 'pending', approverRole: 'manager', notes: '継続利用のため早期承認を希望' },
  { id: 'apr-006', type: 'proposal', targetId: 'prop-004', targetCode: 'P2026-004', targetTitle: 'プリンター複合機更新', requesterName: '山田 三郎', requestedAt: '2026-02-25T13:00:00Z', status: 'approved', approverRole: 'manager', approverName: '鈴木 部長', approvedAt: '2026-02-26T15:00:00Z' },
  { id: 'apr-007', type: 'procurement', targetId: 'proc-007', targetCode: 'PO2026-007', targetTitle: 'UPS装置導入', requesterName: '佐藤 次郎', requestedAt: '2026-03-04T09:30:00Z', status: 'pending', approverRole: 'manager' },
  { id: 'apr-008', type: 'proposal', targetId: 'prop-008', targetCode: 'P2026-008', targetTitle: 'ビデオ会議システム導入', requesterName: '加藤 太郎', requestedAt: '2026-02-20T10:00:00Z', status: 'approved', approverRole: 'admin', approverName: '管理者', approvedAt: '2026-02-21T09:00:00Z' }
]

// ============================================================================
// COMMUNICATIONS
// ============================================================================

export const mockCommunications: CommunicationRecord[] = [
  { id: 'comm_001', channel: 'fax', procurementId: 'proc_001', procurementCode: 'PR2026-001', recipientAddress: '052-123-4567', recipientName: '田中食品株式会社', status: 'delivered', sentAt: '2026-03-02T10:00:00Z', operatorId: 'user_003', operatorName: '山本 太郎', notes: '見積依頼テンプレート使用' },
  { id: 'comm_002', channel: 'email', procurementId: 'proc_001', procurementCode: 'PR2026-001', recipientAddress: 'info@sato-crafts.co.jp', recipientName: '佐藤工芸品製作所', subject: '【見積依頼】漆器箸セットについて', status: 'delivered', sentAt: '2026-03-02T10:15:00Z', operatorId: 'user_003', operatorName: '山本 太郎' },
  { id: 'comm_003', channel: 'fax', procurementId: 'proc_002', procurementCode: 'PR2026-002', recipientAddress: '03-9876-5432', recipientName: '関西テキスタイル株式会社', status: 'sent', sentAt: '2026-03-03T14:00:00Z', operatorId: 'user_003', operatorName: '山本 太郎' },
  { id: 'comm_004', channel: 'email', procurementId: 'proc_003', procurementCode: 'PR2026-003', recipientAddress: 'sales@tokai-gift.jp', recipientName: '東海ギフトセンター', subject: '【見積依頼】カタログギフトセット', status: 'delivered', sentAt: '2026-03-04T09:30:00Z', operatorId: 'user_003', operatorName: '山本 太郎' },
  { id: 'comm_005', channel: 'fax', procurementId: 'proc_003', procurementCode: 'PR2026-003', recipientAddress: '0566-78-9012', recipientName: '中京物産株式会社', status: 'failed', sentAt: '2026-03-04T09:45:00Z', operatorId: 'user_003', operatorName: '山本 太郎', notes: '番号不通のため再送必要' },
  { id: 'comm_006', channel: 'email', procurementId: 'proc_001', procurementCode: 'PR2026-001', recipientAddress: 'tanaka@tanaka-foods.co.jp', recipientName: '田中食品株式会社', subject: '【再見積依頼】高級羊羹セット 数量変更', status: 'pending', sentAt: '2026-03-05T08:00:00Z', operatorId: 'user_003', operatorName: '山本 太郎' }
]

// ============================================================================
// HISTORICAL
// ============================================================================

function generateHistoricalRecords(): HistoricalRecord[] {
  const products = [
    { name: '高級羊羹セット', code: 'TK-001', mfr: '田中食品株式会社', mfrId: 'mfr_001' },
    { name: '漆器箸セット', code: 'ST-010', mfr: '佐藤工芸品製作所', mfrId: 'mfr_002' },
    { name: 'オリジナルトートバッグ', code: 'KT-050', mfr: '関西テキスタイル株式会社', mfrId: 'mfr_003' },
    { name: '北海道野菜詰め合わせ', code: 'HK-100', mfr: '北海道農産物協同組合', mfrId: 'mfr_004' },
    { name: 'オリジナルノート5冊セット', code: 'NP-020', mfr: '日本印刷工業株式会社', mfrId: 'mfr_005' },
    { name: '精米2kgセット', code: 'CM-030', mfr: '中部米穀商', mfrId: 'mfr_006' },
    { name: '名入れボールペン10本', code: 'TP-200', mfr: '東京文具株式会社', mfrId: 'mfr_007' }
  ]
  const customers = [
    { id: 'cust_001', name: '株式会社テスト産業', code: '00611' },
    { id: 'cust_002', name: 'テクノロジー株式会社', code: '00705' },
    { id: 'cust_003', name: 'グローバル機械工業', code: '00812' }
  ]

  const records: HistoricalRecord[] = []
  let idCounter = 1
  for (let year = 2024; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      const custIdx = (idCounter) % customers.length
      const prodIdx = (idCounter + month) % products.length
      const cust = customers[custIdx]!
      const prod = products[prodIdx]!
      const qty = Math.floor(Math.random() * 200) + 50
      const unitPrice = Math.floor(Math.random() * 3000) + 500
      const totalAmount = qty * unitPrice
      const cost = Math.floor(totalAmount * 0.7)
      const profit = totalAmount - cost
      const orderDate = `${year}-${String(month).padStart(2, '0')}-10`
      const delivDate = `${year}-${String(month).padStart(2, '0')}-25`

      records.push({
        id: `hist_${String(idCounter).padStart(3, '0')}`,
        proposalCode: `P${year}-${String(idCounter).padStart(3, '0')}`,
        customerId: cust.id, customerName: cust.name, customerCode: cust.code,
        manufacturerId: prod.mfrId, manufacturerName: prod.mfr,
        productCode: prod.code, productName: prod.name,
        quantity: qty, unit: '個', unitPrice, totalAmount,
        orderDate, deliveryDate: delivDate, completionDate: delivDate,
        profit, profitMargin: Math.round((profit / totalAmount) * 100),
        tags: [], createdAt: `${year}-${String(month).padStart(2, '0')}-01T09:00:00Z`
      })
      idCounter++
    }
  }
  return records
}

export const mockHistoricalRecords: HistoricalRecord[] = generateHistoricalRecords()

// ============================================================================
// PROCUREMENTS
// ============================================================================

const baseProcurements: Procurement[] = [
  {
    id: 'proc_001', code: 'SC2026-001', proposalId: 'prop_001', proposalCode: 'P2026-001',
    items: [{ id: 'pi_001', proposalLineItemId: 'li_001', manufacturerId: 'mfr_001', manufacturerName: '田中食品株式会社', productName: '高級羊羹セット', quantity: 100, unit: '個', requestedUnitPrice: 1500, quotedUnitPrice: 1400, finalUnitPrice: 1400, deliveryDate: '2026-03-25', notes: '個別包装希望' }],
    status: 'ordered', rfqSentDate: '2026-03-05', rfqChannel: 'email', quotationReceivedDate: '2026-03-08',
    orderDate: '2026-03-10', expectedDeliveryDate: '2026-03-25', totalQuotedAmount: 140000, totalOrderedAmount: 140000,
    notes: '総代会用記念品', createdBy: 'user_001', assignedTo: 'user_001',
    createdAt: '2026-03-05T09:00:00Z', updatedAt: '2026-03-10T14:00:00Z'
  },
  {
    id: 'proc_002', code: 'SC2026-002', proposalId: 'prop_002', proposalCode: 'P2026-002',
    items: [{ id: 'pi_002', manufacturerId: 'mfr_003', manufacturerName: '関西テキスタイル株式会社', productName: 'オリジナルトートバッグ', quantity: 50, unit: '枚', requestedUnitPrice: 1200, deliveryDate: '2026-04-01' }],
    status: 'rfq_sent', rfqSentDate: '2026-03-04', rfqChannel: 'fax', expectedDeliveryDate: '2026-04-01',
    createdBy: 'user_002', assignedTo: 'user_002',
    createdAt: '2026-03-04T10:00:00Z', updatedAt: '2026-03-04T10:00:00Z'
  },
  {
    id: 'proc_003', code: 'SC2026-003', proposalId: 'prop_003', proposalCode: 'P2026-003',
    items: [{ id: 'pi_003', manufacturerId: 'mfr_004', manufacturerName: '北海道農産物協同組合', productName: '北海道野菜詰め合わせ', quantity: 200, unit: '箱', requestedUnitPrice: 2800, quotedUnitPrice: 2750, finalUnitPrice: 2750, deliveryDate: '2026-07-12' }],
    status: 'quoted', rfqSentDate: '2026-03-01', rfqChannel: 'email', quotationReceivedDate: '2026-03-06',
    expectedDeliveryDate: '2026-07-12', totalQuotedAmount: 550000, notes: 'お中元ギフト用',
    createdBy: 'user_001', assignedTo: 'user_003',
    createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-06T16:00:00Z'
  }
]

function generateExtraProcurements(): Procurement[] {
  const statuses = ['draft', 'rfq_sent', 'quoted', 'ordered', 'received', 'completed'] as const
  const result: Procurement[] = []
  for (let i = 4; i <= 15; i++) {
    result.push({
      id: `proc_${String(i).padStart(3, '0')}`,
      code: `SC2026-${String(i).padStart(3, '0')}`,
      items: [], status: statuses[i % statuses.length],
      expectedDeliveryDate: `2026-0${3 + (i % 5)}-${10 + (i % 15)}`,
      createdBy: 'user_001', assignedTo: 'user_001',
      createdAt: '2026-03-01T09:00:00Z', updatedAt: '2026-03-05T09:00:00Z'
    })
  }
  return result
}

export const mockProcurements: Procurement[] = [...baseProcurements, ...generateExtraProcurements()]

// ============================================================================
// PROPOSALS
// ============================================================================

export interface ProposalFormData {
  formRows: FormRow[]
  rivals: RivalEntry[]
  notes: NoteEntry[]
  processHistory: ProcessHistoryEntry[]
}

export const mockProposalFormData: Record<string, ProposalFormData> = {
  prop_001: {
    formRows: [
      { id: 1, data: { budgetQty: 50, itemGroup: 'ノベルティ', productCode: 'KT-050', productName: 'オリジナルトートバッグ', sellingPrice: '1200', packQty: '1', listPrice: '1500', budgetPrice: 1200, catalogName: '関西テキスタイルカタログ', catalogPage: 'P.8', manufacturerName: '関西テキスタイル株式会社', accountName: 'テクノロジー株式会社', rfqType: '見積依頼', requestDate: '2026-03-03', costPrice: '', sampleQty: '1', arrivalDate: '', costNotes: '', deliveryNotes: '4/1までに納品', adoptionType: '', contactDate: '' }, createdAt: '2026-03-03T11:00:00Z', updatedAt: null }
    ],
    rivals: [{ id: 1, rival: '', note: '' }], notes: [], processHistory: []
  },
  prop_002: {
    formRows: [
      { id: 1, data: { budgetQty: 100, itemGroup: '食品', productCode: 'TK-001', productName: '高級羊羹セット', sellingPrice: '1500', packQty: '1', listPrice: '1800', budgetPrice: 1500, catalogName: '田中食品2026春', catalogPage: 'P.12', manufacturerName: '田中食品株式会社', accountName: '株式会社テスト産業', rfqType: '見積依頼', requestDate: '2026-03-01', costPrice: '1200', sampleQty: '2', arrivalDate: '2026-03-25', costNotes: '個別包装希望', deliveryNotes: '3/30までに納品', adoptionType: '採用予定', contactDate: '2026-03-02' }, createdAt: '2026-03-01T09:00:00Z', updatedAt: '2026-03-05T14:30:00Z' },
      { id: 2, data: { budgetQty: 100, itemGroup: '工芸品', productCode: 'ST-010', productName: '漆器箸セット', sellingPrice: '2500', packQty: '1', listPrice: '3000', budgetPrice: 2500, catalogName: '佐藤工芸品カタログ', catalogPage: 'P.45', manufacturerName: '佐藤工芸品製作所', accountName: '株式会社テスト産業', rfqType: '見積依頼', requestDate: '2026-03-01', costPrice: '2000', sampleQty: '1', arrivalDate: '2026-03-25', costNotes: '名入れサービス対応', deliveryNotes: '3/30までに納品', adoptionType: '採用予定', contactDate: '2026-03-02' }, createdAt: '2026-03-01T09:30:00Z', updatedAt: '2026-03-05T14:30:00Z' }
    ],
    rivals: [{ id: 1, rival: 'ライバルA社', note: '同等品を低価格で提案中' }],
    notes: [{ id: 1, text: '総代会の日程は4/20。記念品は当日配布予定。', rowId: 1, fieldKey: 'deliveryNotes' }],
    processHistory: [{ step: 1, userName: '加藤 誠', completedAt: '2026-03-01T09:00:00Z' }]
  },
  prop_003: {
    formRows: [
      { id: 1, data: { budgetQty: 30, itemGroup: '安全用品', productCode: 'SH-010', productName: '安全ヘルメット', sellingPrice: '10000', packQty: '1', listPrice: '12000', budgetPrice: 8000, catalogName: '安全用品カタログ', catalogPage: 'P.15', manufacturerName: '田中食品株式会社', accountName: 'グローバル機械工業', rfqType: '見積依頼', requestDate: '2026-02-25', costPrice: '6500', sampleQty: '1', arrivalDate: '2026-04-05', costNotes: '色:白', deliveryNotes: '4/10までに納品', adoptionType: '採用予定', contactDate: '2026-02-27' }, createdAt: '2026-02-25T10:00:00Z', updatedAt: '2026-03-05T11:00:00Z' }
    ],
    rivals: [{ id: 1, rival: 'ライバルB社', note: '同型で安価' }], notes: [],
    processHistory: [{ step: 1, userName: '加藤 誠', completedAt: '2026-02-25T10:00:00Z' }, { step: 2, userName: '加藤 誠', completedAt: '2026-02-27T09:00:00Z' }]
  },
  prop_004: {
    formRows: [
      { id: 1, data: { budgetQty: 20, itemGroup: '事務用品', productCode: 'OC-001', productName: 'オフィスチェア', sellingPrice: '30000', packQty: '1', listPrice: '35000', budgetPrice: 25000, catalogName: 'オフィス家具カタログ', catalogPage: 'P.55', manufacturerName: '田中食品株式会社', accountName: '株式会社テスト産業', rfqType: '見積依頼', requestDate: '2026-02-20', costPrice: '22000', sampleQty: '1', arrivalDate: '2026-04-10', costNotes: '色指定あり（グレー）', deliveryNotes: '4/15までに納品', adoptionType: '採用予定', contactDate: '2026-02-22' }, createdAt: '2026-02-20T09:00:00Z', updatedAt: '2026-03-06T10:00:00Z' }
    ],
    rivals: [{ id: 1, rival: 'オフィス用品C社', note: '同型品で安価' }],
    notes: [{ id: 1, text: '色指定を忘れずに', rowId: 1, fieldKey: 'costNotes' }],
    processHistory: [{ step: 1, userName: '加藤 誠', completedAt: '2026-02-20T09:00:00Z' }, { step: 2, userName: '加藤 誠', completedAt: '2026-02-22T10:00:00Z' }, { step: 3, userName: '田中 花子', completedAt: '2026-03-01T09:00:00Z' }]
  },
  prop_005: {
    formRows: [
      { id: 1, data: { budgetQty: 10, itemGroup: 'IT機器', productCode: 'NPC-100', productName: 'ノートPC', sellingPrice: '180000', packQty: '1', listPrice: '200000', budgetPrice: 150000, catalogName: 'IT機器カタログ2026', catalogPage: 'P.10', manufacturerName: '関西テキスタイル株式会社', accountName: 'テクノロジー株式会社', rfqType: '見積依頼', requestDate: '2026-02-25', costPrice: '130000', sampleQty: '0', arrivalDate: '2026-04-15', costNotes: 'メモリ16GB、SSD512GB', deliveryNotes: '4/20までに納品', adoptionType: '採用', contactDate: '2026-02-27' }, createdAt: '2026-02-25T11:00:00Z', updatedAt: '2026-03-07T14:00:00Z' }
    ],
    rivals: [{ id: 1, rival: '', note: '' }], notes: [],
    processHistory: [{ step: 1, userName: '田中 花子', completedAt: '2026-02-25T11:00:00Z' }, { step: 2, userName: '田中 花子', completedAt: '2026-02-27T09:00:00Z' }, { step: 3, userName: '加藤 誠', completedAt: '2026-03-02T10:00:00Z' }, { step: 4, userName: '加藤 誠', completedAt: '2026-03-05T14:00:00Z' }]
  },
  prop_006: {
    formRows: [
      { id: 1, data: { budgetQty: 200, itemGroup: '食品', productCode: 'HK-100', productName: '北海道野菜詰め合わせ', sellingPrice: '3000', packQty: '1', listPrice: '3500', budgetPrice: 3000, catalogName: '北海道農産物カタログ', catalogPage: 'P.22', manufacturerName: '北海道農産物協同組合', accountName: 'グローバル機械工業', rfqType: '見積依頼', requestDate: '2026-02-28', costPrice: '2400', sampleQty: '3', arrivalDate: '2026-07-10', costNotes: '冷蔵配送必須', deliveryNotes: '7/15までに納品', adoptionType: '採用', contactDate: '2026-03-01' }, createdAt: '2026-02-28T10:00:00Z', updatedAt: '2026-03-04T10:00:00Z' }
    ],
    rivals: [{ id: 1, rival: 'ライバルB社', note: '果物セットで対抗' }],
    notes: [{ id: 1, text: '冷蔵配送の手配を確認する必要あり', rowId: 1, fieldKey: 'costNotes' }],
    processHistory: [{ step: 1, userName: '加藤 誠', completedAt: '2026-02-28T10:00:00Z' }, { step: 2, userName: '加藤 誠', completedAt: '2026-03-01T09:00:00Z' }, { step: 3, userName: '田中 花子', completedAt: '2026-03-02T10:00:00Z' }, { step: 4, userName: '田中 花子', completedAt: '2026-03-03T11:00:00Z' }, { step: 5, userName: '鈴木 一郎', completedAt: '2026-03-04T10:00:00Z' }]
  },
  prop_008: {
    formRows: [
      { id: 1, data: { budgetQty: 5, itemGroup: '設備', productCode: 'IP-200', productName: '工業用ポンプ', sellingPrice: '350000', packQty: '1', listPrice: '400000', budgetPrice: 300000, catalogName: '産業機器カタログ', catalogPage: 'P.30', manufacturerName: '北海道農産物協同組合', accountName: 'グローバル機械工業', rfqType: '見積依頼', requestDate: '2026-02-15', costPrice: '270000', sampleQty: '0', arrivalDate: '2026-04-25', costNotes: '設置工事込み', deliveryNotes: '5/1までに納品・設置', adoptionType: '採用', contactDate: '2026-02-18' }, createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-03-08T09:00:00Z' }
    ],
    rivals: [{ id: 1, rival: '設備D社', note: '国産で保証が長い' }],
    notes: [{ id: 1, text: '設置場所のスペース確認済み', rowId: 1, fieldKey: 'deliveryNotes' }],
    processHistory: [{ step: 1, userName: '加藤 誠', completedAt: '2026-02-15T10:00:00Z' }, { step: 2, userName: '加藤 誠', completedAt: '2026-02-18T09:00:00Z' }, { step: 3, userName: '田中 花子', completedAt: '2026-02-25T10:00:00Z' }, { step: 4, userName: '田中 花子', completedAt: '2026-03-01T14:00:00Z' }, { step: 5, userName: '鈴木 一郎', completedAt: '2026-03-06T10:00:00Z' }]
  }
}

export const mockProposals: Proposal[] = [
  { id: 'prop_001', code: 'P2026-001', customerId: 'cust_002', customerName: 'テクノロジー株式会社', title: '新入社員研修用品一式', description: '新年度新入社員研修に使用するノベルティ・研修用品', status: 'draft', lineItems: [{ id: 'li_001', manufacturerId: 'mfr_003', manufacturerName: '関西テキスタイル株式会社', productName: 'オリジナルトートバッグ', productCode: 'KT-050', quantity: 50, unit: '枚', unitPrice: 1200, total: 60000, deliveryDate: '2026-04-01' }], totalAmount: 60000, budget: 100000, deadline: '2026-03-20', requiredDeliveryDate: '2026-04-01', createdBy: 'user_002', tags: ['研修', 'ノベルティ'], approvalStatus: 'pending', createdAt: '2026-03-03T11:00:00Z', updatedAt: '2026-03-03T11:00:00Z' },
  { id: 'prop_002', code: 'P2026-002', customerId: 'cust_001', customerName: '株式会社テスト産業', title: '総代会組合員記念品提案', description: '年次総代会用の記念品として食品・菓子類の提案', status: 'submitted', lineItems: [{ id: 'li_002', manufacturerId: 'mfr_001', manufacturerName: '田中食品株式会社', productName: '高級羊羹セット', productCode: 'TK-001', quantity: 100, unit: '個', unitPrice: 1500, total: 150000, notes: '個別包装希望', deliveryDate: '2026-03-30' }, { id: 'li_003', manufacturerId: 'mfr_002', manufacturerName: '佐藤工芸品製作所', productName: '漆器箸セット', productCode: 'ST-010', quantity: 100, unit: '組', unitPrice: 2500, total: 250000, notes: '名入れサービス対応', deliveryDate: '2026-03-30' }], totalAmount: 400000, budget: 400000, deadline: '2026-03-10', requiredDeliveryDate: '2026-04-20', createdBy: 'user_001', assignedTo: 'user_001', tags: ['記念品', '総代会'], approvalStatus: 'pending', createdAt: '2026-03-01T09:00:00Z', updatedAt: '2026-03-05T14:30:00Z' },
  { id: 'prop_003', code: 'P2026-003', customerId: 'cust_003', customerName: 'グローバル機械工業', title: '工場向け安全用品セット', description: '工場作業員向けの安全用品一式', status: 'quoted', lineItems: [{ id: 'li_004', manufacturerId: 'mfr_001', manufacturerName: '田中食品株式会社', productName: '安全ヘルメット', productCode: 'SH-010', quantity: 30, unit: '個', unitPrice: 8000, total: 240000, deliveryDate: '2026-04-10' }], totalAmount: 240000, budget: 300000, deadline: '2026-04-05', requiredDeliveryDate: '2026-04-10', createdBy: 'user_001', assignedTo: 'user_001', tags: ['安全用品', '工場'], approvalStatus: 'pending', createdAt: '2026-02-25T10:00:00Z', updatedAt: '2026-03-05T11:00:00Z' },
  { id: 'prop_004', code: 'P2026-004', customerId: 'cust_001', customerName: '株式会社テスト産業', title: '事務用品提案 - オフィスチェア', description: '事務用品の仕入れ値段を決定中', status: 'pricing', lineItems: [{ id: 'li_005', manufacturerId: 'mfr_001', manufacturerName: '田中食品株式会社', productName: 'オフィスチェア', productCode: 'OC-001', quantity: 20, unit: '脚', unitPrice: 25000, total: 500000, deliveryDate: '2026-04-15' }], totalAmount: 500000, budget: 550000, deadline: '2026-04-01', requiredDeliveryDate: '2026-04-15', createdBy: 'user_001', assignedTo: 'user_001', tags: ['事務用品'], approvalStatus: 'pending', createdAt: '2026-02-20T09:00:00Z', updatedAt: '2026-03-06T10:00:00Z' },
  { id: 'prop_005', code: 'P2026-005', customerId: 'cust_002', customerName: 'テクノロジー株式会社', title: 'IT機器提案 - ノートPC一括購入', description: '承認依頼中のIT機器提案', status: 'pending_approval', lineItems: [{ id: 'li_006', manufacturerId: 'mfr_003', manufacturerName: '関西テキスタイル株式会社', productName: 'ノートPC', productCode: 'NPC-100', quantity: 10, unit: '台', unitPrice: 150000, total: 1500000, deliveryDate: '2026-04-20' }], totalAmount: 1500000, budget: 1600000, deadline: '2026-04-10', requiredDeliveryDate: '2026-04-20', createdBy: 'user_002', assignedTo: 'user_002', tags: ['IT機器'], approvalStatus: 'pending', createdAt: '2026-02-25T11:00:00Z', updatedAt: '2026-03-07T14:00:00Z' },
  { id: 'prop_006', code: 'P2026-006', customerId: 'cust_003', customerName: 'グローバル機械工業', title: '夏季社員向けギフト提案', description: '夏のお中元・社員向けギフトセット', status: 'approved', lineItems: [{ id: 'li_007', manufacturerId: 'mfr_004', manufacturerName: '北海道農産物協同組合', productName: '北海道野菜詰め合わせ', productCode: 'HK-100', quantity: 200, unit: '箱', unitPrice: 3000, total: 600000, deliveryDate: '2026-07-15' }], totalAmount: 600000, budget: 600000, deadline: '2026-06-01', requiredDeliveryDate: '2026-07-15', createdBy: 'user_001', assignedTo: 'user_003', tags: ['お中元', 'ギフト'], approvalStatus: 'approved', approvedBy: 'admin_001', approvalDate: '2026-03-04T10:00:00Z', createdAt: '2026-02-28T10:00:00Z', updatedAt: '2026-03-04T10:00:00Z' },
  { id: 'prop_007', code: 'P2026-007', customerId: 'cust_001', customerName: '株式会社テスト産業', title: '社内イベント用カタログギフト', description: '却下された社内イベント提案', status: 'rejected', lineItems: [{ id: 'li_008', manufacturerId: 'mfr_002', manufacturerName: '佐藤工芸品製作所', productName: 'カタログギフト', productCode: 'CG-030', quantity: 50, unit: '冊', unitPrice: 5000, total: 250000, deliveryDate: '2026-05-10' }], totalAmount: 250000, budget: 200000, deadline: '2026-05-01', requiredDeliveryDate: '2026-05-10', createdBy: 'user_001', tags: ['イベント', 'ギフト'], approvalStatus: 'rejected', createdAt: '2026-02-20T09:00:00Z', updatedAt: '2026-03-05T16:00:00Z' },
  { id: 'prop_008', code: 'P2026-008', customerId: 'cust_003', customerName: 'グローバル機械工業', title: '設備提案 - 工業用ポンプ', description: '顧客と最終確認中の設備提案', status: 'confirming', lineItems: [{ id: 'li_009', manufacturerId: 'mfr_004', manufacturerName: '北海道農産物協同組合', productName: '工業用ポンプ', productCode: 'IP-200', quantity: 5, unit: '台', unitPrice: 300000, total: 1500000, deliveryDate: '2026-05-01' }], totalAmount: 1500000, budget: 1500000, deadline: '2026-04-15', requiredDeliveryDate: '2026-05-01', createdBy: 'user_001', assignedTo: 'user_003', tags: ['設備'], approvalStatus: 'approved', approvedBy: 'admin_001', approvalDate: '2026-03-06T10:00:00Z', createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-03-08T09:00:00Z' },
  { id: 'prop_009', code: 'P2026-009', customerId: 'cust_002', customerName: 'テクノロジー株式会社', title: '年末記念品セット納品完了', description: '顧客確認済み・完了した年末記念品', status: 'completed', lineItems: [{ id: 'li_010', manufacturerId: 'mfr_001', manufacturerName: '田中食品株式会社', productName: '高級茶葉セット', productCode: 'TC-005', quantity: 80, unit: '箱', unitPrice: 2000, total: 160000, deliveryDate: '2025-12-20' }], totalAmount: 160000, budget: 200000, deadline: '2025-12-15', requiredDeliveryDate: '2025-12-20', createdBy: 'user_002', assignedTo: 'user_002', tags: ['年末', '記念品'], approvalStatus: 'approved', approvedBy: 'admin_001', approvalDate: '2025-12-01T10:00:00Z', createdAt: '2025-11-15T10:00:00Z', updatedAt: '2025-12-22T09:00:00Z' },
  { id: 'prop_010', code: 'P2026-010', customerId: 'cust_001', customerName: '株式会社テスト産業', title: '旧年度ノベルティ提案（保管中）', description: 'アーカイブ済みの旧年度提案', status: 'archived', lineItems: [{ id: 'li_011', manufacturerId: 'mfr_003', manufacturerName: '関西テキスタイル株式会社', productName: 'エコバッグ', productCode: 'EB-020', quantity: 100, unit: '枚', unitPrice: 800, total: 80000, deliveryDate: '2025-09-01' }], totalAmount: 80000, budget: 100000, deadline: '2025-08-25', requiredDeliveryDate: '2025-09-01', createdBy: 'user_001', tags: ['ノベルティ'], approvalStatus: 'approved', createdAt: '2025-07-01T10:00:00Z', updatedAt: '2025-09-10T10:00:00Z' }
]

// Pre-populate form data for proposals that don't have explicit form data
for (const p of mockProposals) {
  if (!mockProposalFormData[p.id]) {
    const statusStepMap: Record<string, number> = { draft: 1, submitted: 2, quoted: 3, pricing: 4, pending_approval: 5, approved: 5, completed: 6, confirming: 6, rejected: 5, archived: 6 }
    const currentStepNum = statusStepMap[p.status] || 1
    const history: ProcessHistoryEntry[] = []
    for (let s = 1; s < currentStepNum; s++) {
      history.push({ step: s, userName: '加藤 誠', completedAt: '2026-03-01T09:00:00Z' })
    }
    mockProposalFormData[p.id] = {
      formRows: [{ id: 1, data: { ...createEmptyRowData(), budgetQty: 50, itemGroup: '食品', productCode: `GEN-${p.id.replace('prop_', '')}`, productName: `${p.title}商品`, sellingPrice: '1500', packQty: '1', listPrice: '1800', budgetPrice: 1500, catalogName: 'サンプルカタログ', catalogPage: 'P.1', manufacturerName: 'サンプルメーカー', accountName: p.customerName, rfqType: '見積依頼', requestDate: '2026-03-01', costPrice: '1200', sampleQty: '1' }, createdAt: p.createdAt, updatedAt: p.updatedAt }],
      rivals: [{ id: 1, rival: '', note: '' }],
      notes: [],
      processHistory: history
    }
  }
}

// ============================================================================
// TAGS
// ============================================================================

export const mockTags: Tag[] = [
  { id: 'tag_001', name: '新規訪問', category: 'activity', color: 'primary', usageCount: 12, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_002', name: 'フォローアップ', category: 'activity', color: 'info', usageCount: 8, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_003', name: '定期訪問', category: 'activity', color: 'neutral', usageCount: 5, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_004', name: 'クレーム', category: 'activity', color: 'error', usageCount: 2, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_005', name: '記念品', category: 'proposal', color: 'success', usageCount: 15, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_006', name: 'ノベルティ', category: 'proposal', color: 'warning', usageCount: 10, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_007', name: 'ギフト', category: 'proposal', color: 'primary', usageCount: 7, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_008', name: '防災', category: 'proposal', color: 'error', usageCount: 3, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_009', name: '食品', category: 'manufacturer', color: 'success', usageCount: 20, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_010', name: '工芸品', category: 'manufacturer', color: 'info', usageCount: 6, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_011', name: 'VIP', category: 'customer', color: 'warning', usageCount: 4, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_012', name: '農協', category: 'customer', color: 'success', usageCount: 8, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_013', name: '大口', category: 'customer', color: 'primary', usageCount: 6, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_014', name: '緊急対応', category: 'procurement', color: 'error', usageCount: 3, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'tag_015', name: '長期取引', category: 'procurement', color: 'neutral', usageCount: 11, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' }
]

// ============================================================================
// DAILY REPORT
// ============================================================================

export function generateDailyReport(date: string, groupBy: 'salesperson' | 'customer'): DailyReport {
  const entries: DailyReportEntry[] = [
    { activityId: 'act_001', activityCode: 'SA2026-001', customerName: '株式会社テスト産業', assignedToName: '加藤 誠', type: 'visit', title: '総代会記念品ヒアリング', description: '予算400万円、4000個の見込み。食品・菓子系を中心に提案希望。', activityDate: date },
    { activityId: 'act_003', activityCode: 'SA2026-003', customerName: 'グローバル機械工業', assignedToName: '加藤 誠', type: 'visit', title: '夏季ギフト打ち合わせ', description: 'お中元期間の社員向けギフト提案。カタログギフト中心で検討中。', activityDate: date },
    { activityId: 'act_004', activityCode: 'SA2026-004', customerName: '株式会社テスト産業', assignedToName: '加藤 誠', type: 'email', title: 'サンプル送付の連絡', description: '記念品候補のサンプル3点を送付した旨をメールで連絡。', activityDate: date },
    { activityId: 'act_002', activityCode: 'SA2026-002', customerName: 'テクノロジー株式会社', assignedToName: '鈴木 花子', type: 'phone', title: '新入社員研修用品の確認電話', description: '研修用品のニーズを電話でヒアリング。トートバッグ50枚程度。', activityDate: date },
    { activityId: 'act_005', activityCode: 'SA2026-005', customerName: '中部電力グループ', assignedToName: '鈴木 花子', type: 'meeting', title: '防災用品提案ミーティング', description: '防災グッズのまとめ発注について提案予定。', activityDate: date }
  ]

  const groupKey = groupBy === 'salesperson' ? 'assignedToName' : 'customerName'
  const grouped = new Map<string, DailyReportEntry[]>()
  for (const e of entries) {
    const key = e[groupKey]
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(e)
  }

  return {
    date,
    groupBy,
    groups: Array.from(grouped.entries()).map(([key, groupEntries]) => ({ key, label: key, entries: groupEntries }))
  }
}

// ============================================================================
// LEGACY: MAILS, MEMBERS, NOTIFICATIONS
// ============================================================================

export const mockMails: Mail[] = [
  { id: 1, from: { id: '1', name: 'Alex Smith', email: 'alex.smith@example.com', role: 'salesperson', status: 'active', createdAt: '', updatedAt: '', avatar: 'https://i.pravatar.cc/128?u=1' } as any, subject: 'Meeting Schedule: Q1 Marketing Strategy Review', body: 'Dear Team,\n\nJust a quick reminder about our Q1 Marketing Strategy meeting scheduled for tomorrow at 10 AM EST.\n\nBest regards,\nAlex Smith', date: new Date().toISOString() },
  { id: 2, unread: true, from: { id: '2', name: 'Jordan Brown', email: 'jordan.brown@example.com', role: 'salesperson', status: 'active', createdAt: '', updatedAt: '', avatar: 'https://i.pravatar.cc/128?u=2' } as any, subject: 'RE: Project Phoenix - Sprint 3 Update', body: 'Hi team,\n\nQuick update on Sprint 3 deliverables.\n\nRegards,\nJordan', date: sub(new Date(), { minutes: 7 }).toISOString() },
  { id: 3, unread: true, from: { id: '3', name: 'Taylor Green', email: 'taylor.green@example.com', role: 'salesperson', status: 'active', createdAt: '', updatedAt: '', avatar: 'https://i.pravatar.cc/128?u=3' } as any, subject: 'Lunch Plans', body: 'Hi there!\n\nWould you like to grab lunch this Friday?\n\nBest,\nTaylor', date: sub(new Date(), { hours: 3 }).toISOString() }
]

export const mockMembers: Member[] = [
  { name: 'Anthony Fu', username: 'antfu', role: 'member', avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/antfu' } },
  { name: 'Baptiste Leproux', username: 'larbish', role: 'member', avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/larbish' } },
  { name: 'Benjamin Canac', username: 'benjamincanac', role: 'owner', avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/benjamincanac' } },
  { name: 'Daniel Roe', username: 'danielroe', role: 'member', avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/danielroe' } },
  { name: 'Hugo Richard', username: 'hugorcd', role: 'owner', avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/hugorcd' } },
  { name: 'Sébastien Chopin', username: 'Atinux', role: 'owner', avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/atinux' } }
]

export const mockNotifications: Notification[] = [
  { id: 1, unread: true, sender: { name: 'Jordan Brown', avatar: { src: 'https://i.pravatar.cc/128?u=2' } }, body: 'sent you a message', date: sub(new Date(), { minutes: 7 }).toISOString() },
  { id: 2, sender: { name: 'Lindsay Walton' }, body: 'subscribed to your email list', date: sub(new Date(), { hours: 1 }).toISOString() },
  { id: 3, unread: true, sender: { name: 'Taylor Green', avatar: { src: 'https://i.pravatar.cc/128?u=3' } }, body: 'sent you a message', date: sub(new Date(), { hours: 3 }).toISOString() },
  { id: 4, sender: { name: 'Courtney Henry', avatar: { src: 'https://i.pravatar.cc/128?u=4' } }, body: 'added you to a project', date: sub(new Date(), { hours: 3 }).toISOString() },
  { id: 5, sender: { name: 'Tom Cook', avatar: { src: 'https://i.pravatar.cc/128?u=5' } }, body: 'abandonned cart', date: sub(new Date(), { hours: 7 }).toISOString() }
]
