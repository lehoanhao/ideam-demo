<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core'
import { sub } from 'date-fns'
import { useAuthStore } from '~/stores/auth'

interface AnnouncementItem {
  id: string
  category: 'proposal' | 'activity'
  type: string
  icon: string
  iconColor: string
  title: string
  description: string
  link: string
  date: string
  unread: boolean
}

const authStore = useAuthStore()
const open = defineModel<boolean>('open', { default: false })

const now = new Date()

const announcements = computed<AnnouncementItem[]>(() => {
  const userName = authStore.userDisplayName || '加藤 誠'
  return [
    // ── 案件 (Proposals) ──
    {
      id: 'ann_001',
      category: 'proposal',
      type: '仕入れ依頼中',
      icon: 'i-lucide-package-search',
      iconColor: 'text-blue-500',
      title: '仕入れ依頼中の案件があります',
      description: '「総代会組合員記念品提案」(P2026-002) の仕入れ依頼が進行中です。メーカーからの回答をお待ちください。',
      link: '/proposals/d/prop_002',
      date: sub(now, { minutes: 25 }).toISOString(),
      unread: true
    },
    {
      id: 'ann_002',
      category: 'proposal',
      type: '承認待ち',
      icon: 'i-lucide-clock',
      iconColor: 'text-amber-500',
      title: '承認待ちの案件: IT機器提案',
      description: '「IT機器提案 - ノートPC一括購入」(P2026-005) が承認待ちです。マネージャーの確認をお待ちください。',
      link: '/proposals/d/prop_005',
      date: sub(now, { hours: 1 }).toISOString(),
      unread: true
    },
    {
      id: 'ann_003',
      category: 'proposal',
      type: '承認済',
      icon: 'i-lucide-check-circle',
      iconColor: 'text-green-500',
      title: '案件が承認されました',
      description: '「夏季社員向けギフト提案」(P2026-006) が鈴木 一郎により承認されました。仕入れ手配を進めてください。',
      link: '/proposals/d/prop_006',
      date: sub(now, { hours: 3 }).toISOString(),
      unread: true
    },
    {
      id: 'ann_004',
      category: 'proposal',
      type: 'コメント',
      icon: 'i-lucide-message-square',
      iconColor: 'text-purple-500',
      title: '担当案件に新しいコメント',
      description: '田中 花子さんが「工場向け安全用品セット」(P2026-003) にコメントしました:「見積書の単価を確認お願いします」',
      link: '/proposals/d/prop_003',
      date: sub(now, { hours: 2 }).toISOString(),
      unread: true
    },
    {
      id: 'ann_005',
      category: 'proposal',
      type: 'コメント',
      icon: 'i-lucide-message-square',
      iconColor: 'text-purple-500',
      title: '案件コメントでメンションされました',
      description: `佐藤 次郎さんが「事務用品提案 - オフィスチェア」(P2026-004) で@${userName}をメンションしました:「納期の調整をお願いできますか？」`,
      link: '/proposals/d/prop_004',
      date: sub(now, { minutes: 45 }).toISOString(),
      unread: true
    },
    {
      id: 'ann_006',
      category: 'proposal',
      type: '確認中',
      icon: 'i-lucide-file-check',
      iconColor: 'text-teal-500',
      title: '顧客確認中の案件',
      description: '「設備提案 - 工業用ポンプ」(P2026-008) は現在顧客と最終確認中です。回答をお待ちください。',
      link: '/proposals/d/prop_008',
      date: sub(now, { hours: 5 }).toISOString(),
      unread: false
    },

    // ── 営業活動 (Activities) ──
    {
      id: 'ann_007',
      category: 'activity',
      type: '新規アサイン',
      icon: 'i-lucide-user-plus',
      iconColor: 'text-violet-500',
      title: '新しい営業活動がアサインされました',
      description: '「防災用品提案ミーティング」(SA2026-005) が田中 花子さんにアサインされました。3/10に中部電力グループを訪問予定です。',
      link: '/activities/d/act_005',
      date: sub(now, { minutes: 30 }).toISOString(),
      unread: true
    },
    {
      id: 'ann_008',
      category: 'activity',
      type: 'メンション',
      icon: 'i-lucide-at-sign',
      iconColor: 'text-rose-500',
      title: '営業活動のコメントでタグされました',
      description: `鈴木 花子さんが「総代会記念品ヒアリング」(SA2026-001) で@${userName}をタグしました:「サンプルの手配を進めます。カタログも一緒に送りましょうか？」`,
      link: '/activities/d/act_001',
      date: sub(now, { hours: 1, minutes: 30 }).toISOString(),
      unread: true
    },
    {
      id: 'ann_009',
      category: 'activity',
      type: '新規アサイン',
      icon: 'i-lucide-user-plus',
      iconColor: 'text-violet-500',
      title: '営業活動が新規登録されました',
      description: '「年度末挨拶訪問」(SA2026-006) が登録されました。3/15に東海農業協同組合を訪問予定です。',
      link: '/activities/d/act_006',
      date: sub(now, { hours: 4 }).toISOString(),
      unread: false
    },
    {
      id: 'ann_010',
      category: 'activity',
      type: '進行中',
      icon: 'i-lucide-activity',
      iconColor: 'text-orange-500',
      title: '営業活動が進行中です',
      description: '「夏季ギフト打ち合わせ」(SA2026-003) がグローバル機械工業で進行中です。提案資料を準備してください。',
      link: '/activities/d/act_003',
      date: sub(now, { hours: 6 }).toISOString(),
      unread: false
    }
  ]
})

