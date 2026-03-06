import type { HistoricalRecord } from '~/types'

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

function generateRecords(): HistoricalRecord[] {
  const records: HistoricalRecord[] = []
  let idCounter = 1

  for (let year = 2024; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      const custIdx = (idCounter) % customers.length
      const prodIdx = (idCounter + month) % products.length
      const cust = customers[custIdx]
      const prod = products[prodIdx]
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
        customerId: cust.id,
        customerName: cust.name,
        customerCode: cust.code,
        manufacturerId: prod.mfrId,
        manufacturerName: prod.mfr,
        productCode: prod.code,
        productName: prod.name,
        quantity: qty,
        unit: '個',
        unitPrice,
        totalAmount,
        orderDate,
        deliveryDate: delivDate,
        completionDate: delivDate,
        profit,
        profitMargin: Math.round((profit / totalAmount) * 100),
        tags: [],
        createdAt: `${year}-${String(month).padStart(2, '0')}-01T09:00:00Z`
      })
      idCounter++
    }
  }
  return records
}

const allRecords = generateRecords()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let results = [...allRecords]

  if (query.search) {
    const q = String(query.search).toLowerCase()
    results = results.filter(r =>
      r.customerName.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q) ||
      r.proposalCode.toLowerCase().includes(q)
    )
  }

  if (query.customerId) {
    results = results.filter(r => r.customerId === String(query.customerId))
  }

  if (query.dateFrom) {
    results = results.filter(r => r.orderDate >= String(query.dateFrom))
  }

  if (query.dateTo) {
    results = results.filter(r => r.orderDate <= String(query.dateTo))
  }

  const total = results.length
  const page = Number(query.page) || 1
  const pageSize = Number(query.pageSize) || 50
  const data = results.slice((page - 1) * pageSize, page * pageSize)

  return { data, total }
})
