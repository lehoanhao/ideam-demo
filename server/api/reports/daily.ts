import type { DailyReportEntry } from '~/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const groupBy = (query.groupBy as string) || 'salesperson'

  const entries: DailyReportEntry[] = [
    {
      activityId: 'act_001',
      activityCode: 'SA2026-001',
      customerName: '株式会社テスト産業',
      assignedToName: '加藤 誠',
      type: 'visit',
      title: '総代会記念品ヒアリング',
      description: '予算400万円、4000個の見込み。食品・菓子系を中心に提案希望。',
      activityDate: '2026-03-05'
    },
    {
      activityId: 'act_003',
      activityCode: 'SA2026-003',
      customerName: 'グローバル機械工業',
      assignedToName: '加藤 誠',
      type: 'visit',
      title: '夏季ギフト打ち合わせ',
      description: 'お中元期間の社員向けギフト提案。カタログギフト中心で検討中。',
      activityDate: '2026-03-05'
    },
    {
      activityId: 'act_004',
      activityCode: 'SA2026-004',
      customerName: '株式会社テスト産業',
      assignedToName: '加藤 誠',
      type: 'email',
      title: 'サンプル送付の連絡',
      description: '記念品候補のサンプル3点を送付した旨をメールで連絡。',
      activityDate: '2026-03-05'
    },
    {
      activityId: 'act_002',
      activityCode: 'SA2026-002',
      customerName: 'テクノロジー株式会社',
      assignedToName: '鈴木 花子',
      type: 'phone',
      title: '新入社員研修用品の確認電話',
      description: '研修用品のニーズを電話でヒアリング。トートバッグ50枚程度。',
      activityDate: '2026-03-05'
    },
    {
      activityId: 'act_005',
      activityCode: 'SA2026-005',
      customerName: '中部電力グループ',
      assignedToName: '鈴木 花子',
      type: 'meeting',
      title: '防災用品提案ミーティング',
      description: '防災グッズのまとめ発注について提案予定。',
      activityDate: '2026-03-05'
    }
  ]

  if (groupBy === 'salesperson') {
    const grouped = new Map<string, DailyReportEntry[]>()
    for (const e of entries) {
      const key = e.assignedToName
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key)!.push(e)
    }
    return {
      date: query.date || new Date().toISOString().slice(0, 10),
      groupBy: 'salesperson',
      groups: Array.from(grouped.entries()).map(([key, entries]) => ({
        key,
        label: key,
        entries
      }))
    }
  }

  // group by customer
  const grouped = new Map<string, DailyReportEntry[]>()
  for (const e of entries) {
    const key = e.customerName
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(e)
  }
  return {
    date: query.date || new Date().toISOString().slice(0, 10),
    groupBy: 'customer',
    groups: Array.from(grouped.entries()).map(([key, entries]) => ({
      key,
      label: key,
      entries
    }))
  }
})
