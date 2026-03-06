<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useCustomerStore } from '~/stores/customers'

const props = defineProps<{
  open: boolean
}>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  'saved': []
}>()

const customerStore = useCustomerStore()
const toast = useToast()

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
const contacts = ref([
  { id: '1', type: 'email', value: '', name: '', isPrimary: true }
])

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
    emit('saved')
    emit('update:open', false)
    resetForm()
  } catch {
    toast.add({ title: '顧客の追加に失敗しました', color: 'error' })
  }
}

function resetForm() {
  state.name = ''
  state.furigana = ''
  state.notes = ''
  tags.value = []
  newTag.value = ''
  contacts.value = [{ id: '1', type: 'email', value: '', name: '', isPrimary: true }]
}
</script>

<template>
  <UModal
    :open="open"
    title="顧客追加"
    description="新しい顧客情報を入力してください"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-5"
        @submit="onSubmit"
      >
        <!-- 基本情報 -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-highlighted">
            基本情報
          </h3>

          <UFormField label="顧客名" name="name" required>
            <UInput v-model="state.name" placeholder="株式会社〇〇" class="w-full" />
          </UFormField>

          <UFormField label="ふりがな" name="furigana">
            <UInput v-model="state.furigana" placeholder="かぶしきがいしゃ〇〇" class="w-full" />
          </UFormField>
        </div>

        <!-- タグ -->
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-highlighted">
            タグ
          </h3>
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

        <!-- 連絡先 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-highlighted">
              連絡先
            </h3>
            <UButton
              icon="i-lucide-plus"
              label="連絡先追加"
              size="xs"
              variant="ghost"
              @click="addContact"
            />
          </div>

          <div
            v-for="contact in contacts"
            :key="contact.id"
            class="border border-default rounded-lg p-3 space-y-2"
          >
            <div class="flex items-center gap-2">
              <USelect
                v-model="contact.type"
                :items="contactTypes"
                size="sm"
                class="w-28"
              />
              <UInput
                v-model="contact.value"
                :placeholder="contact.type === 'email' ? 'example@mail.com' : contact.type === 'phone' ? '03-XXXX-XXXX' : 'FAX番号'"
                class="flex-1"
                size="sm"
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
              size="sm"
            />
          </div>
        </div>

        <!-- 備考 -->
        <UFormField label="備考" name="notes">
          <UTextarea v-model="state.notes" placeholder="メモを入力してください..." :rows="3" class="w-full" />
        </UFormField>

        <div class="flex justify-end gap-2 pt-2">
          <UButton
            label="キャンセル"
            color="neutral"
            variant="subtle"
            @click="$emit('update:open', false)"
          />
          <UButton
            label="登録"
            color="primary"
            type="submit"
            :loading="customerStore.loading"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

