<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import type { ProposalStatus } from '~/types'
import {
  useProposalStore,
  type ProcessHistoryEntry,
  FORM_ROW_FIELDS
} from '~/stores/proposals'
import { useManufacturerStore } from '~/stores/manufacturers'

const route = useRoute()
const toast = useToast()
const proposalStore = useProposalStore()
const manufacturerStore = useManufacturerStore()

interface ProcessStep {
  title: string
  titleInProgress: string
  titleCompleted: string
  icon: string
  status: ProposalStatus | null
}

const processSteps: ProcessStep[] = [
  {
    title: '新規作成',
    titleInProgress: '新規作成中',
    titleCompleted: '新規作成済',
    icon: 'i-mdi-form-textbox',
    status: 'draft'
  },
  {
    title: '仕入れ依頼',
    titleInProgress: '仕入れ依頼中',
    titleCompleted: '仕入れ依頼済',
    icon: 'i-mdi-cart',
    status: 'submitted'
  },
  {
    title: 'メーカー依頼',
    titleInProgress: 'メーカー依頼中',
    titleCompleted: 'メーカー依頼済',
    icon: 'i-bi-send',
    status: 'quoted'
  },
  {
    title: '仕入れ値段決定',
    titleInProgress: '仕入れ値段決定中',
    titleCompleted: '仕入れ値段決定済',
    icon: 'i-fluent-money-calculator-20-regular',
    status: 'pricing'
  },
  {
    title: '承認',
    titleInProgress: '承認中',
    titleCompleted: '承認済',
    icon: 'i-material-symbols-order-approve',
    status: 'pending_approval'
  },
  {
    title: '完了',
    titleInProgress: '顧客と確認中',
    titleCompleted: '完了',
    icon: 'i-nrk-media-media-complete',
    status: 'confirming'
  }
]

const statusToStep: Record<ProposalStatus, number> = {
  draft: 0,
  submitted: 1,
  quoted: 2,
  pricing: 3,
  pending_approval: 4,
  approved: 4,
  rejected: 5,
  confirming: 6,
  completed: 6,
  archived: 6
}

const proposalId = computed(() => {
  const id = route.params.id
  const value = Array.isArray(id) ? id.join('/') : id
  return value === 'new' ? null : value
})

const isEditing = computed(() => !!proposalId.value)
const currentStep = ref(0)

const currentStatus = computed<ProposalStatus | 'new'>(() => {
  if (!isEditing.value) return 'new'
  return (proposalStore.selectedProposal?.status as ProposalStatus) || 'draft'
})

const stepperItems = computed<StepperItem[]>(() => {
  return processSteps.map((step, index) => {
    const stepNum = index

    let title = step.title
    if (stepNum < currentStep.value) {
      title = step.titleCompleted
    } else if (stepNum === currentStep.value) {
      title = step.titleInProgress
    }

    return {
      title,
      icon: step.icon,
      value: stepNum
    } satisfies StepperItem
  })
})

const sidebarTitle = computed(() =>
  isEditing.value
    ? `案件編集: ${proposalStore.selectedProposal?.code || ''}`
    : '新規案件作成'
)

onMounted(async () => {
  if (!manufacturerStore.manufacturers.length) {
    await manufacturerStore.fetchManufacturers()
  }
  if (proposalId.value) {
    await proposalStore.loadProposalIntoForm(proposalId.value)
    if (proposalStore.selectedProposal) {
      currentStep.value
        = statusToStep[proposalStore.selectedProposal.status as ProposalStatus]
          || 0
    }
  } else {
    proposalStore.resetForm()
    currentStep.value = 0
  }
})

onBeforeUnmount(() => {
  if (!proposalId.value) {
    proposalStore.resetForm()
  }
})

// --- Confirm dialog state ---
const showConfirmDialog = ref(false)
const confirmTitle = ref('')
const confirmDescription = ref('')
const confirmAction = ref<() => void>(() => {})

