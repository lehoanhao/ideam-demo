import type { Manufacturer } from '~/types'

const mockManufacturers: Manufacturer[] = [
  {
    id: 'mfr_001',
    code: 'M001',
    name: '田中食品株式会社',
    furigana: 'たなかしょくひんかぶしきがいしゃ',
    tags: ['食品', '菓子'],
    contactEmail: 'contact@tanaka-foods.jp',
    contactPhone: '03-1234-5678',
    faxNumber: '03-1234-5679',
    preferredContactMethod: 'email',
    productCategories: ['食品', '菓子', 'ドリンク'],
    notes: '定期的な取引あり。月次でカタログ提供。',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-03-01T14:00:00Z'
  },
  {
    id: 'mfr_002',
    code: 'M002',
    name: '佐藤工芸品製作所',
    furigana: 'さとうこうげいひんせいさくしょ',
    tags: ['工芸品', '雑貨'],
    contactEmail: 'info@sato-crafts.jp',
    contactPhone: '06-9876-5432',
    faxNumber: '06-9876-5433',
    preferredContactMethod: 'fax',
    productCategories: ['工芸品', '雑貨', 'ギフト'],
    notes: '',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-28T16:30:00Z'
  },
  {
    id: 'mfr_003',
    code: 'M003',
    name: '関西テキスタイル株式会社',
    furigana: 'かんさいてきすたいるかぶしきがいしゃ',
    tags: ['繊維', 'アパレル'],
    contactEmail: 'sales@kansai-textile.jp',
    contactPhone: '06-2222-3333',
    preferredContactMethod: 'email',
    productCategories: ['繊維', 'テキスタイル'],
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-03-04T09:15:00Z'
  },
  {
    id: 'mfr_004',
    code: 'M004',
    name: '北海道農産物協同組合',
    furigana: 'ほっかいどうのうさんぶつきょうどうくみあい',
    tags: ['農産物', '有機'],
    contactEmail: 'order@hokkaido-nosan.jp',
    faxNumber: '011-456-7890',
    contactPhone: '011-456-7800',
    preferredContactMethod: 'fax',
    productCategories: ['農産物', '野菜', '果物'],
    notes: '季節限定商品あり',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z'
  },
  {
    id: 'mfr_005',
    code: 'M005',
    name: '東洋プラスチック工業',
    furigana: 'とうようぷらすちっくこうぎょう',
    tags: ['プラスチック', '容器'],
    contactEmail: 'sales@toyo-plastic.jp',
    contactPhone: '03-5555-6666',
    preferredContactMethod: 'email',
    productCategories: ['プラスチック容器', '包装材'],
    createdAt: '2024-02-15T13:00:00Z',
    updatedAt: '2024-03-02T11:00:00Z'
  }
]

// Generate additional mock data
function generateAdditionalMfrs(): Manufacturer[] {
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

const allManufacturers = [...mockManufacturers, ...generateAdditionalMfrs()]

export default defineEventHandler(async (event) => {
  const method = event.method
  const query = getQuery(event)

  if (method === 'GET') {
    let results = [...allManufacturers]

    if (query.search) {
      const q = String(query.search).toLowerCase()
      results = results.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        (m.furigana?.toLowerCase().includes(q) ?? false)
      )
    }

    if (query.tags) {
      const tagList = String(query.tags).split(',')
      results = results.filter(m => tagList.some(t => m.tags.includes(t)))
    }

    const total = results.length
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 50
    const data = results.slice((page - 1) * pageSize, page * pageSize)

    return { data, total }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const newMfr: Manufacturer = {
      id: `mfr_${Date.now()}`,
      code: `M${String(allManufacturers.length + 1).padStart(3, '0')}`,
      name: body.name,
      furigana: body.furigana,
      tags: body.tags || [],
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      faxNumber: body.faxNumber,
      preferredContactMethod: body.preferredContactMethod || 'email',
      productCategories: body.productCategories || [],
      notes: body.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    allManufacturers.push(newMfr)
    return newMfr
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})
