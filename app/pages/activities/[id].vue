<script setup lang="ts">
import type { SalesActivity, SalesActivityStatus, SalesActivityType } from '~/types'
import { useActivitiesStore } from '~/stores/activities'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useActivitiesStore()

const activityId = computed(() => route.params.id as string)
const isNew = computed(() => activityId.value === 'new')

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
    const data = await store.getActivityById(activityId.value)
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
      router.push(`/activities/${result.id}`)
    }
  } else {
    const result = await store.updateActivity(activityId.value, form)
    if (result) {
      activity.value = result
      toast.add({ title: '営業活動を更新しました', color: 'success' })
    }
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
  const result = await store.updateActivity(activityId.value, { comments } as any)
  if (result) {
    activity.value = result
    newComment.value = ''
    toast.add({ title: 'コメントを追加しました', color: 'success' })
  }
}
</script>

<template>
  <UDashboardPanel>
    <UDashboardNavbar :title="isNew ? '新規営業活動' : `営業活動: ${activity?.code || ''}`">
      <template #left>
        <UButton icon="i-lucide-arrow-left" variant="ghost" color="neutral" @click="router.push('/activities')" />
      </template>
      <template #right>
        <UBadge v-if="!isNew && activity" :color="statusColorMap[activity.status] as any" variant="subtle">
          {{ statusLabelMap[activity.status] }}
        </UBadge>
        <UButton label="保存" icon="i-lucide-save" color="primary" @click="handleSave" :loading="store.loading" />
      </template>
    </UDashboardNavbar>

    <div class="p-6 space-y-6 overflow-y-auto">
      <!-- Basic Info -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-sm">基本情報</h3>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-muted mb-1">タイトル</label>
            <UInput v-model="form.title" placeholder="活動タイトル" />
          </div>
          <div>
            <label class="block text-sm font-medium text-muted mb-1">顧客名</label>
            <UInput v-model="form.customerName" placeholder="顧客名" />
          </div>
          <div>
            <label class="block text-sm font-medium text-muted mb-1">種類</label>
            <USelectMenu v-model="form.type" :items="typeOptions" value-key="value" />
          </div>
          <div>
            <label class="block text-sm font-medium text-muted mb-1">ステータス</label>
            <USelectMenu v-model="form.status" :items="statusOptions" value-key="value" />
          </div>
          <div>
            <label class="block text-sm font-medium text-muted mb-1">活動日</label>
            <UInput v-model="form.activityDate" type="date" />
          </div>
          <div>
            <label class="block text-sm font-medium text-muted mb-1">担当者</label>
            <UInput v-model="form.assignedToName" placeholder="担当者名" />
          </div>
          <div>
            <label class="block text-sm font-medium text-muted mb-1">窓口担当</label>
            <UInput v-model="form.contactPerson" placeholder="顧客側の窓口" />
          </div>
          <div>
            <label class="block text-sm font-medium text-muted mb-1">意欲レベル</label>
            <USelectMenu v-model="form.interestLevel" :items="interestOptions" value-key="value" />
          </div>
          <div v-if="form.proposalCode" class="md:col-span-2">
            <label class="block text-sm font-medium text-muted mb-1">紐付け案件</label>
            <UButton variant="link" class="p-0" @click="router.push(`/proposals/${form.proposalId}`)">
              {{ form.proposalCode }}
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Description -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-sm">活動内容</h3>
        </template>
        <UTextarea v-model="form.description" placeholder="活動の詳細を入力..." :rows="4" />
      </UCard>

      <!-- Comments (only for existing activities) -->
      <UCard v-if="!isNew">
        <template #header>
          <h3 class="font-semibold text-sm">コメント</h3>
        </template>
        <div class="space-y-4">
          <div v-if="activity?.comments?.length" class="space-y-3">
            <div v-for="comment in activity.comments" :key="comment.id" class="flex gap-3 p-3 rounded-md bg-muted/50">
              <UAvatar :text="comment.userName.charAt(0)" size="sm" />
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ comment.userName }}</span>
                  <span class="text-xs text-muted">{{ new Date(comment.createdAt).toLocaleString('ja-JP') }}</span>
                </div>
                <p class="text-sm mt-1">{{ comment.content }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-muted text-center py-4">
            コメントはありません
          </div>
          <div class="flex gap-2">
            <UTextarea v-model="newComment" placeholder="コメントを追加..." :rows="2" class="flex-1" />
            <UButton icon="i-lucide-send" color="primary" @click="handleAddComment" :disabled="!newComment.trim()" class="self-end" />
          </div>
        </div>
      </UCard>
    </div>
  </UDashboardPanel>
</template>
