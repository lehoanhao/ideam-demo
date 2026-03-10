<script setup lang="ts">
import type { SalesActivity, SalesActivityStatus, SalesActivityType } from '~/types'
import { useActivitiesStore } from '~/stores/activities'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useActivitiesStore()

const activityId = computed(() => {
  const id = route.params.id
  const value = Array.isArray(id) ? id.join('/') : id
  return value === 'new' ? null : value
})

const isNew = computed(() => !activityId.value)
const showSidebar = ref(true)
const isDeleteModalOpen = ref(false)
const imagePreview = ref<string | null>(null)

// ── Form state (for new activity) ──
const form = reactive({
  title: '',
  customerId: '',
  customerName: '',
  type: 'visit' as SalesActivityType,
  status: 'planned' as SalesActivityStatus,
  description: '',
  contactPerson: '',
  interestLevel: 'medium' as 'high' | 'medium' | 'low',
  activityDate: new Date().toISOString().slice(0, 10),
  assignedTo: 'user_001',
  assignedToName: '加藤 誠',
  tags: [] as string[],
  proposalId: '',
  proposalCode: ''
})

const activity = ref<SalesActivity | null>(null)

// ── Comment & mentions ──
const newComment = ref('')
const commentInputEl = ref<HTMLTextAreaElement | null>(null)
const showMentionPopup = ref(false)
const mentionSearch = ref('')

const mentionUsers = [
  { id: 'user_001', name: '加藤 誠' },
  { id: 'user_002', name: '鈴木 花子' },
  { id: 'user_003', name: '山本 太郎' },
  { id: 'user_004', name: '佐藤 次郎' },
  { id: 'user_005', name: '田中 四郎' }
]

const filteredMentionUsers = computed(() => {
  if (!mentionSearch.value) return mentionUsers
  return mentionUsers.filter(u => u.name.includes(mentionSearch.value))
})

// ── Options ──
const statusOptions = [
  { label: '予定', value: 'planned' },
  { label: '進行中', value: 'in_progress' },
  { label: '完了', value: 'completed' },
  { label: 'キャンセル', value: 'cancelled' }
]
const typeOptions = [
  { label: '訪問', value: 'visit' },
  { label: '電話', value: 'phone' },
  { label: 'メール', value: 'email' },
  { label: '会議', value: 'meeting' },
  { label: 'その他', value: 'other' }
]
const interestOptions = [
  { label: '高', value: 'high' },
  { label: '中', value: 'medium' },
  { label: '低', value: 'low' }
]

const statusColorMap: Record<SalesActivityStatus, string> = {
  planned: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'neutral'
}
const statusLabelMap: Record<SalesActivityStatus, string> = {
  planned: '予定',
  in_progress: '進行中',
  completed: '完了',
  cancelled: 'キャンセル'
}
const typeLabelMap: Record<SalesActivityType, string> = {
  visit: '訪問',
  phone: '電話',
  email: 'メール',
  meeting: '会議',
  other: 'その他'
}
const typeIconMap: Record<SalesActivityType, string> = {
  visit: 'i-lucide-footprints',
  phone: 'i-lucide-phone',
  email: 'i-lucide-mail',
  meeting: 'i-lucide-users',
  other: 'i-lucide-circle-dot'
}
const interestColorMap: Record<string, string> = {
  high: 'success',
  medium: 'warning',
  low: 'neutral'
}
const interestLabelMap: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低'
}

// ── Lifecycle ──
onMounted(async () => {
  if (!isNew.value) {
    const data = await store.getActivityById(activityId.value!)
    if (data) {
      activity.value = data
      Object.assign(form, {
        title: data.title,
        customerId: data.customerId,
        customerName: data.customerName,
        type: data.type,
        status: data.status,
        description: data.description || '',
        contactPerson: data.contactPerson || '',
        interestLevel: data.interestLevel || 'medium',
        activityDate: data.activityDate,
        assignedTo: data.assignedTo,
        assignedToName: data.assignedToName,
        tags: data.tags || [],
        proposalId: data.proposalId || '',
        proposalCode: data.proposalCode || ''
      })
    }
  }
})

// ── Actions ──
async function handleSave() {
  if (isNew.value) {
    const result = await store.createActivity(form)
    if (result) {
      toast.add({ title: '営業活動を作成しました', color: 'success' })
      router.push(`/activities/d/${result.id}`)
    }
  } else {
    const result = await store.updateActivity(activityId.value!, form)
    if (result) {
      activity.value = result
      toast.add({ title: '営業活動を更新しました', color: 'success' })
    }
  }
}

