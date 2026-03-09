<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useCustomerStore } from '~/stores/customers'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const customerStore = useCustomerStore()

const customerId = route.params.id as string
const isNew = computed(() => customerId === 'new')
const customer = computed(() => customerStore.selectedCustomer)
const isDeleteModalOpen = ref(false)

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
const contacts = ref<{ id: string, type: string, value: string, name: string, isPrimary: boolean }[]>([])

onMounted(async () => {
  if (isNew.value) {
    contacts.value = [{ id: '1', type: 'email', value: '', name: '', isPrimary: true }]
    return
  }
  await customerStore.getCustomerById(customerId)
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
      contacts.value = [{ id: '1', type: 'email', value: '', name: '', isPrimary: true }]
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
  contacts.value = contacts.value.map(c => ({ ...c, isPrimary: c.id === id }))
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
      await customerStore.updateCustomer(customerId, {
        name: event.data.name,
        furigana: event.data.furigana,
        tags: tags.value,
        contacts: contacts.value,
        notes: event.data.notes
      })
      toast.add({ title: '顧客情報を更新しました', color: 'success' })
    }
  } catch {
    toast.add({ title: isNew.value ? '顧客の追加に失敗しました' : '更新に失敗しました', color: 'error' })
  }
}

async function deleteCustomer() {
  try {
    await customerStore.deleteCustomer(customerId)
    toast.add({ title: '顧客を削除しました', color: 'success' })
    router.push('/customers')
  } catch {
    toast.add({ title: '削除に失敗しました', color: 'error' })
  }
}
</script>

<template>
  <UDashboardPanel id="customer-detail">
    <template #header>
      <UDashboardNavbar :title="isNew ? '顧客追加' : (customer?.name || '顧客詳細')">
        <template #leading>
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            color="neutral"
            @click="router.push('/customers')"
          />
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="!isNew && customerStore.loading" class="flex justify-center py-20">
        <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-muted" />
      </div>

      <UForm
        v-else-if="isNew || customer"
        id="customer-edit-form"
        :schema="schema"
        :state="state"
        class="max-w-3xl mx-auto"
        @submit="onSubmit"
      >
        <!-- ヘッダー -->
        <UPageCard
          :title="isNew ? '新規顧客登録' : customer!.name"
          :description="isNew ? '新しい顧客情報を入力してください。' : `顧客コード: ${customer!.code} ・ 登録日: ${new Date(customer!.createdAt).toLocaleDateString('ja-JP')}`"
          variant="naked"
          orientation="horizontal"
          class="mb-4"
        >
          <div class="flex gap-2 w-fit lg:ms-auto">
            <UButton
              form="customer-edit-form"
              :label="isNew ? '登録する' : '変更を保存'"
              color="neutral"
              type="submit"
              :loading="customerStore.loading"
            />
            <UButton
              v-if="!isNew"
              icon="i-lucide-trash"
              label="削除"
              color="error"
              variant="outline"
              @click="isDeleteModalOpen = true"
            />
          </div>
        </UPageCard>

        <!-- 基本情報 -->
        <UPageCard title="基本情報" variant="subtle" class="mb-4">
          <UFormField
            name="name"
            label="顧客名"
            description="法人名またはお客様名を入力してください。"
            required
            class="flex max-sm:flex-col justify-between items-start gap-4"
          >
            <UInput v-model="state.name" placeholder="株式会社〇〇" autocomplete="off" />
          </UFormField>
          <USeparator />
          <UFormField
            name="furigana"
            label="ふりがな"
            description="顧客名のふりがなを入力してください。"
            class="flex max-sm:flex-col justify-between items-start gap-4"
          >
            <UInput v-model="state.furigana" placeholder="かぶしきがいしゃ〇〇" autocomplete="off" />
          </UFormField>
          <USeparator />
          <UFormField
            name="notes"
            label="備考"
            description="顧客に関するメモを入力できます。"
            class="flex max-sm:flex-col justify-between items-start gap-4"
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
            class="flex max-sm:flex-col justify-between items-start gap-4"
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
                  :placeholder="contact.type === 'email' ? 'example@mail.com' : contact.type === 'phone' ? '03-XXXX-XXXX' : 'FAX番号'"
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
                <UIcon v-else name="i-lucide-star" class="w-4 h-4 text-yellow-500" />
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

        <!-- 情報 -->
        <UPageCard
          v-if="!isNew"
          title="システム情報"
          variant="subtle"
          class="mb-4"
        >
          <UFormField
            label="顧客ID"
            description="システムで自動生成されたIDです。"
            class="flex max-sm:flex-col justify-between items-start gap-4"
          >
            <p class="text-sm text-muted">
              {{ customer!.id }}
            </p>
          </UFormField>
          <USeparator />
          <UFormField
            label="顧客コード"
            description="顧客を識別するコードです。"
            class="flex max-sm:flex-col justify-between items-start gap-4"
          >
            <p class="text-sm text-muted">
              {{ customer!.code }}
            </p>
          </UFormField>
          <USeparator />
          <UFormField
            label="登録日"
            class="flex max-sm:flex-col justify-between items-start gap-4"
          >
            <p class="text-sm text-muted">
              {{ new Date(customer!.createdAt).toLocaleDateString('ja-JP') }}
            </p>
          </UFormField>
          <USeparator />
          <UFormField
            label="最終更新日"
            class="flex max-sm:flex-col justify-between items-start gap-4"
          >
            <p class="text-sm text-muted">
              {{ new Date(customer!.updatedAt).toLocaleDateString('ja-JP') }}
            </p>
          </UFormField>
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
          @click="router.push('/customers')"
        />
      </div>
    </template>
  </UDashboardPanel>

  <!-- 削除確認 -->
  <UModal
    v-model:open="isDeleteModalOpen"
    title="顧客を削除"
    description="この操作は取り消せません。本当に削除しますか？"
  >
    <template #body>
      <p class="text-sm text-muted mb-4">
        <strong>{{ customer?.name }}</strong> を削除します。
      </p>
      <div class="flex justify-end gap-2">
        <UButton
          label="キャンセル"
          color="neutral"
          variant="subtle"
          @click="isDeleteModalOpen = false"
        />
        <UButton label="削除する" color="error" @click="deleteCustomer" />
      </div>
    </template>
  </UModal>
</template>
