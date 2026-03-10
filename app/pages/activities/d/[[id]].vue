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
const activeTab = ref('basic')

const tabs = [
  { label: '基本情報', value: 'basic', icon: 'i-heroicons-document-text' },
  { label: 'コメント', value: 'comments', icon: 'i-fe-timeline' }
]

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

const newComment = ref('')
const activity = ref<SalesActivity | null>(null)

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
  const result = await store.updateActivity(activityId.value!, { comments } as any)
  if (result) {
    activity.value = result
    newComment.value = ''
    toast.add({ title: 'コメントを追加しました', color: 'success' })
  }
}

const isDeleteModalOpen = ref(false)

const sidebarTitle = computed(() =>
  isNew.value
    ? '新規営業活動'
    : `営業活動: ${activity.value?.code || ''}`
)
</script>

<template>
  <div class="w-full flex justify-between h-full overflow-hidden bg-elevated/60">
    <!-- Main panel -->
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
          <UBadge v-if="!isNew && activity" :color="statusColorMap[activity.status] as any" variant="subtle">
            {{ statusLabelMap[activity.status] }}
          </UBadge>
          <UTooltip :text="showSidebar ? '情報を隠す' : '情報を表示'">
            <UButton
              :icon="showSidebar ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
              color="neutral"
              variant="ghost"
              @click="showSidebar = !showSidebar"
            />
          </UTooltip>
        </div>

        <div v-if="!isNew && store.loading" class="flex justify-center py-20">
          <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-muted" />
        </div>

        <div v-else class="max-w-3xl mx-auto px-4 pb-8">
          <!-- 基本情報 -->
          <UPageCard title="基本情報" variant="subtle" class="mb-4">
            <UFormField
              label="タイトル"
              description="営業活動のタイトルを入力してください。"
              required
              class="gap-1 w-full"
            >
              <UInput v-model="form.title" class="w-full" placeholder="活動タイトル" />
            </UFormField>
            <USeparator />
            <UFormField
              label="顧客名"
              description="対象の顧客名を入力してください。"
              class="gap-1"
            >
              <UInput v-model="form.customerName" class="w-full" placeholder="顧客名" />
            </UFormField>
            <USeparator />
            <UFormField
              label="種類"
              description="営業活動の種類を選択してください。"
              class="gap-1"
            >
              <USelectMenu v-model="form.type" :items="typeOptions" value-key="value" />
            </UFormField>
            <USeparator />
            <UFormField
              label="ステータス"
              description="現在のステータスを選択してください。"
              class="gap-1"
            >
              <USelectMenu v-model="form.status" :items="statusOptions" value-key="value" />
            </UFormField>
            <USeparator />
            <UFormField
              label="活動日"
              description="営業活動の実施日を入力してください。"
              class="gap-1"
            >
              <UInput v-model="form.activityDate" class="w-full" type="date" />
            </UFormField>
            <USeparator />
            <UFormField
              label="担当者"
              description="営業担当者名を入力してください。"
              class="gap-1"
            >
              <UInput v-model="form.assignedToName" class="w-full" placeholder="担当者名" />
            </UFormField>
            <USeparator />
            <UFormField
              label="窓口担当"
              description="顧客側の窓口担当者を入力してください。"
              class="gap-1"
            >
              <UInput v-model="form.contactPerson" class="w-full" placeholder="顧客側の窓口" />
            </UFormField>
            <USeparator />
            <UFormField
              label="意欲レベル"
              description="顧客の意欲レベルを選択してください。"
              class="gap-1"
            >
              <USelectMenu v-model="form.interestLevel" :items="interestOptions" value-key="value" />
            </UFormField>
            <template v-if="form.proposalCode">
              <USeparator />
              <UFormField
                label="紐付け案件"
                description="関連する提案案件です。"
                class="gap-1"
              >
                <UButton variant="link" class="p-0" @click="router.push(`/proposals/d/${form.proposalId}`)">
                  {{ form.proposalCode }}
                </UButton>
              </UFormField>
            </template>
          </UPageCard>

          <!-- 活動内容 -->
          <UPageCard title="活動内容" variant="subtle" class="mb-4">
            <UFormField
              label="活動内容"
              description="営業活動の詳細を入力してください。"
              class="gap-1"
              :ui="{ container: 'w-full' }"
            >
              <UTextarea
                v-model="form.description"
                placeholder="活動の詳細を入力..."
                :rows="4"
                autoresize
                class="w-full"
              />
            </UFormField>
          </UPageCard>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div
      :class="showSidebar ? 'w-96 border-l border-default' : 'w-0'"
      class="shrink-0 flex flex-col bg-white dark:bg-neutral-800 overflow-hidden transition-all duration-300 ease-in-out"
    >
      <div class="border-b border-default px-4 py-2 space-y-2">
        <h2 class="text-sm font-semibold">
          {{ sidebarTitle }}
        </h2>
        <p v-if="activity?.updatedAt" class="text-xs text-muted">
          更新: {{ new Date(activity.updatedAt).toLocaleString('ja-JP') }}
        </p>
        <div class="flex gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="flex items-center gap-1 px-2 py-1.5 text-xs font-medium border-b-2 transition-colors"
            :class="
              activeTab === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground'
            "
            @click="activeTab = tab.value"
          >
            <UIcon :name="tab.icon" class="size-3.5" />
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-auto p-4">
        <!-- 基本情報 tab -->
        <div v-if="activeTab === 'basic'" class="space-y-4">
          <template v-if="activity && !isNew">
            <div class="space-y-3">
              <div>
                <p class="text-xs text-muted">
                  コード
                </p>
                <p class="text-sm font-medium">
                  {{ activity.code }}
                </p>
              </div>
              <div>
                <p class="text-xs text-muted">
                  種類
                </p>
                <p class="text-sm">
                  {{ typeLabelMap[activity.type] }}
                </p>
              </div>
              <div>
                <p class="text-xs text-muted">
                  ステータス
                </p>
                <UBadge :color="statusColorMap[activity.status] as any" variant="subtle" size="sm">
                  {{ statusLabelMap[activity.status] }}
                </UBadge>
              </div>
              <div>
                <p class="text-xs text-muted">
                  顧客
                </p>
                <p class="text-sm">
                  {{ activity.customerName }}
                </p>
              </div>
              <div>
                <p class="text-xs text-muted">
                  担当者
                </p>
                <p class="text-sm">
                  {{ activity.assignedToName }}
                </p>
              </div>
              <div>
                <p class="text-xs text-muted">
                  活動日
                </p>
                <p class="text-sm">
                  {{ new Date(activity.activityDate).toLocaleDateString('ja-JP') }}
                </p>
              </div>
              <div v-if="activity.interestLevel">
                <p class="text-xs text-muted">
                  意欲レベル
                </p>
                <UBadge
                  :color="activity.interestLevel === 'high' ? 'success' : activity.interestLevel === 'medium' ? 'warning' : 'neutral'"
                  variant="subtle"
                  size="sm"
                >
                  {{ activity.interestLevel === 'high' ? '高' : activity.interestLevel === 'medium' ? '中' : '低' }}
                </UBadge>
              </div>
              <div v-if="activity.proposalCode">
                <p class="text-xs text-muted">
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
              <div>
                <p class="text-xs text-muted">
                  登録日
                </p>
                <p class="text-sm">
                  {{ new Date(activity.createdAt).toLocaleDateString('ja-JP') }}
                </p>
              </div>
            </div>
          </template>
          <p v-else class="text-sm text-muted">
            新規活動のため、基本情報はまだありません。
          </p>
        </div>

        <!-- コメント tab -->
        <div v-if="activeTab === 'comments'" class="space-y-4">
          <!-- New comment input -->
          <div class="space-y-2">
            <UTextarea
              v-model="newComment"
              :rows="2"
              placeholder="コメントを入力..."
              class="w-full"
            />
            <UButton
              label="コメントを追加"
              icon="i-lucide-send"
              size="xs"
              color="primary"
              block
              :disabled="!newComment.trim() || isNew"
              @click="handleAddComment"
            />
          </div>

          <USeparator />

          <!-- Comments list -->
          <div v-if="activity?.comments?.length" class="space-y-0">
            <div
              v-for="(comment, idx) in [...(activity.comments || [])].reverse()"
              :key="comment.id"
              class="flex gap-3 rounded-md p-1"
            >
              <div class="flex flex-col items-center">
                <UAvatar :text="comment.userName.charAt(0)" size="xs" />
                <div v-if="idx < (activity.comments?.length || 0) - 1" class="w-px flex-1 bg-default mt-1" />
              </div>
              <div class="flex-1 pb-3">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-medium">{{ comment.userName }}</span>
                  <span class="text-xs text-muted">{{ new Date(comment.createdAt).toLocaleString('ja-JP') }}</span>
                </div>
                <p class="text-sm mt-1">
                  {{ comment.content }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6 text-muted text-sm">
            コメントはまだありません
          </div>
        </div>
      </div>

      <!-- Footer actions -->
      <div class="border-t border-default px-4 py-2">
        <div class="flex flex-col gap-2">
          <UButton
            v-if="!isNew"
            label="削除"
            color="error"
            variant="outline"
            block
            trailing-icon="i-lucide-trash"
            @click="isDeleteModalOpen = true"
          />
          <UButton
            :label="isNew ? '作成する' : '保存'"
            color="primary"
            block
            trailing-icon="i-lucide-save"
            :loading="store.loading"
            @click="handleSave"
          />
        </div>
      </div>
    </div>

    <!-- 削除確認 -->
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