async function handleDelete() {
  if (!activityId.value) return
  const ok = await store.deleteActivity(activityId.value)
  if (ok) {
    toast.add({ title: '営業活動を削除しました', color: 'success' })
    router.push('/activities')
  }
}

async function handleAddComment() {
  if (!newComment.value.trim() || isNew.value) return
  const comments = [...(activity.value?.comments || []), {
    id: `c_${Date.now()}`,
    userId: 'user_001',
    userName: '加藤 誠',
    content: newComment.value,
    createdAt: new Date().toISOString()
  }]
  const result = await store.updateActivity(activityId.value!, { comments } as Partial<SalesActivity>)
  if (result) {
    activity.value = result
    newComment.value = ''
    toast.add({ title: 'コメントを追加しました', color: 'success' })
  }
}

// ── Mention helpers ──
function onCommentInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  const cursorPos = target.selectionStart || 0
  const textBeforeCursor = target.value.substring(0, cursorPos)
  const atMatch = textBeforeCursor.match(/@([^\s]*)$/)

  if (atMatch) {
    showMentionPopup.value = true
    mentionSearch.value = atMatch[1] || ''
  } else {
    showMentionPopup.value = false
    mentionSearch.value = ''
  }
}

function insertMention(user: { id: string, name: string }) {
  const textarea = commentInputEl.value
  if (!textarea) return

  const cursorPos = textarea.selectionStart || 0
  const textBeforeCursor = newComment.value.substring(0, cursorPos)
  const textAfterCursor = newComment.value.substring(cursorPos)
  const atMatch = textBeforeCursor.match(/@([^\s]*)$/)

  if (atMatch) {
    const beforeAt = textBeforeCursor.substring(0, atMatch.index)
    newComment.value = `${beforeAt}@${user.name} ${textAfterCursor}`
  }
  showMentionPopup.value = false
  nextTick(() => textarea.focus())
}

function onCommentKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey && !showMentionPopup.value) {
    e.preventDefault()
    handleAddComment()
  }
}

// ── Utilities ──
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatCommentContent(content: string): string {
  return content.replace(/@(\S+\s\S+)/g, '<span class="text-primary font-medium">@$1</span>')
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'たった今'
  if (minutes < 60) return `${minutes}分前`
  if (hours < 24) return `${hours}時間前`
  if (days < 7) return `${days}日前`
  return new Date(dateStr).toLocaleDateString('ja-JP')
}

const imageAttachments = computed(() =>
  activity.value?.attachments?.filter(a => a.type === 'image') || []
)
const fileAttachments = computed(() =>
  activity.value?.attachments?.filter(a => a.type !== 'image') || []
)
</script>

