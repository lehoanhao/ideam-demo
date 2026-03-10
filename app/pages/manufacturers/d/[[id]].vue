<script setup lang="ts">
import { useManufacturerStore } from '~/stores/manufacturers'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const mfrStore = useManufacturerStore()

const mfrId = computed(() => {
  const id = route.params.id
  const value = Array.isArray(id) ? id.join('/') : id
  return value === 'new' ? null : value
})

const isNew = computed(() => !mfrId.value)
const mfr = computed(() => mfrStore.selectedManufacturer)
const isDeleteModalOpen = ref(false)
const showSidebar = ref(true)
const activeTab = ref('basic')

const tabs = [
  { label: '基本情報', value: 'basic', icon: 'i-heroicons-document-text' },
  { label: '見積実績', value: 'history', icon: 'i-fe-timeline' }
]

const editState = reactive({
  name: '',
  furigana: '',
  contactEmail: '',
  contactPhone: '',
  faxNumber: '',
  preferredContactMethod: 'email' as 'email' | 'fax' | 'phone',
  productCategories: [] as string[],
  tags: [] as string[],
  notes: ''
})

const newTag = ref('')
const newCategory = ref('')

const contactMethodOptions = [
  { label: 'メール', value: 'email' },
  { label: 'FAX', value: 'fax' },
  { label: '電話', value: 'phone' }
]

onMounted(async () => {
  if (isNew.value) return
  await mfrStore.getManufacturerById(mfrId.value!)
  if (mfr.value) {
    editState.name = mfr.value.name
    editState.furigana = mfr.value.furigana || ''
    editState.contactEmail = mfr.value.contactEmail || ''
    editState.contactPhone = mfr.value.contactPhone || ''
    editState.faxNumber = mfr.value.faxNumber || ''
    editState.preferredContactMethod = mfr.value.preferredContactMethod
    editState.productCategories = [...mfr.value.productCategories]
    editState.tags = [...mfr.value.tags]
    editState.notes = mfr.value.notes || ''
  }
})

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !editState.tags.includes(tag)) {
    editState.tags.push(tag)
  }
  newTag.value = ''
}

function removeTag(tag: string) {
  editState.tags = editState.tags.filter(t => t !== tag)
}

function addCategory() {
  const cat = newCategory.value.trim()
  if (cat && !editState.productCategories.includes(cat)) {
    editState.productCategories.push(cat)
  }
  newCategory.value = ''
}

function removeCategory(cat: string) {
  editState.productCategories = editState.productCategories.filter(c => c !== cat)
}

async function handleSave() {
  try {
    if (isNew.value) {
      const newMfr = await mfrStore.createManufacturer({
        name: editState.name,
        code: `M${Date.now().toString().slice(-4)}`,
        furigana: editState.furigana || undefined,
        contactEmail: editState.contactEmail || undefined,
        contactPhone: editState.contactPhone || undefined,
        faxNumber: editState.faxNumber || undefined,
        preferredContactMethod: editState.preferredContactMethod,
        productCategories: editState.productCategories,
        tags: editState.tags,
        notes: editState.notes
      })
      toast.add({ title: 'メーカーを追加しました', color: 'success' })
      if (newMfr) router.push(`/manufacturers/d/${newMfr.id}`)
      else router.push('/manufacturers')
    } else {
      await mfrStore.updateManufacturer(mfrId.value!, {
        name: editState.name,
        furigana: editState.furigana || undefined,
        contactEmail: editState.contactEmail || undefined,
        contactPhone: editState.contactPhone || undefined,
        faxNumber: editState.faxNumber || undefined,
        preferredContactMethod: editState.preferredContactMethod,
        productCategories: editState.productCategories,
        tags: editState.tags,
        notes: editState.notes
      })
      toast.add({ title: 'メーカー情報を更新しました', color: 'success' })
    }
  } catch {
    toast.add({ title: isNew.value ? '追加に失敗しました' : '更新に失敗しました', color: 'error' })
  }
}

async function deleteMfr() {
  try {
    await mfrStore.deleteManufacturer(mfrId.value!)
    toast.add({ title: 'メーカーを削除しました', color: 'success' })
    router.push('/manufacturers')
  } catch {
    toast.add({ title: '削除に失敗しました', color: 'error' })
  }
}

// --- Mock quote history timeline ---
interface QuoteHistoryEntry {
  id: string
  proposalCode: string
  proposalTitle: string
  customerName: string
  date: string
  amount: number
  status: string
  linkTo: string
}

const quoteHistory = computed<QuoteHistoryEntry[]>(() => {
  if (isNew.value) return []
  return [
    {
      id: '1',
      proposalCode: 'P-2026-001',
      proposalTitle: '2026年春季カタログ提案',
      customerName: '株式会社ABC',
      date: '2026-03-01T10:00:00Z',
      amount: 1500000,
      status: '承認済',
      linkTo: '/proposals/d/prop_001'
    },
    {
      id: '2',
      proposalCode: 'P-2026-003',
      proposalTitle: 'イベント備品一括見積',
      customerName: '株式会社DEF',
      date: '2026-02-10T09:00:00Z',
      amount: 800000,
      status: '仕入れ値段決定中',
      linkTo: '/proposals/d/prop_003'
    },
    {
      id: '3',
      proposalCode: 'P-2025-042',
      proposalTitle: '年末特別提案',
      customerName: '株式会社GHI',
      date: '2025-12-01T09:00:00Z',
      amount: 2200000,
      status: '完了',
      linkTo: '/proposals/d/prop_042'
    }
  ]
})

