import type { ApprovalRequest } from '~/types'

// Shared mock data reference  - same as index.ts (in-memory map approach)
const mockApprovals: ApprovalRequest[] = [
  {
    id: 'apr-001',
    type: 'proposal',
    targetId: 'prop-001',
    targetCode: 'P2026-001',
    targetTitle: 'PCサーバー更新提案',
    requesterName: '加藤 太郎',
    requestedAt: '2026-03-01T09:00:00Z',
    status: 'pending',
    approverRole: 'manager',
    notes: '至急ご確認をお願いします'
  },
  {
    id: 'apr-002',
    type: 'proposal',
    targetId: 'prop-002',
    targetCode: 'P2026-002',
    targetTitle: 'ネットワーク機器リプレース',
    requesterName: '田中 花子',
    requestedAt: '2026-02-28T14:30:00Z',
    status: 'approved',
    approverRole: 'manager',
    approverName: '鈴木 部長',
    approvedAt: '2026-03-01T10:00:00Z',
    notes: '承認済み'
  },
  {
    id: 'apr-003',
    type: 'procurement',
    targetId: 'proc-001',
    targetCode: 'PO2026-001',
    targetTitle: 'サーバーラック購入',
    requesterName: '佐藤 次郎',
    requestedAt: '2026-02-27T11:00:00Z',
    status: 'rejected',
    approverRole: 'manager',
    approverName: '鈴木 部長',
    approvedAt: '2026-02-28T09:00:00Z',
    rejectionReason: '予算超過のため再検討が必要です',
    notes: '否認'
  },
  {
    id: 'apr-004',
    type: 'proposal',
    targetId: 'prop-003',
    targetCode: 'P2026-003',
    targetTitle: 'セキュリティソフトウェア導入',
    requesterName: '加藤 太郎',
    requestedAt: '2026-03-02T08:00:00Z',
    status: 'pending',
    approverRole: 'admin',
    notes: '来週の会議に向けて確認お願いします'
  },
  {
    id: 'apr-005',
    type: 'order',
    targetId: 'proc-003',
    targetCode: 'PO2026-003',
    targetTitle: 'クラウドストレージサービス契約',
    requesterName: '田中 花子',
    requestedAt: '2026-03-03T10:00:00Z',
    status: 'pending',
    approverRole: 'manager',
    notes: '継続利用のため早期承認を希望'
  },
  {
    id: 'apr-006',
    type: 'proposal',
    targetId: 'prop-004',
    targetCode: 'P2026-004',
    targetTitle: 'プリンター複合機更新',
    requesterName: '山田 三郎',
    requestedAt: '2026-02-25T13:00:00Z',
    status: 'approved',
    approverRole: 'manager',
    approverName: '鈴木 部長',
    approvedAt: '2026-02-26T15:00:00Z'
  },
  {
    id: 'apr-007',
    type: 'procurement',
    targetId: 'proc-007',
    targetCode: 'PO2026-007',
    targetTitle: 'UPS装置導入',
    requesterName: '佐藤 次郎',
    requestedAt: '2026-03-04T09:30:00Z',
    status: 'pending',
    approverRole: 'manager'
  }
]

const approvalOverrides = new Map<string, ApprovalRequest>()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'IDが必要です' })

  const method = event.method
  const base = mockApprovals.find(a => a.id === id)
  const approval = approvalOverrides.get(id) ?? base

  if (!approval) {
    throw createError({ statusCode: 404, message: '承認申請が見つかりません' })
  }

  if (method === 'GET') {
    return approval
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const now = new Date().toISOString()

    const updated: ApprovalRequest = {
      ...approval,
      ...(body.action === 'approve' ? {
        status: 'approved' as const,
        approverName: body.approverName ?? '承認者',
        approvedAt: now,
        notes: body.notes
      } : body.action === 'reject' ? {
        status: 'rejected' as const,
        approverName: body.approverName ?? '承認者',
        approvedAt: now,
        rejectionReason: body.rejectionReason ?? '否認理由が指定されていません'
      } : {})
    }

    approvalOverrides.set(id, updated)
    return updated
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})