<template>
  <!-- ═══════════════ NEW ACTIVITY: FORM VIEW ═══════════════ -->
  <div v-if="isNew" class="w-full flex justify-between h-full overflow-hidden bg-elevated/60">
    <div class="flex-1 w-full flex flex-col min-w-0 overflow-auto">
      <div class="flex-1 overflow-auto">
        <div class="flex flex-row gap-2 px-2 py-3">
          <UButton
            icon="i-ep-back"
            color="neutral"
            variant="ghost"
            @click="navigateTo('/activities')"
          />
          <div class="flex-1" />
        </div>
        <div class="max-w-3xl mx-auto px-4 pb-8">
          <UPageCard title="基本情報" variant="subtle" class="mb-4">
            <UFormField label="タイトル" required class="gap-1 w-full">
              <UInput v-model="form.title" class="w-full" placeholder="活動タイトル" />
            </UFormField>
            <USeparator />
            <UFormField label="顧客名" class="gap-1">
              <UInput v-model="form.customerName" class="w-full" placeholder="顧客名" />
            </UFormField>
            <USeparator />
            <UFormField label="種類" class="gap-1">
              <USelectMenu v-model="form.type" :items="typeOptions" value-key="value" />
            </UFormField>
            <USeparator />
            <UFormField label="ステータス" class="gap-1">
              <USelectMenu v-model="form.status" :items="statusOptions" value-key="value" />
            </UFormField>
            <USeparator />
            <UFormField label="活動日" class="gap-1">
              <UInput v-model="form.activityDate" class="w-full" type="date" />
            </UFormField>
            <USeparator />
            <UFormField label="担当者" class="gap-1">
              <UInput v-model="form.assignedToName" class="w-full" placeholder="担当者名" />
            </UFormField>
            <USeparator />
            <UFormField label="窓口担当" class="gap-1">
              <UInput v-model="form.contactPerson" class="w-full" placeholder="顧客側の窓口" />
            </UFormField>
            <USeparator />
            <UFormField label="意欲レベル" class="gap-1">
              <USelectMenu v-model="form.interestLevel" :items="interestOptions" value-key="value" />
            </UFormField>
          </UPageCard>
          <UPageCard title="活動内容" variant="subtle" class="mb-4">
            <UFormField label="活動内容" class="gap-1" :ui="{ container: 'w-full' }">
              <UTextarea
                v-model="form.description"
                placeholder="活動の詳細を入力..."
                :rows="4"
                autoresize
                class="w-full"
              />
            </UFormField>
          </UPageCard>
          <div class="flex justify-end">
            <UButton
              label="作成する"
              color="primary"
              trailing-icon="i-lucide-save"
              :loading="store.loading"
              @click="handleSave"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════════ DETAIL VIEW: TICKET / BACKLOG STYLE ═══════════════ -->
  <div v-else class="w-full flex h-full overflow-hidden bg-elevated/50">
    <!-- Loading -->
    <div v-if="store.loading && !activity" class="flex-1 flex justify-center items-center">
      <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-muted" />
    </div>

    <template v-else-if="activity">
      <!-- Main content area -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Header -->
        <div class="flex items-center gap-2 px-4 py-2.5 border-b border-default bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
          <UButton
            icon="i-ep-back"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="navigateTo('/activities')"
          />
          <UBadge
            color="neutral"
            variant="outline"
            size="sm"
            class="font-mono"
          >
            {{ activity.code }}
          </UBadge>
          <UBadge :color="statusColorMap[activity.status] as any" variant="subtle" size="sm">
            {{ statusLabelMap[activity.status] }}
          </UBadge>
          <div class="flex-1" />
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="sm"
            @click="isDeleteModalOpen = true"
          />
          <UTooltip :text="showSidebar ? '詳細を隠す' : '詳細を表示'">
            <UButton
              :icon="showSidebar ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="showSidebar = !showSidebar"
            />
          </UTooltip>
        </div>

        <!-- Scrollable content -->
        <div class="flex-1 overflow-auto">
          <div class="max-w-3xl mx-auto px-6 py-6 space-y-6">
            <!-- Title -->
            <div>
              <h1 class="text-xl font-bold text-foreground leading-tight">
                {{ activity.title }}
              </h1>
              <div class="flex items-center gap-3 mt-2 text-sm text-muted">
                <span class="flex items-center gap-1">
                  <UIcon :name="typeIconMap[activity.type]" class="size-3.5" />
                  {{ typeLabelMap[activity.type] }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-calendar" class="size-3.5" />
                  {{ new Date(activity.activityDate).toLocaleDateString('ja-JP') }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-user" class="size-3.5" />
                  {{ activity.assignedToName }}
                </span>
                <UBadge
                  v-if="activity.interestLevel"
                  :color="interestColorMap[activity.interestLevel] as any"
                  variant="subtle"
                  size="xs"
                >
                  意欲: {{ interestLabelMap[activity.interestLevel] }}
                </UBadge>
              </div>
              <div v-if="activity.tags?.length" class="flex flex-wrap gap-1.5 mt-3">
                <UBadge
                  v-for="tag in activity.tags"
                  :key="tag"
                  color="neutral"
                  variant="subtle"
                  size="xs"
                >
                  {{ tag }}
                </UBadge>
              </div>
            </div>

            <!-- Description -->
            <div v-if="activity.description" class="space-y-2">
              <h3 class="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <UIcon name="i-lucide-file-text" class="size-4" />
                活動内容
              </h3>
              <div class="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap bg-white dark:bg-neutral-800 rounded-lg p-4 border border-default">
                {{ activity.description }}
              </div>
            </div>

            <!-- Image Attachments -->
            <div v-if="imageAttachments.length" class="space-y-2">
              <h3 class="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <UIcon name="i-lucide-image" class="size-4" />
                画像 ({{ imageAttachments.length }})
              </h3>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="img in imageAttachments"
                  :key="img.id"
                  class="group relative rounded-lg overflow-hidden border border-default bg-neutral-50 dark:bg-neutral-800 aspect-video cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  @click="imagePreview = img.url"
                >
                  <img
                    :src="img.url"
                    :alt="img.name"
                    class="w-full h-full object-cover"
                  >
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <UIcon name="i-lucide-expand" class="size-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div class="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/60 to-transparent p-2">
                    <p class="text-xs text-white truncate">
                      {{ img.name }}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <!-- File Attachments -->
            <div v-if="fileAttachments.length" class="space-y-2">
              <h3 class="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <UIcon name="i-lucide-paperclip" class="size-4" />
                添付ファイル ({{ fileAttachments.length }})
              </h3>
              <div class="space-y-1.5">
                <div
                  v-for="file in fileAttachments"
                  :key="file.id"
                  class="flex items-center gap-3 p-3 rounded-lg border border-default bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer group"
                >
                  <div class="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <UIcon
                      :name="file.name.endsWith('.pdf') ? 'i-lucide-file-text' : file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? 'i-lucide-file-spreadsheet' : 'i-lucide-file'"
                      class="size-4.5 text-primary"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {{ file.name }}
                    </p>
                    <p class="text-xs text-muted">
                      {{ formatFileSize(file.size) }} · {{ file.uploadedByName }} · {{ timeAgo(file.uploadedAt) }}
                    </p>
                  </div>
                  <UIcon name="i-lucide-download" class="size-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            <!-- Activity Timeline (Comments) -->
            <div class="space-y-2">
              <h3 class="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <UIcon name="i-lucide-message-circle" class="size-4" />
                アクティビティ ({{ activity.comments?.length || 0 }})
              </h3>
              <div v-if="activity.comments?.length" class="space-y-0">
                <div
                  v-for="(comment, idx) in activity.comments"
                  :key="comment.id"
                  class="flex gap-3 py-1"
                >
                  <div class="flex flex-col items-center">
                    <UAvatar :text="comment.userName.charAt(0)" size="sm" class="ring-2 ring-white dark:ring-neutral-900" />
                    <div v-if="idx < (activity.comments?.length || 0) - 1" class="w-px flex-1 bg-neutral-200 dark:bg-neutral-700 mt-1" />
                  </div>
                  <div class="flex-1 pb-4">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-semibold">{{ comment.userName }}</span>
                      <span class="text-xs text-muted">{{ timeAgo(comment.createdAt) }}</span>
                    </div>
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <p class="text-sm mt-1 leading-relaxed" v-html="formatCommentContent(comment.content)" />
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-muted text-sm">
                <UIcon name="i-lucide-message-circle" class="size-8 mx-auto mb-2 opacity-30" />
                <p>まだコメントはありません</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Fixed Comment Footer -->
        <div class="border-t border-default bg-white dark:bg-neutral-900 px-4 py-3">
          <div class="max-w-3xl mx-auto">
            <div class="relative">
              <div class="flex gap-2 items-end">
                <UAvatar text="加" size="sm" class="shrink-0 mb-0.5" />
                <div class="flex-1 relative">
                  <textarea
                    ref="commentInputEl"
                    v-model="newComment"
                    placeholder="コメントを追加...  @でメンション"
                    rows="1"
                    class="w-full rounded-lg border border-default bg-elevated/50 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted"
                    :style="{ minHeight: '38px', maxHeight: '120px', height: newComment.split('\n').length > 1 ? 'auto' : '38px' }"
                    @input="onCommentInput"
                    @keydown="onCommentKeydown"
                  />
                  <!-- Mention Popup -->
                  <div
                    v-if="showMentionPopup && filteredMentionUsers.length"
                    class="absolute bottom-full left-0 mb-1 w-56 bg-white dark:bg-neutral-800 border border-default rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    <div class="py-1">
                      <button
                        v-for="user in filteredMentionUsers"
                        :key="user.id"
                        class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-left"
                        @mousedown.prevent="insertMention(user)"
                      >
                        <UAvatar :text="user.name.charAt(0)" size="2xs" />
                        <span>{{ user.name }}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <UButton
                  icon="i-lucide-send"
                  color="primary"
                  size="sm"
                  :disabled="!newComment.trim()"
                  class="shrink-0 mb-0.5"
                  @click="handleAddComment"
                />
              </div>
              <div class="flex items-center gap-1 mt-1.5 ml-10">
                <span class="text-xs text-muted">Enter で送信 · Shift+Enter で改行</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar - Properties -->
      <div
        :class="showSidebar ? 'w-80 border-l border-default' : 'w-0'"
        class="shrink-0 flex flex-col bg-white dark:bg-neutral-800 overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div class="flex-1 overflow-auto">
          <div class="px-4 py-4 border-b border-default">
            <h2 class="text-xs font-semibold text-muted uppercase tracking-wider">
              詳細情報
            </h2>
          </div>

          <div class="px-4 py-3 space-y-4">
            <!-- ステータス -->
            <div class="space-y-1">
              <p class="text-xs font-medium text-muted">
                ステータス
              </p>
              <UBadge :color="statusColorMap[activity.status] as any" variant="subtle" size="sm">
                {{ statusLabelMap[activity.status] }}
              </UBadge>
            </div>

            <!-- 種類 -->
            <div class="space-y-1">
              <p class="text-xs font-medium text-muted">
                種類
              </p>
              <div class="flex items-center gap-1.5 text-sm">
                <UIcon :name="typeIconMap[activity.type]" class="size-4 text-muted" />
                {{ typeLabelMap[activity.type] }}
              </div>
            </div>

            <!-- 担当者 -->
            <div class="space-y-1">
              <p class="text-xs font-medium text-muted">
                担当者
              </p>
              <div class="flex items-center gap-2">
                <UAvatar :text="activity.assignedToName.charAt(0)" size="2xs" />
                <span class="text-sm">{{ activity.assignedToName }}</span>
              </div>
            </div>

            <!-- 顧客 -->
            <div class="space-y-1">
              <p class="text-xs font-medium text-muted">
                顧客
              </p>
              <p class="text-sm">
                {{ activity.customerName }}
              </p>
            </div>

            <!-- 窓口担当 -->
            <div v-if="activity.contactPerson" class="space-y-1">
              <p class="text-xs font-medium text-muted">
                窓口担当
              </p>
              <p class="text-sm">
                {{ activity.contactPerson }}
              </p>
            </div>

            <!-- 意欲レベル -->
            <div v-if="activity.interestLevel" class="space-y-1">
              <p class="text-xs font-medium text-muted">
                意欲レベル
              </p>
              <UBadge
                :color="interestColorMap[activity.interestLevel] as any"
                variant="subtle"
                size="sm"
              >
                {{ interestLabelMap[activity.interestLevel] }}
              </UBadge>
            </div>

            <!-- 活動日 -->
            <div class="space-y-1">
              <p class="text-xs font-medium text-muted">
                活動日
              </p>
              <p class="text-sm">
                {{ new Date(activity.activityDate).toLocaleDateString('ja-JP') }}
              </p>
            </div>

            <!-- 紐付け案件 -->
            <div v-if="activity.proposalCode" class="space-y-1">
              <p class="text-xs font-medium text-muted">
                紐付け案件
              </p>
              <UButton
                variant="link"
                size="sm"
                class="p-0"
                @click="router.push(`/proposals/d/${activity.proposalId}`)"
              >
                {{ activity.proposalCode }}
              </UButton>
            </div>

            <USeparator />

            <!-- タグ -->
            <div v-if="activity.tags?.length" class="space-y-1.5">
              <p class="text-xs font-medium text-muted">
                タグ
              </p>
              <div class="flex flex-wrap gap-1">
                <UBadge
                  v-for="tag in activity.tags"
                  :key="tag"
                  color="neutral"
                  variant="subtle"
                  size="xs"
                >
                  {{ tag }}
                </UBadge>
              </div>
            </div>

            <USeparator />

            <!-- 日付情報 -->
            <div class="space-y-1">
              <p class="text-xs font-medium text-muted">
                登録日
              </p>
              <p class="text-xs">
                {{ new Date(activity.createdAt).toLocaleString('ja-JP') }}
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-medium text-muted">
                最終更新
              </p>
              <p class="text-xs">
                {{ new Date(activity.updatedAt).toLocaleString('ja-JP') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="border-t border-default px-4 py-3 space-y-2">
          <UButton
            label="編集"
            color="primary"
            variant="outline"
            block
            size="sm"
            leading-icon="i-lucide-pencil"
            @click="handleSave"
          />
          <UButton
            label="削除"
            color="error"
            variant="ghost"
            block
            size="sm"
            leading-icon="i-lucide-trash-2"
            @click="isDeleteModalOpen = true"
          />
        </div>
      </div>
    </template>

    <!-- Image Preview Modal -->
    <UModal v-model:open="imagePreview as any" :ui="{ content: 'max-w-4xl' }">
      <template #content>
        <div class="relative">
          <img
            v-if="imagePreview"
            :src="imagePreview"
            class="w-full rounded-lg"
            alt="Preview"
          >
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="sm"
            class="absolute top-2 right-2"
            @click="imagePreview = null"
          />
        </div>
      </template>
    </UModal>

    <!-- Delete Modal -->
    <UModal v-model:open="isDeleteModalOpen">
      <template #header>
        <h3 class="text-base font-semibold">
          営業活動を削除
        </h3>
      </template>
      <template #body>
        <p class="text-sm text-muted">
          <strong>{{ activity?.title }}</strong> を削除します。この操作は取り消せません。
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="キャンセル"
            color="neutral"
            variant="outline"
            @click="isDeleteModalOpen = false"
          />
          <UButton label="削除する" color="error" @click="handleDelete" />
        </div>
      </template>
    </UModal>
  </div>
</template>