const sidebarTitle = computed(() =>
  isNew.value
    ? '新規メーカー登録'
    : `メーカー: ${mfr.value?.name || ''}`
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
            @click="navigateTo('/manufacturers')"
          />
          <div class="flex-1" />
          <UTooltip :text="showSidebar ? '情報を隠す' : '情報を表示'">
            <UButton
              :icon="showSidebar ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
              color="neutral"
              variant="ghost"
              @click="showSidebar = !showSidebar"
            />
          </UTooltip>
        </div>

        <div v-if="!isNew && mfrStore.loading" class="flex justify-center py-20">
          <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-muted" />
        </div>

        <div v-else-if="isNew || mfr" class="max-w-3xl mx-auto px-4 pb-8">
          <!-- 基本情報 -->
          <UPageCard title="基本情報" variant="subtle" class="mb-4">
            <UFormField
              label="メーカー名"
              description="メーカーの正式名称を入力してください。"
              required
              class="gap-1 w-full"
            >
              <UInput v-model="editState.name" class="w-full" placeholder="メーカー名" autocomplete="off" />
            </UFormField>
            <USeparator />
            <UFormField
              label="ふりがな"
              description="メーカー名のふりがなを入力してください。"
              class="gap-1"
            >
              <UInput v-model="editState.furigana" class="w-full" placeholder="ふりがな" autocomplete="off" />
            </UFormField>
            <USeparator />
            <UFormField
              label="備考"
              description="メーカーに関するメモを入力できます。"
              class="gap-1"
              :ui="{ container: 'w-full' }"
            >
              <UTextarea
                v-model="editState.notes"
                :rows="3"
                autoresize
                class="w-full"
                placeholder="メモを入力..."
              />
            </UFormField>
          </UPageCard>

          <!-- 連絡先 -->
          <UPageCard title="連絡先情報" variant="subtle" class="mb-4">
            <UFormField
              label="メールアドレス"
              description="メーカーの連絡用メールアドレスを入力してください。"
              class="gap-1"
            >
              <UInput v-model="editState.contactEmail" class="w-full" placeholder="example@mail.com" />
            </UFormField>
            <USeparator />
            <UFormField
              label="電話番号"
              description="メーカーの電話番号を入力してください。"
              class="gap-1"
            >
              <UInput v-model="editState.contactPhone" class="w-full" placeholder="03-XXXX-XXXX" />
            </UFormField>
            <USeparator />
            <UFormField
              label="FAX番号"
              description="メーカーのFAX番号を入力してください。"
              class="gap-1"
            >
              <UInput v-model="editState.faxNumber" class="w-full" placeholder="FAX番号" />
            </UFormField>
            <USeparator />
            <UFormField
              label="優先連絡方法"
              description="優先する連絡方法を選択してください。"
              class="gap-1"
            >
              <USelectMenu v-model="editState.preferredContactMethod" :items="contactMethodOptions" value-key="value" />
            </UFormField>
          </UPageCard>

          <!-- タグ -->
          <UPageCard title="タグ" variant="subtle" class="mb-4">
            <UFormField
              label="タグ"
              description="メーカーを分類するタグを追加できます。"
              class="gap-1"
            >
              <div class="w-full space-y-2">
                <div class="flex gap-2">
                  <UInput
                    v-model="newTag"
                    placeholder="タグを入力..."
                    class="flex-1"
                    @keyup.enter="addTag"
                  />
                  <UButton
                    icon="i-lucide-plus"
                    label="追加"
                    variant="outline"
                    @click="addTag"
                  />
                </div>
                <div v-if="editState.tags.length" class="flex flex-wrap gap-1">
                  <UBadge
                    v-for="tag in editState.tags"
                    :key="tag"
                    variant="soft"
                    class="cursor-pointer"
                    @click="removeTag(tag)"
                  >
                    {{ tag }}
                    <UIcon name="i-lucide-x" class="ml-1 w-3 h-3" />
                  </UBadge>
                </div>
              </div>
            </UFormField>
          </UPageCard>

          <!-- 商品カテゴリ -->
          <UPageCard title="商品カテゴリ" variant="subtle" class="mb-4">
            <UFormField
              label="カテゴリ"
              description="取り扱い商品カテゴリを追加できます。"
              class="gap-1"
            >
              <div class="w-full space-y-2">
                <div class="flex gap-2">
                  <UInput
                    v-model="newCategory"
                    placeholder="カテゴリを入力..."
                    class="flex-1"
                    @keyup.enter="addCategory"
                  />
                  <UButton
                    icon="i-lucide-plus"
                    label="追加"
                    variant="outline"
                    @click="addCategory"
                  />
                </div>
                <div v-if="editState.productCategories.length" class="flex flex-wrap gap-1">
                  <UBadge
                    v-for="cat in editState.productCategories"
                    :key="cat"
                    variant="soft"
                    color="success"
                    class="cursor-pointer"
                    @click="removeCategory(cat)"
                  >
                    {{ cat }}
                    <UIcon name="i-lucide-x" class="ml-1 w-3 h-3" />
                  </UBadge>
                </div>
              </div>
            </UFormField>
          </UPageCard>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-20">
          <UIcon name="i-lucide-building-x" class="w-12 h-12 text-muted mb-4" />
          <p class="text-muted">
            メーカーが見つかりません
          </p>
          <UButton
            label="一覧に戻る"
            variant="ghost"
            class="mt-2"
            @click="navigateTo('/manufacturers')"
          />
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
        <p v-if="mfr?.updatedAt" class="text-xs text-muted">
          更新: {{ new Date(mfr.updatedAt).toLocaleString('ja-JP') }}
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
          <template v-if="mfr && !isNew">
            <div class="space-y-3">
              <div>
                <p class="text-xs text-muted">
                  メーカーコード
                </p>
                <p class="text-sm font-medium">
                  {{ mfr.code }}
                </p>
              </div>
              <div>
                <p class="text-xs text-muted">
                  メーカー名
                </p>
                <p class="text-sm font-medium">
                  {{ mfr.name }}
                </p>
              </div>
              <div v-if="mfr.furigana">
                <p class="text-xs text-muted">
                  ふりがな
                </p>
                <p class="text-sm">
                  {{ mfr.furigana }}
                </p>
              </div>
              <div v-if="mfr.tags.length">
                <p class="text-xs text-muted mb-1">
                  タグ
                </p>
                <div class="flex flex-wrap gap-1">
                  <UBadge
                    v-for="tag in mfr.tags"
                    :key="tag"
                    variant="soft"
                    color="primary"
                    size="xs"
                  >
                    {{ tag }}
                  </UBadge>
                </div>
              </div>
              <div v-if="mfr.productCategories.length">
                <p class="text-xs text-muted mb-1">
                  商品カテゴリ
                </p>
                <div class="flex flex-wrap gap-1">
                  <UBadge
                    v-for="cat in mfr.productCategories"
                    :key="cat"
                    variant="soft"
                    color="success"
                    size="xs"
                  >
                    {{ cat }}
                  </UBadge>
                </div>
              </div>
              <div>
                <p class="text-xs text-muted">
                  登録日
                </p>
                <p class="text-sm">
                  {{ new Date(mfr.createdAt).toLocaleDateString('ja-JP') }}
                </p>
              </div>
            </div>
          </template>
          <p v-else class="text-sm text-muted">
            新規メーカーのため、基本情報はまだありません。
          </p>
        </div>

        <!-- 見積実績 tab -->
        <div v-if="activeTab === 'history'" class="space-y-4">
          <div v-if="quoteHistory.length === 0" class="text-center py-6 text-muted text-sm">
            見積実績はまだありません
          </div>
          <div v-else class="space-y-0">
            <div
              v-for="(entry, idx) in quoteHistory"
              :key="entry.id"
              class="flex gap-3 rounded-md p-1 cursor-pointer hover:bg-muted/50 transition-colors"
              @click="navigateTo(entry.linkTo)"
            >
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                  <UIcon name="i-mdi-form-textbox" class="size-4" />
                </div>
                <div v-if="idx < quoteHistory.length - 1" class="w-px flex-1 bg-default mt-1" />
              </div>
              <div class="flex-1 pb-3">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-muted">{{ entry.proposalCode }}</span>
                </div>
                <p class="text-sm font-medium mt-1">
                  {{ entry.proposalTitle }}
                </p>
                <p class="text-xs text-muted">
                  {{ entry.customerName }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <UBadge variant="outline" size="xs">
                    {{ entry.status }}
                  </UBadge>
                  <span class="text-xs text-muted tabular-nums">
                    ¥{{ entry.amount.toLocaleString('ja-JP') }}
                  </span>
                  <span class="text-xs text-muted">
                    {{ new Date(entry.date).toLocaleDateString('ja-JP') }}
                  </span>
                </div>
              </div>
            </div>
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
            :label="isNew ? '登録する' : '変更を保存'"
            color="primary"
            block
            trailing-icon="i-lucide-save"
            :loading="mfrStore.loading"
            @click="handleSave"
          />
        </div>
      </div>
    </div>

    <!-- 削除確認 -->
    <UModal v-model:open="isDeleteModalOpen">
      <template #header>
        <h3 class="text-base font-semibold">
          メーカーを削除
        </h3>
      </template>
      <template #body>
        <p class="text-sm text-muted">
          <strong>{{ mfr?.name }}</strong> を削除します。この操作は取り消せません。
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
          <UButton label="削除する" color="error" @click="deleteMfr" />
        </div>
      </template>
    </UModal>
  </div>
</template>