function openConfirm(title: string, description: string, action: () => void) {
  confirmTitle.value = title
  confirmDescription.value = description
  confirmAction.value = action
  showConfirmDialog.value = true
}

function executeConfirm() {
  showConfirmDialog.value = false
  confirmAction.value()
}

// --- Manufacturer request modal ---
const showManufacturerModal = ref(false)

const selectedManufacturerNames = computed(() => {
  return proposalStore.formRows
    .map((r: { data: { manufacturerName: string } }) => r.data.manufacturerName)
    .filter(Boolean)
})

// --- Approval request modal ---
const showApprovalModal = ref(false)

const mockManagers = [
  {
    id: 'mgr_001',
    name: '山田 太郎',
    role: '社長',
    department: '経営',
    avatar: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/atinux'
  },
  {
    id: 'mgr_002',
    name: '鈴木 一郎',
    role: '部長',
    department: '営業部',
    avatar: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/danielroe'
  },
  {
    id: 'mgr_003',
    name: '佐藤 健',
    role: '課長',
    department: '仕入部',
    avatar: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/antfu'
  },
  {
    id: 'mgr_004',
    name: '高橋 美咲',
    role: '部長',
    department: '管理部',
    avatar: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/celinedumerc'
  }
]

const selectedApprovers = ref<string[]>([])

function toggleApprover(id: string) {
  const idx = selectedApprovers.value.indexOf(id)
  if (idx >= 0) selectedApprovers.value.splice(idx, 1)
  else selectedApprovers.value.push(id)
}

async function submitApprovalRequest() {
  try {
    if (proposalId.value) {
      await proposalStore.updateProposal(proposalId.value, {
        status: 'pending_approval',
        updatedAt: new Date().toISOString()
      })
    }
    showApprovalModal.value = false
    selectedApprovers.value = []
    toast.add({ title: '承認依頼を送信しました', color: 'success' })
    navigateTo('/proposals')
  } catch {
    toast.add({ title: '承認依頼に失敗しました', color: 'error' })
  }
}

// --- Comments ---
interface CommentField {
  rowId: number
  fieldKey: string
}

interface CommentEntry {
  id: number
  text: string
  userName: string
  userAvatar?: string
  createdAt: string
  fields: CommentField[]
}

const comments = ref<CommentEntry[]>([
  {
    id: 1,
    text: '原価の確認が必要です。メーカーに再確認してください。',
    userName: '鈴木 一郎',
    userAvatar: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/danielroe',
    createdAt: '2026-03-07T10:30:00Z',
    fields: []
  },
  {
    id: 2,
    text: '予算内に収まるよう調整しました。',
    userName: '加藤 誠',
    userAvatar: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/antfu',
    createdAt: '2026-03-07T14:00:00Z',
    fields: []
  }
])

let _nextCommentId = 3
const newCommentText = ref('')

function addComment() {
  if (!newCommentText.value.trim()) return
  comments.value.push({
    id: _nextCommentId++,
    text: newCommentText.value.trim(),
    userName: '加藤 誠',
    userAvatar: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/antfu',
    createdAt: new Date().toISOString(),
    fields: [...commentPickingFields.value]
  })
  newCommentText.value = ''
  commentPickingFields.value = []
}

// --- Primary button config ---
const primaryButtonConfig = computed(() => {
  switch (currentStatus.value) {
    case 'new':
    case 'draft':
      return {
        label: '仕入れ依頼する',
        icon: 'i-icons8-right-round',
        color: 'primary' as const
      }
    case 'submitted':
      return {
        label: 'メーカー依頼',
        icon: 'i-bi-send',
        color: 'primary' as const
      }
    // quoted
    case 'quoted':
      return {
        label: '仕入れ値段を決定',
        icon: 'i-fluent-money-calculator-20-regular',
        color: 'primary' as const
      }
    case 'pricing':
      return {
        label: '承認依頼',
        icon: 'i-material-symbols-order-approve',
        color: 'primary' as const
      }
    case 'pending_approval':
      return {
        label: '承認する',
        icon: 'i-lucide-check',
        color: 'success' as const
      }
    case 'confirming':
      return {
        label: '完了にする',
        icon: 'i-nrk-media-media-complete',
        color: 'success' as const
      }
    default:
      return {
        label: '仕入れ依頼する',
        icon: 'i-icons8-right-round',
        color: 'primary' as const
      }
  }
})

