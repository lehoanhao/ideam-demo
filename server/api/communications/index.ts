import type { CommunicationRecord } from '~/types'

const mockRecords: CommunicationRecord[] = [
  {
    id: 'comm_001',
    channel: 'fax',
    procurementId: 'proc_001',
    procurementCode: 'PR2026-001',
    recipientAddress: '052-123-4567',
    recipientName: '田中食品株式会社',
    status: 'delivered',
    sentAt: '2026-03-02T10:00:00Z',
    operatorId: 'user_003',
    operatorName: '山本 太郎',
    notes: '見積依頼テンプレート使用'
  },
  {
    id: 'comm_002',
    channel: 'email',
    procurementId: 'proc_001',
    procurementCode: 'PR2026-001',
    recipientAddress: 'info@sato-crafts.co.jp',
    recipientName: '佐藤工芸品製作所',
    subject: '【見積依頼】漆器箸セットについて',
    status: 'delivered',
    sentAt: '2026-03-02T10:15:00Z',
    operatorId: 'user_003',
    operatorName: '山本 太郎'
  },
  {
    id: 'comm_003',
    channel: 'fax',
    procurementId: 'proc_002',
    procurementCode: 'PR2026-002',
    recipientAddress: '03-9876-5432',
    recipientName: '関西テキスタイル株式会社',
    status: 'sent',
    sentAt: '2026-03-03T14:00:00Z',
    operatorId: 'user_003',
    operatorName: '山本 太郎'
  },
  {
    id: 'comm_004',
    channel: 'email',
    procurementId: 'proc_003',
    procurementCode: 'PR2026-003',
    recipientAddress: 'sales@tokai-gift.jp',
    recipientName: '東海ギフトセンター',
    subject: '【見積依頼】カタログギフトセット',
    status: 'delivered',
    sentAt: '2026-03-04T09:30:00Z',
    operatorId: 'user_003',
    operatorName: '山本 太郎'
  },
  {
    id: 'comm_005',
    channel: 'fax',
    procurementId: 'proc_003',
    procurementCode: 'PR2026-003',
    recipientAddress: '0566-78-9012',
    recipientName: '中京物産株式会社',
    status: 'failed',
    sentAt: '2026-03-04T09:45:00Z',
    operatorId: 'user_003',
    operatorName: '山本 太郎',
    notes: '番号不通のため再送必要'
  },
  {
    id: 'comm_006',
    channel: 'email',
    procurementId: 'proc_001',
    procurementCode: 'PR2026-001',
    recipientAddress: 'tanaka@tanaka-foods.co.jp',
    recipientName: '田中食品株式会社',
    subject: '【再見積依頼】高級羊羹セット 数量変更',
    status: 'pending',
    sentAt: '2026-03-05T08:00:00Z',
    operatorId: 'user_003',
    operatorName: '山本 太郎'
  }
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let filtered = [...mockRecords]

  if (query.channel) {
    filtered = filtered.filter(r => r.channel === query.channel)
  }

  return { data: filtered, total: filtered.length }
})