const unreadCount = computed(() => announcements.value.filter(a => a.unread).length)

const selectedCategory = ref<'all' | 'proposal' | 'activity'>('all')

const filteredAnnouncements = computed(() => {
  if (selectedCategory.value === 'all') return announcements.value
  return announcements.value.filter(a => a.category === selectedCategory.value)
})

const proposalCount = computed(() => announcements.value.filter(a => a.category === 'proposal').length)
const activityCount = computed(() => announcements.value.filter(a => a.category === 'activity').length)

function getCategoryBadge(type: string) {
  const map: Record<string, { label: string, color: string }> = {
    仕入れ依頼中: { label: '仕入れ依頼中', color: 'blue' },
    承認待ち: { label: '承認待ち', color: 'amber' },
    承認済: { label: '承認済', color: 'green' },
    コメント: { label: 'コメント', color: 'purple' },
    確認中: { label: '確認中', color: 'teal' },
    新規アサイン: { label: '新規アサイン', color: 'violet' },
    メンション: { label: 'メンション', color: 'rose' },
    進行中: { label: '進行中', color: 'orange' }
  }
  return map[type] || { label: type, color: 'neutral' }
}

function handleClick(item: AnnouncementItem) {
  window.open(item.link, '_blank')
}
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{ content: 'sm:max-w-2xl' }"
  >
    <template #header>
      <div class="flex items-center gap-2 w-full">
        <UIcon name="i-lucide-bell-ring" class="text-xl text-primary" />
        <span class="font-semibold text-lg">お知らせ</span>
        <UBadge v-if="unreadCount > 0" color="error" size="sm">
          {{ unreadCount }}件未読
        </UBadge>
      </div>
    </template>

    <template #body>
      <!-- Category filter tabs -->
      <div class="flex gap-2 mb-4">
        <UButton
          size="sm"
          :variant="selectedCategory === 'all' ? 'solid' : 'ghost'"
          :color="selectedCategory === 'all' ? 'primary' : 'neutral'"
          @click="selectedCategory = 'all'"
        >
          すべて ({{ announcements.length }})
        </UButton>
        <UButton
          size="sm"
          :variant="selectedCategory === 'proposal' ? 'solid' : 'ghost'"
          :color="selectedCategory === 'proposal' ? 'primary' : 'neutral'"
          @click="selectedCategory = 'proposal'"
        >
          <UIcon name="i-streamline-plump-news-paper" class="mr-1" />
          案件 ({{ proposalCount }})
        </UButton>
        <UButton
          size="sm"
          :variant="selectedCategory === 'activity' ? 'solid' : 'ghost'"
          :color="selectedCategory === 'activity' ? 'primary' : 'neutral'"
          @click="selectedCategory = 'activity'"
        >
          <UIcon name="i-icon-park-outline-bank-card-one" class="mr-1" />
          営業活動 ({{ activityCount }})
        </UButton>
      </div>

      <!-- Announcements list -->
      <div class="space-y-1 max-h-[60vh] overflow-y-auto">
        <button
          v-for="item in filteredAnnouncements"
          :key="item.id"
          class="w-full text-left px-3 py-3 rounded-lg hover:bg-elevated/50 transition-colors flex items-start gap-3 cursor-pointer"
          :class="{ 'bg-primary-50 dark:bg-primary-950/20': item.unread }"
          @click="handleClick(item)"
        >
          <!-- Icon -->
          <div class="shrink-0 mt-0.5">
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center"
              :class="item.unread ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-muted'"
            >
              <UIcon :name="item.icon" :class="[item.iconColor, 'text-lg']" />
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span
                v-if="item.unread"
                class="w-2 h-2 rounded-full bg-error shrink-0"
              />
              <span class="font-medium text-sm text-highlighted truncate">
                {{ item.title }}
              </span>
            </div>
            <p class="text-xs text-dimmed line-clamp-2 mb-1">
              {{ item.description }}
            </p>
            <div class="flex items-center gap-2">
              <UBadge
                :color="getCategoryBadge(item.type).color as any"
                variant="subtle"
                size="xs"
              >
                {{ getCategoryBadge(item.type).label }}
              </UBadge>
              <time
                :datetime="item.date"
                class="text-muted text-xs"
                v-text="formatTimeAgo(new Date(item.date))"
              />
            </div>
          </div>

          <!-- Arrow -->
          <div class="shrink-0 mt-2">
            <UIcon name="i-lucide-external-link" class="text-muted text-sm" />
          </div>
        </button>

        <div
          v-if="filteredAnnouncements.length === 0"
          class="text-center py-8 text-dimmed"
        >
          お知らせはありません
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <UButton
          color="neutral"
          variant="ghost"
          @click="open = false"
        >
          閉じる
        </UButton>
      </div>
    </template>
  </UModal>
</template>