const secondaryButtonConfig = computed(() => {
  switch (currentStatus.value) {
    case 'new':
    case 'draft':
      return {
        label: '下書き保存',
        icon: 'i-la-firstdraft',
        color: 'neutral' as const
      }
    case 'submitted':
      return {
        label: '更新',
        icon: 'i-lucide-save',
        color: 'neutral' as const
      }
    case 'pricing':
      return {
        label: '更新',
        icon: 'i-lucide-save',
        color: 'neutral' as const
      }
    case 'pending_approval':
      return {
        label: '差し戻す',
        icon: 'i-lucide-undo-2',
        color: 'error' as const
      }
    case 'confirming':
      return {
        label: '更新',
        icon: 'i-lucide-save',
        color: 'neutral' as const
      }
    default:
      return {
        label: '下書き保存',
        icon: 'i-la-firstdraft',
        color: 'neutral' as const
      }
  }
})

function handlePrimaryClick() {
  switch (currentStatus.value) {
    case 'new':
    case 'draft':
      openConfirm(
        '仕入れ依頼の確認',
        'この提案を仕入れ依頼として提出しますか？',
        async () => {
          try {
            if (isEditing.value && proposalId.value) {
              await proposalStore.updateProposal(proposalId.value, {
                status: 'submitted',
                updatedAt: new Date().toISOString()
              })
            }
            toast.add({ title: '仕入れ依頼しました', color: 'success' })
            navigateTo('/proposals')
          } catch {
            toast.add({ title: '依頼に失敗しました', color: 'error' })
          }
        }
      )
      break
    case 'submitted':
      showManufacturerModal.value = true
      break
    case 'pricing':
      showApprovalModal.value = true
      break
    case 'pending_approval':
      openConfirm('承認の確認', 'この提案を承認しますか？', async () => {
        try {
          if (proposalId.value) {
            await proposalStore.updateProposal(proposalId.value, {
              status: 'approved',
              approvalStatus: 'approved',
              approvedBy: 'user_001',
              approvalDate: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
          }
          toast.add({ title: '承認しました', color: 'success' })
          navigateTo('/proposals')
        } catch {
          toast.add({ title: '承認に失敗しました', color: 'error' })
        }
      })
      break
    case 'confirming':
      openConfirm('完了の確認', 'この提案を完了にしますか？', async () => {
        try {
          if (proposalId.value) {
            await proposalStore.updateProposal(proposalId.value, {
              status: 'completed',
              updatedAt: new Date().toISOString()
            })
          }
          toast.add({ title: '完了にしました', color: 'success' })
          navigateTo('/proposals')
        } catch {
          toast.add({ title: '完了処理に失敗しました', color: 'error' })
        }
      })
      break
  }
}

function handleSecondaryClick() {
  switch (currentStatus.value) {
    case 'new':
    case 'draft':
      handleSaveDraft()
      break
    case 'submitted':
    case 'pricing':
    case 'confirming':
      openConfirm('更新の確認', 'この提案の内容を更新しますか？', async () => {
        try {
          if (proposalId.value) {
            await proposalStore.updateProposal(proposalId.value, {
              updatedAt: new Date().toISOString()
            })
            toast.add({ title: '更新しました', color: 'success' })
          }
        } catch {
          toast.add({ title: '更新に失敗しました', color: 'error' })
        }
      })
      break
    case 'pending_approval':
      openConfirm(
        '差し戻しの確認',
        'この提案を差し戻しますか？コメントを残すことを推奨します。',
        async () => {
          try {
            if (proposalId.value) {
              await proposalStore.updateProposal(proposalId.value, {
                status: 'pricing',
                approvalStatus: 'rejected',
                updatedAt: new Date().toISOString()
              })
            }
            toast.add({ title: '差し戻しました', color: 'warning' })
            navigateTo('/proposals')
          } catch {
            toast.add({ title: '差し戻しに失敗しました', color: 'error' })
          }
        }
      )
      break
  }
}

async function handleSaveDraft() {
  try {
    if (isEditing.value && proposalId.value) {
      await proposalStore.updateProposal(proposalId.value, {
        status: 'draft',
        updatedAt: new Date().toISOString()
      })
      toast.add({ title: '下書きを更新しました', color: 'success' })
    } else {
      toast.add({ title: '下書きを保存しました', color: 'success' })
    }
  } catch {
    toast.add({ title: '保存に失敗しました', color: 'error' })
  }
}

const showSidebar = ref(true)
const activeTab = ref('basic')

const baseTabs = [
  { label: '基本情報', value: 'basic', icon: 'i-heroicons-document-text' },
  { label: 'ライバル', value: 'rivals', icon: 'i-heroicons-user-group' },
  { label: '備考', value: 'notes', icon: 'i-heroicons-chat-bubble-left-right' },
  {
    label: 'タイムライン',
    value: 'comments',
    icon: 'i-fe-timeline'
  }
]

const tabs = computed(() => {
  return baseTabs
})

// --- History timeline ---
const stepActionMap: Record<number, { action: string, icon: string }> = {
  1: { action: '仕入れ依頼をしました', icon: 'i-mdi-cart' },
  2: { action: 'メーカー依頼をしました', icon: 'i-bi-send' },
  3: { action: '仕入れ値段を決定しました', icon: 'i-fluent-money-calculator-20-regular' },
  4: { action: '承認しました', icon: 'i-material-symbols-order-approve' },
  5: { action: '完了にしました', icon: 'i-nrk-media-media-complete' }
}

const userNameMap: Record<string, string> = {
  user_001: '加藤 誠',
  user_002: '田中 花子',
  admin_001: '鈴木 一郎'
}

interface TimelineEntry {
  type: 'history' | 'comment'
  date: string
  userName: string
  userAvatar?: string
  // history fields
  action?: string
  icon?: string
  // comment fields
  commentId?: number
  text?: string
  fields?: CommentField[]
}

const combinedTimeline = computed<TimelineEntry[]>(() => {
  const entries: TimelineEntry[] = []

  // Add creation entry
  if (proposalStore.selectedProposal) {
    const p = proposalStore.selectedProposal
    entries.push({
      type: 'history',
      date: p.createdAt,
      userName: userNameMap[p.createdBy] || p.createdBy,
      action: '案件を作成しました',
      icon: 'i-mdi-form-textbox'
    })
  }

  // Add process history
  for (const entry of proposalStore.processHistory) {
    const stepDef = stepActionMap[entry.step]
    entries.push({
      type: 'history',
      date: entry.completedAt,
      userName: entry.userName,
      userAvatar: entry.userAvatar,
      action: stepDef?.action || `ステップ ${entry.step} を完了しました`,
      icon: stepDef?.icon || 'i-heroicons-check-circle'
    })
  }

  // Add rejection entry
  if (proposalStore.selectedProposal?.approvalStatus === 'rejected') {
    const p = proposalStore.selectedProposal
    entries.push({
      type: 'history',
      date: p.approvalDate || p.updatedAt,
      userName: p.approvedBy ? (userNameMap[p.approvedBy] || p.approvedBy) : '管理者',
      action: '差し戻しました',
      icon: 'i-lucide-undo-2'
    })
  }

  // Add comments
  for (const c of comments.value) {
    entries.push({
      type: 'comment',
      date: c.createdAt,
      userName: c.userName,
      userAvatar: c.userAvatar,
      commentId: c.id,
      text: c.text,
      fields: c.fields
    })
  }

  // Sort chronologically (oldest first)
  entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return entries
})

// --- Comment field picking helpers ---
const isPickingCommentField = computed(() => proposalStore.pickingCommentId !== null)
const commentPickingFields = ref<CommentField[]>([])
const activeCommentId = ref<number | null>(null)

let _nextPickCommentId = 1

function startCommentPicking() {
  if (isPickingCommentField.value) {
    proposalStore.cancelCommentPicking()
  } else {
    proposalStore.startCommentPicking(_nextPickCommentId++)
  }
}

function onPickCommentField(rowId: number, fieldKey: string) {
  const idx = commentPickingFields.value.findIndex(
    f => f.rowId === rowId && f.fieldKey === fieldKey
  )
  if (idx >= 0) {
    commentPickingFields.value.splice(idx, 1)
  } else {
    commentPickingFields.value.push({ rowId, fieldKey })
  }
  proposalStore.setHighlights([...commentPickingFields.value])
}

function onCommentClick(comment: CommentEntry) {
  if (activeCommentId.value === comment.id) {
    activeCommentId.value = null
    proposalStore.setHighlights([])
  } else {
    activeCommentId.value = comment.id
    if (comment.fields.length > 0) {
      proposalStore.setHighlights([...comment.fields])
      nextTick(() => {
        const first = comment.fields[0]!
        const el = document.querySelector(
          `[data-row-id="${first.rowId}"] [data-field="${first.fieldKey}"]`
        )
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
  }
}

function removePickedField(idx: number) {
  commentPickingFields.value.splice(idx, 1)
  proposalStore.setHighlights([...commentPickingFields.value])
}

function getCommentRowLabel(rowId: number | null) {
  if (!rowId) return ''
  const idx = proposalStore.formRows.findIndex(
    (r: { id: number }) => r.id === rowId
  )
  return idx !== -1 ? `行 ${idx + 1}` : ''
}

function getCommentFieldLabel(fieldKey: string) {
  if (!fieldKey) return ''
  return FORM_ROW_FIELDS.find(f => f.key === fieldKey)?.label ?? fieldKey
}

function formatFieldLabel(field: CommentField) {
  return `${getCommentRowLabel(field.rowId)} / ${getCommentFieldLabel(field.fieldKey)}`
}
</script>

<template>
  <div class="flex h-full overflow-hidden bg-elevated/60">
    <!-- Main panel -->
    <div class="flex-1 w-full flex flex-col min-w-0 overflow-auto">
      <div class="flex-1 overflow-auto">
        <div class="flex flex-row gap-2 px-2 py-3">
          <UButton
            icon="i-ep-back"
            color="neutral"
            variant="ghost"
            @click="navigateTo('/proposals')"
          />
          <UCard
            :ui="{
              body: '!py-2 !px-0'
            }"
            class="shadow-sm shadow-gray-400 flex-1 rounded-full"
          >
            <UStepper
              v-model="currentStep"
              disabled
              :items="stepperItems"
              class="w-full"
              size="sm"
            />
          </UCard>
          <UTooltip :text="showSidebar ? '案件情報を隠す' : '案件情報を表示'">
            <UButton
              :icon="
                showSidebar
                  ? 'i-heroicons-chevron-double-right'
                  : 'i-heroicons-chevron-double-left'
              "
              color="neutral"
              variant="ghost"
              @click="showSidebar = !showSidebar"
            />
          </UTooltip>
        </div>

        <ProposalsForm
          v-if="!proposalStore.loading"
          @pick-comment-field="onPickCommentField"
        />
        <div v-else class="flex items-center justify-center p-12">
          <UIcon
            name="i-lucide-loader-2"
            class="size-6 animate-spin text-muted"
          />
        </div>
      </div>
    </div>
    {{ currentStep }}
    <!-- Sidebar -->
    <div
      :class="showSidebar ? 'w-96 border-l border-default' : 'w-0'"
      class="flex-shrink-0 flex flex-col bg-white overflow-hidden transition-all duration-300 ease-in-out"
    >
      <div class="border-b border-default px-4 py-2 space-y-2">
        <h2 class="text-sm font-semibold">
          {{ sidebarTitle }}
        </h2>
        <p
          v-if="proposalStore.selectedProposal?.updatedAt"
          class="text-xs text-muted"
        >
          更新:
          {{
            new Date(proposalStore.selectedProposal.updatedAt).toLocaleString(
              "ja-JP"
            )
          }}
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
        <ProposalsInformation v-model:active-tab="activeTab" />

        <!-- コメント・履歴 tab -->
        <div v-if="activeTab === 'comments'" class="space-y-4">
          <!-- Picking indicator -->
          <div
            v-if="isPickingCommentField"
            class="flex items-center gap-2 p-2 bg-primary/10 border border-primary/30 rounded-md text-xs text-primary"
          >
            <UIcon name="i-heroicons-cursor-arrow-rays" class="size-4" />
            <span>左側のフォームで項目をクリックしてください</span>
            <UButton
              label="キャンセル"
              variant="ghost"
              color="error"
              size="xs"
              @click="proposalStore.cancelCommentPicking()"
            />
          </div>
          <!-- New comment input -->
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-1">
              <UButton
                :label="isPickingCommentField ? '選択中...' : '項目を選択'"
                icon="i-heroicons-cursor-arrow-rays"
                :variant="isPickingCommentField ? 'soft' : 'outline'"
                :color="isPickingCommentField ? 'warning' : 'neutral'"
                size="xs"
                @click="startCommentPicking"
              />
              <div
                v-for="(field, idx) in commentPickingFields"
                :key="`${field.rowId}-${field.fieldKey}`"
                class="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 rounded px-1.5 py-0.5"
              >
                <UIcon name="i-heroicons-check-circle" class="size-3" />
                {{ formatFieldLabel(field) }}
                <button class="hover:text-red-500" @click="removePickedField(idx)">
                  <UIcon name="i-heroicons-x-mark" class="size-3" />
                </button>
              </div>
            </div>
            <UTextarea
              v-model="newCommentText"
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
              :disabled="!newCommentText.trim()"
              @click="addComment"
            />
          </div>

          <USeparator />

          <!-- Combined timeline: history + comments -->
          <div class="space-y-0">
            <div
              v-for="(entry, idx) in [...combinedTimeline].reverse()"
              :key="entry.type + '-' + (entry.commentId || idx)"
              class="flex gap-3 rounded-md p-1 transition-colors"
              :class="[
                entry.type === 'comment' ? 'cursor-pointer' : '',
                entry.type === 'comment' && activeCommentId === entry.commentId ? 'bg-warning/10' : entry.type === 'comment' ? 'hover:bg-muted/30' : ''
              ]"
              @click="entry.type === 'comment' && entry.commentId ? onCommentClick(comments.find(c => c.id === entry.commentId)!) : undefined"
            >
              <!-- Indicator -->
              <div class="flex flex-col items-center">
                <template v-if="entry.type === 'comment'">
                  <UAvatar :src="entry.userAvatar" :alt="entry.userName" size="xs" />
                </template>
                <template v-else>
                  <div class="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary">
                    <UIcon :name="entry.icon || 'i-heroicons-check-circle'" class="size-3.5" />
                  </div>
                </template>
                <div class="flex-1 w-px bg-primary mt-1" />
              </div>
              <!-- Content -->
              <div class="flex-1 pb-3">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-xs font-medium">{{ entry.userName }}</span>
                  <span class="text-xs text-muted">{{ useTimeAgo(new Date(entry.date)) }}</span>
                </div>
                <!-- History entry -->
                <template v-if="entry.type === 'history'">
                  <p class="text-xs text-muted italic">
                    {{ entry.action }}
                  </p>
                </template>
                <!-- Comment entry -->
                <template v-else>
                  <div v-if="entry.fields && entry.fields.length > 0" class="flex flex-wrap gap-1 mb-1">
                    <div
                      v-for="field in entry.fields"
                      :key="`${field.rowId}-${field.fieldKey}`"
                      class="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 rounded px-1.5 py-0.5"
                    >
                      <UIcon name="i-heroicons-link" class="size-3" />
                      {{ formatFieldLabel(field) }}
                    </div>
                  </div>
                  <p class="text-xs">
                    {{ entry.text }}
                  </p>
                </template>
              </div>
            </div>
          </div>

          <div
            v-if="combinedTimeline.length === 0"
            class="text-center py-6 text-muted text-sm"
          >
            履歴・コメントはまだありません
          </div>
        </div>
      </div>

      <div class="border-t border-default px-4 py-2">
        <div class="flex flex-row gap-1">
          <UFormField label="予算備考" class="w-full" size="xs">
            <UInput class="w-full" placeholder="" />
          </UFormField>
          <UFormField label="予算合計" class="w-full" size="xs">
            <UInput class="w-full" placeholder="" />
          </UFormField>
        </div>
        <div class="flex flex-col justify-between gap-2 mt-4">
          <UButton
            :label="secondaryButtonConfig.label"
            :color="secondaryButtonConfig.color"
            variant="outline"
            block
            :trailing-icon="secondaryButtonConfig.icon"
            @click="handleSecondaryClick"
          />
          <UButton
            :label="primaryButtonConfig.label"
            :color="primaryButtonConfig.color"
            block
            :trailing-icon="primaryButtonConfig.icon"
            @click="handlePrimaryClick"
          />
        </div>
      </div>
    </div>

    <!-- Confirm dialog -->
    <UModal v-model:open="showConfirmDialog">
      <template #header>
        <h3 class="text-base font-semibold">
          {{ confirmTitle }}
        </h3>
      </template>
      <template #body>
        <p class="text-sm text-muted">
          {{ confirmDescription }}
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="キャンセル"
            color="neutral"
            variant="outline"
            @click="showConfirmDialog = false"
          />
          <UButton label="確認" color="primary" @click="executeConfirm" />
        </div>
      </template>
    </UModal>

    <!-- Manufacturer request modal -->
    <ProposalsManufacturerRequestModal
      v-model:open="showManufacturerModal"
      :manufacturer-names="selectedManufacturerNames"
    />

    <!-- Approval request modal -->
    <UModal v-model:open="showApprovalModal" :ui="{ content: 'sm:max-w-lg' }">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-material-symbols-order-approve"
            class="size-5 text-primary"
          />
          <h3 class="text-base font-semibold">
            承認依頼
          </h3>
        </div>
      </template>
      <template #body>
        <p class="text-sm text-muted mb-4">
          承認を依頼するマネージャーを選択してください。
        </p>
        <div class="space-y-2">
          <div
            v-for="mgr in mockManagers"
            :key="mgr.id"
            class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
            :class="
              selectedApprovers.includes(mgr.id)
                ? 'border-primary bg-primary/5'
                : 'border-default hover:border-muted'
            "
            @click="toggleApprover(mgr.id)"
          >
            <UCheckbox
              :model-value="selectedApprovers.includes(mgr.id)"
              @update:model-value="toggleApprover(mgr.id)"
              @click.stop
            />
            <UAvatar :src="mgr.avatar" :alt="mgr.name" size="sm" />
            <div class="flex-1">
              <div class="text-sm font-medium">
                {{ mgr.name }}
              </div>
              <div class="text-xs text-muted">
                {{ mgr.department }} / {{ mgr.role }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="キャンセル"
            color="neutral"
            variant="outline"
            @click="
              showApprovalModal = false;
              selectedApprovers = [];
            "
          />
          <UButton
            label="承認依頼を送信"
            color="primary"
            icon="i-bi-send"
            :disabled="selectedApprovers.length === 0"
            @click="submitApprovalRequest"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
