<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useCustomerStore } from '~/stores/customers'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const customerStore = useCustomerStore()

const customerId = computed(() => {
  const id = route.params.id
  const value = Array.isArray(id) ? id.join('/') : id
  return value === 'new' ? null : value
})

const isNew = computed(() => !customerId.value)
const customer = computed(() => customerStore.selectedCustomer)
const isDeleteModalOpen = ref(false)
const showSidebar = ref(true)
const activeTab = ref('basic')

const tabs = [
  { label: '基本情報', value: 'basic', icon: 'i-heroicons-document-text' },
  { label: '対応履歴', value: 'history', icon: 'i-fe-timeline' }
]

const contactTypes = [
  { label: 'メール', value: 'email' },
  { label: '電話', value: 'phone' },
  { label: 'FAX', value: 'fax' }
]

const schema = z.object({
  name: z.string().min(1, '顧客名は必須です'),
  furigana: z.string().optional(),
  notes: z.string().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: '',
  furigana: '',
  notes: ''
})

const tags = ref<string[]>([])
const newTag = ref('')
const contacts = ref<
  {
    id: string
    type: string
    value: string
    name: string
    isPrimary: boolean
  }[]
>([])

onMounted(async () => {
  if (isNew.value) {
    contacts.value = [
      { id: '1', type: 'email', value: '', name: '', isPrimary: true }
    ]
    return
  }
  await customerStore.getCustomerById(customerId.value!)
  if (customer.value) {
    state.name = customer.value.name
    state.furigana = customer.value.furigana || ''
    state.notes = customer.value.notes || ''
    tags.value = [...customer.value.tags]
    contacts.value = customer.value.contacts.map(c => ({
      id: c.id,
      type: c.type,
      value: c.value,
      name: c.name || '',
      isPrimary: c.isPrimary
    }))
    if (!contacts.value.length) {
      contacts.value = [
        { id: '1', type: 'email', value: '', name: '', isPrimary: true }
      ]
    }
  }
})

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
  }
  newTag.value = ''
}

function removeTag(tag: string) {
  tags.value = tags.value.filter(t => t !== tag)
}

function addContact() {
  contacts.value.push({
    id: Date.now().toString(),
    type: 'email',
    value: '',
    name: '',
    isPrimary: false
  })
}

function removeContact(id: string) {
  contacts.value = contacts.value.filter(c => c.id !== id)
}

function setPrimaryContact(id: string) {
  contacts.value = contacts.value.map(c => ({
    ...c,
    isPrimary: c.id === id
  }))
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    if (isNew.value) {
      await customerStore.createCustomer({
        name: event.data.name,
        code: `C${Date.now().toString().slice(-4)}`,
        furigana: event.data.furigana,
        tags: tags.value,
        contacts: contacts.value,
        assignedSalesStaff: [],
        notes: event.data.notes
      })
      toast.add({ title: '顧客を追加しました', color: 'success' })
      router.push('/customers')
    } else {
      await customerStore.updateCustomer(customerId.value!, {
        name: event.data.name,
        furigana: event.data.furigana,
        tags: tags.value,
        contacts: contacts.value,
        notes: event.data.notes
      })
      toast.add({ title: '顧客情報を更新しました', color: 'success' })
    }
  } catch {
    toast.add({
      title: isNew.value ? '顧客の追加に失敗しました' : '更新に失敗しました',
      color: 'error'
    })
  }
}

async function deleteCustomer() {
  try {
    await customerStore.deleteCustomer(customerId.value!)
    toast.add({ title: '顧客を削除しました', color: 'success' })
    router.push('/customers')
  } catch {
    toast.add({ title: '削除に失敗しました', color: 'error' })
  }
}

// --- Mock history timeline data ---
interface HistoryEntry {
  id: string
  type: 'proposal' | 'activity'
  title: string
  code: string
  date: string
  status: string
  linkTo: string
}

const historyTimeline = computed<HistoryEntry[]>(() => {
  if (isNew.value) return []
  // Mock data for demonstration
  return [
    {
      id: '1',
      type: 'proposal',
      title: '2026年春季カタログ提案',
      code: 'P-2026-001',
      date: '2026-03-01T10:00:00Z',
      status: '承認済',
      linkTo: '/proposals/d/prop_001'
    },
    {
      id: '2',
      type: 'activity',
      title: '定期訪問 - 新製品紹介',
      code: 'SA-001',
      date: '2026-02-20T14:00:00Z',
      status: '完了',
      linkTo: '/activities/d/act_001'
    },
    {
      id: '3',
      type: 'proposal',
      title: '特注品見積もり依頼',
      code: 'P-2026-005',
      date: '2026-02-15T09:00:00Z',
      status: '仕入れ依頼中',
      linkTo: '/proposals/d/prop_005'
    },
    {
      id: '4',
      type: 'activity',
      title: '電話フォローアップ',
      code: 'SA-003',
      date: '2026-02-10T11:00:00Z',
      status: '完了',
      linkTo: '/activities/d/act_003'
    }
  ]
})

