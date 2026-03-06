import type { Customer } from '~/types'

// Mock data - in production, this would be a database
const mockCustomers: Customer[] = [
  {
    id: 'cust_001',
    code: 'C001',
    name: '株式会社テスト産業',
    furigana: 'かぶしきがいしゃてすとさんぎょう',
    tags: ['検査機器', '精密機器', 'VIP'],
    contacts: [
      {
        id: 'cont_001',
        type: 'email',
        value: 'contact@test-sangyo.jp',
        name: '田中太郎',
        isPrimary: true
      },
      {
        id: 'cont_002',
        type: 'phone',
        value: '03-1234-5678',
        isPrimary: false
      }
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
      {
        id: 'cont_003',
        type: 'email',
        value: 'info@technology-co.jp',
        name: '鈴木花子',
        isPrimary: true
      },
      {
        id: 'cont_006',
        type: 'phone',
        value: '03-9876-5432',
        isPrimary: false
      }
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
      {
        id: 'cont_004',
        type: 'fax',
        value: '06-5678-9012',
        name: '佐藤次郎',
        isPrimary: true
      },
      {
        id: 'cont_005',
        type: 'email',
        value: 'procurement@global-machinery.jp',
        isPrimary: false
      }
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
      {
        id: 'cont_007',
        type: 'email',
        value: 'sales@seiko-denki.jp',
        name: '高橋一郎',
        isPrimary: true
      }
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
      {
        id: 'cont_008',
        type: 'email',
        value: 'info@hokkaido-food.jp',
        name: '伊藤美咲',
        isPrimary: true
      },
      {
        id: 'cont_009',
        type: 'fax',
        value: '011-234-5678',
        isPrimary: false
      }
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
      {
        id: 'cont_010',
        type: 'email',
        value: 'contact@osaka-chem.jp',
        name: '渡辺健太',
        isPrimary: true
      },
      {
        id: 'cont_011',
        type: 'phone',
        value: '06-1111-2222',
        isPrimary: false
      }
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
      {
        id: 'cont_012',
        type: 'email',
        value: 'parts@nagoya-auto.jp',
        name: '山田浩司',
        isPrimary: true
      }
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
      {
        id: 'cont_013',
        type: 'email',
        value: 'procurement@tokyo-medical.jp',
        name: '中村さゆり',
        isPrimary: true
      },
      {
        id: 'cont_014',
        type: 'phone',
        value: '03-5555-6666',
        isPrimary: false
      }
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
      {
        id: 'cont_015',
        type: 'email',
        value: 'sales@kyushu-plastic.jp',
        name: '小林誠',
        isPrimary: true
      }
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
      {
        id: 'cont_016',
        type: 'email',
        value: 'info@yokohama-ceramics.jp',
        name: '松本幸子',
        isPrimary: true
      },
      {
        id: 'cont_017',
        type: 'fax',
        value: '045-333-4444',
        isPrimary: false
      }
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
      {
        id: 'cont_018',
        type: 'email',
        value: 'contact@sapporo-metal.jp',
        name: '加藤雄一',
        isPrimary: true
      }
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
      {
        id: 'cont_019',
        type: 'email',
        value: 'info@fukuoka-electronics.jp',
        name: '村上真一',
        isPrimary: true
      },
      {
        id: 'cont_020',
        type: 'phone',
        value: '092-777-8888',
        isPrimary: false
      }
    ],
    assignedSalesStaff: ['user_001', 'user_002'],
    notes: 'IoT端末向け電子回路基板の主要サプライヤー。',
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2024-03-04T09:00:00Z'
  }
]

// Generate additional mock data
function generateMockCustomers() {
  const industries = ['機械', '電子', 'プラスチック', '化学', '食品', '金属', 'セラミック']
  const cities = ['東京', '大阪', '名古屋', '福岡', '札幌', '横浜', '仙台', '広島', '神戸', '京都']
  const suffixes = ['株式会社', '有限会社', '工業', '工業株式会社', '産業株式会社']
  const cityFurigana: Record<string, string> = {
    '東京': 'とうきょう', '大阪': 'おおさか', '名古屋': 'なごや', '福岡': 'ふくおか',
    '札幌': 'さっぽろ', '横浜': 'よこはま', '仙台': 'せんだい', '広島': 'ひろしま',
    '神戸': 'こうべ', '京都': 'きょうと'
  }
  const industryFurigana: Record<string, string> = {
    '機械': 'きかい', '電子': 'でんし', 'プラスチック': 'ぷらすちっく',
    '化学': 'かがく', '食品': 'しょくひん', '金属': 'きんぞく', 'セラミック': 'せらみっく'
  }
  const tagOptions = ['VIP', '新規', '要注意', '一般', '優良顧客']

  for (let i = 13; i <= 60; i++) {
    const id = `cust_${String(i).padStart(3, '0')}`
    const code = `C${String(i).padStart(3, '0')}`
    const industry = industries[(i - 1) % industries.length]
    const city = cities[(i - 1) % cities.length]
    const suffix = suffixes[i % suffixes.length]
    const extraTag = tagOptions[i % tagOptions.length]

    mockCustomers.push({
      id,
      code,
      name: `${city}${industry}${suffix}`,
      furigana: `${cityFurigana[city]}${industryFurigana[industry]}${suffix === '株式会社' ? 'かぶしきがいしゃ' : suffix === '有限会社' ? 'ゆうげんがいしゃ' : 'こうぎょう'}`,
      tags: [industry, extraTag],
      contacts: [
        {
          id: `cont_${String(i).padStart(3, '0')}`,
          type: 'email',
          value: `contact@company-${i}.jp`,
          name: `担当者${i}`,
          isPrimary: true
        }
      ],
      assignedSalesStaff: [`user_${(i % 4) + 1}`],
      createdAt: new Date(2024, (i % 12), 1 + (i % 28)).toISOString(),
      updatedAt: new Date(2024, (i % 12), 1 + (i % 28)).toISOString()
    })
  }
}

generateMockCustomers()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // GET /api/customers - List all customers
    const query = getQuery(event)
    const search = (query.search as string)?.toLowerCase() || ''
    const code = (query.code as string)?.toLowerCase() || ''
    const name = (query.name as string)?.toLowerCase() || ''
    const rawTags = query.tags
    const tagList: string[] = rawTags
      ? (Array.isArray(rawTags) ? rawTags : [rawTags]) as string[]
      : []
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 50

    let results = mockCustomers

    if (search) {
      results = results.filter(
        c => c.name.toLowerCase().includes(search) || c.code.toLowerCase().includes(search)
      )
    }
    if (code) {
      results = results.filter(
        c => c.code.toLowerCase().includes(code) || c.id.toLowerCase().includes(code)
      )
    }
    if (name) {
      results = results.filter(
        c => c.name.toLowerCase().includes(name) || (c.furigana ?? '').toLowerCase().includes(name)
      )
    }
    if (tagList.length > 0) {
      results = results.filter(c => tagList.some(t => c.tags.includes(t)))
    }

    const total = results.length
    const paginatedResults = results.slice((page - 1) * limit, page * limit)

    setResponseHeader(event, 'Content-Type', 'application/json')
    return {
      data: paginatedResults,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  } else if (method === 'POST') {
    // POST /api/customers - Create new customer
    const body = await readBody(event)

    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      code: body.code,
      name: body.name,
      furigana: body.furigana,
      tags: body.tags || [],
      contacts: body.contacts || [],
      assignedSalesStaff: body.assignedSalesStaff || [],
      notes: body.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockCustomers.push(newCustomer)

    setResponseStatus(event, 201)
    return newCustomer
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
