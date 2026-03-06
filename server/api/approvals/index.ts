import type { ApprovalRequest } from '~/types'

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
  },
  {
    id: 'apr-008',
    type: 'proposal',
    targetId: 'prop-008',
    targetCode: 'P2026-008',
    targetTitle: 'ビデオ会議システム導入',
    requesterName: '加藤 太郎',
    requestedAt: '2026-02-20T10:00:00Z',
    status: 'approved',
    approverRole: 'admin',
    approverName: '管理者',
    approvedAt: '2026-02-21T09:00:00Z'
  }
]

// In-memory store for updates
const approvalOverrides = new Map<string, ApprovalRequest>()

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const query = getQuery(event)
    let results = mockApprovals.map(a => approvalOverrides.get(a.id) ?? a)

    if (query.status) {
      results = results.filter(a => a.status === query.status)
    }
    if (query.type) {
      results = results.filter(a => a.type === query.type)
    }
    if (query.search) {
      const q = (query.search as string).toLowerCase()
      results = results.filter(a =>
        a.targetCode?.toLowerCase().includes(q) ||
        a.targetTitle?.toLowerCase().includes(q) ||
        a.requesterName.toLowerCase().includes(q)
      )
    }

    return results
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const newApproval: ApprovalRequest = {
      id: `apr-${Date.now()}`,
      type: body.type ?? 'proposal',
      targetId: body.targetId,
      targetCode: body.targetCode,
      targetTitle: body.targetTitle,
      requesterName: body.requesterName ?? '加藤 太郎',
      requestedAt: new Date().toISOString(),
      status: 'pending',
      approverRole: body.approverRole ?? 'manager',
      notes: body.notes
    }
    mockApprovals.push(newApproval)
    return newApproval
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})