const sidebarTitle = computed(() =>
  isNew.value ? '新規顧客登録' : `顧客: ${customer.value?.name || ''}`
)
</script>

<template>
  <div
    class="w-full flex justify-between h-full overflow-hidden bg-elevated/60"
  >
    <!-- Main panel -->
    <div class="flex-1 w-full flex flex-col min-w-0 overflow-auto">
      <div class="flex-1 overflow-auto">
        <div class="flex flex-row gap-2 px-2 py-3">
          <UButton
            icon="i-ep-back"
            color="neutral"
            variant="ghost"
            @click="navigateTo('/customers')"
          />
          <div class="flex-1" />
          <UTooltip :text="showSidebar ? '情報を隠す' : '情報を表示'">
            <UButton
              :icon="
                showSidebar
                  ? 'i-lucide-panel-right-close'
                  : 'i-lucide-panel-right-open'
              "
              color="neutral"
              variant="ghost"
              @click="showSidebar = !showSidebar"
            />
          </UTooltip>
        </div>

        <div
          v-if="!isNew && customerStore.loading"
          class="flex justify-center py-20"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="w-8 h-8 animate-spin text-muted"
          />
        </div>

        <UForm
          v-else-if="isNew || customer"
          id="customer-edit-form"
          :schema="schema"
          :state="state"
          class="max-w-3xl mx-auto px-4 pb-8"
          @submit="onSubmit"
        >
          <!-- 基本情報 -->
          <UPageCard title="基本情報" variant="subtle" class="mb-4">
            <UFormField
              name="name"
              label="顧客名"
              description="法人名またはお客様名を入力してください。"
              required
              class="gap-1 w-full"
            >
              <UInput
                v-model="state.name"
                class="w-full"
                placeholder="株式会社〇〇"
                autocomplete="off"
              />
            </UFormField>
            <USeparator />
            <UFormField
              name="furigana"
              label="ふりがな"
              description="顧客名のふりがなを入力してください。"
              class="gap-1"
            >
              <UInput
                v-model="state.furigana"
                class="w-full"
                placeholder="かぶしきがいしゃ〇〇"
                autocomplete="off"
              />
            </UFormField>
            <USeparator />
            <UFormField
              name="notes"
              label="備考"
              description="顧客に関するメモを入力できます。"
              class="gap-1"
              :ui="{ container: 'w-full' }"
            >
              <UTextarea
                v-model="state.notes"
                :rows="3"
                autoresize
                class="w-full"
                placeholder="メモを入力してください..."
              />
            </UFormField>
          </UPageCard>

          <!-- タグ -->
          <UPageCard title="タグ" variant="subtle" class="mb-4">
            <UFormField
              label="タグ"
              description="顧客を分類するタグを追加できます。"
              class="gap-1"
            >
              <div class="w-full space-y-2">
                <div class="flex gap-2">
                  <UInput
                    v-model="newTag"
                    class="w-full"
                    placeholder="タグを入力..."
                    @keyup.enter="addTag"
                  />
                  <UButton
                    icon="i-lucide-plus"
                    label="追加"
                    variant="outline"
                    @click="addTag"
                  />
                </div>
                <div v-if="tags.length" class="flex flex-wrap gap-1">
                  <UBadge
                    v-for="tag in tags"
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

          <!-- 連絡先 -->
          <UPageCard title="連絡先" variant="subtle" class="mb-4">
            <div class="space-y-4">
              <div
                v-for="contact in contacts"
                :key="contact.id"
                class="border border-default rounded-lg p-4 space-y-3"
              >
                <div class="flex items-center gap-2">
                  <USelect
                    v-model="contact.type"
                    :items="contactTypes"
                    class="w-28"
                  />
                  <UInput
                    v-model="contact.value"
                    :placeholder="
                      contact.type === 'email'
                        ? 'example@mail.com'
                        : contact.type === 'phone'
                          ? '03-XXXX-XXXX'
                          : 'FAX番号'
                    "
                    class="flex-1"
                  />
                  <UButton
                    v-if="!contact.isPrimary"
                    icon="i-lucide-star"
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    title="メインに設定"
                    @click="setPrimaryContact(contact.id)"
                  />
                  <UIcon
                    v-else
                    name="i-lucide-star"
                    class="w-4 h-4 text-yellow-500"
                  />
                  <UButton
                    v-if="contacts.length > 1"
                    icon="i-lucide-trash"
                    size="xs"
                    variant="ghost"
                    color="error"
                    @click="removeContact(contact.id)"
                  />
                </div>
                <UInput
                  v-model="contact.name"
                  class="w-full"
                  placeholder="担当者名（任意）"
                />
              </div>
            </div>
            <USeparator />
            <div class="flex justify-start">
              <UButton
                icon="i-lucide-plus"
                label="連絡先を追加"
                variant="ghost"
                @click="addContact"
              />
            </div>
          </UPageCard>
        </UForm>

        <div v-else class="flex flex-col items-center justify-center py-20">
          <UIcon name="i-lucide-user-x" class="w-12 h-12 text-muted mb-4" />
          <p class="text-muted">
            顧客が見つかりません
          </p>
          <UButton
            label="一覧に戻る"
            variant="ghost"
            class="mt-2"
            @click="navigateTo('/customers')"
          />
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div
      :class="showSidebar ? 'w-96 border-l border-default' : 'w-0'"
      class="shrink-0 flex flex-col bg-white dark:bg-neutral-800 overflow-hidden transition-all duration-300 ease-in-out"
    >
      <div class="border-b border-default px-4 pt-2 space-y-2">
        <h2 class="text-sm font-semibold">
          {{ sidebarTitle }}
        </h2>
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

      <div class="flex-1 overflow-auto py-4 px-2">
        <!-- 基本情報 tab -->
        <div v-if="activeTab === 'basic'" class="space-y-4">
          <template v-if="customer && !isNew">
            <div class="space-y-3">
              <div>
                <p class="text-xs text-muted">
                  顧客コード
                </p>
                <p class="text-sm font-medium">
                  {{ customer.code }}
                </p>
              </div>
              <div>
                <p class="text-xs text-muted">
                  顧客名
                </p>
                <p class="text-sm font-medium">
                  {{ customer.name }}
                </p>
              </div>
              <div v-if="customer.furigana">
                <p class="text-xs text-muted">
                  ふりがな
                </p>
                <p class="text-sm">
                  {{ customer.furigana }}
                </p>
              </div>
              <div v-if="customer.tags.length">
                <p class="text-xs text-muted mb-1">
                  タグ
                </p>
                <div class="flex flex-wrap gap-1">
                  <UBadge
                    v-for="tag in customer.tags"
                    :key="tag"
                    variant="soft"
                    color="primary"
                    size="xs"
                  >
                    {{ tag }}
                  </UBadge>
                </div>
              </div>
              <div>
                <p class="text-xs text-muted">
                  登録日
                </p>
                <p class="text-sm">
                  {{ new Date(customer.createdAt).toLocaleDateString("ja-JP") }}
                </p>
              </div>
              <div>
                <p class="text-xs text-muted">
                  最終更新日
                </p>
                <p class="text-sm">
                  {{ new Date(customer.updatedAt).toLocaleDateString("ja-JP") }}
                </p>
              </div>
            </div>
          </template>
          <p v-else class="text-sm text-muted">
            新規顧客のため、基本情報はまだありません。
          </p>
        </div>

        <!-- 対応履歴 tab -->
        <div v-if="activeTab === 'history'" class="space-y-4">
          <div
            v-if="historyTimeline.length === 0"
            class="text-center py-6 text-muted text-sm"
          >
            対応履歴はまだありません
          </div>
          <div v-else class="space-y-0">
            <div
              v-for="(entry, idx) in historyTimeline"
              :key="entry.id"
              class="flex gap-3 rounded-md p-1 cursor-pointer hover:bg-muted/50 transition-colors"
              @click="navigateTo(entry.linkTo)"
            >
              <!-- Indicator -->
              <div class="flex flex-col items-center">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="
                    entry.type === 'proposal'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-success/10 text-success'
                  "
                >
                  <UIcon
                    :name="
                      entry.type === 'proposal'
                        ? 'i-mdi-form-textbox'
                        : 'i-lucide-activity'
                    "
                    class="size-4"
                  />
                </div>
                <div
                  v-if="idx < historyTimeline.length - 1"
                  class="w-px flex-1 mt-1"
                  :class="{
                    'bg-primary': idx !== historyTimeline.length - 1
                  }"
                />
              </div>
              <!-- Content -->
              <div class="flex-1 pb-3">
                <div class="flex items-center gap-2">
                  <UBadge
                    :color="entry.type === 'proposal' ? 'primary' : 'success'"
                    variant="subtle"
                    size="xs"
                  >
                    {{ entry.type === "proposal" ? "提案" : "営業活動" }}
                  </UBadge>
                  <span class="text-xs text-muted">{{ entry.code }}</span>
                </div>
                <p class="text-sm font-medium mt-1">
                  {{ entry.title }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <UBadge variant="outline" size="xs">
                    {{ entry.status }}
                  </UBadge>
                  <span class="text-xs text-muted">
                    {{ new Date(entry.date).toLocaleDateString("ja-JP") }}
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
            form="customer-edit-form"
            type="submit"
            :loading="customerStore.loading"
          />
        </div>
      </div>
    </div>

    <!-- 削除確認 -->
    <UModal v-model:open="isDeleteModalOpen">
      <template #header>
        <h3 class="text-base font-semibold">
          顧客を削除
        </h3>
      </template>
      <template #body>
        <p class="text-sm text-muted">
          <strong>{{ customer?.name }}</strong>
          を削除します。この操作は取り消せません。
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
          <UButton label="削除する" color="error" @click="deleteCustomer" />
        </div>
      </template>
    </UModal>
  </div>
</template>
