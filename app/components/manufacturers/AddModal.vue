<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useManufacturerStore } from '~/stores/manufacturers'

const emit = defineEmits<{ saved: [] }>()
const mfrStore = useManufacturerStore()
const toast = useToast()

const contactMethods = [
  { label: 'メール', value: 'email' },
  { label: 'FAX', value: 'fax' },
  { label: '電話', value: 'phone' }
]

const schema = z.object({
  name: z.string().min(1, 'メーカー名は必須です'),
  furigana: z.string().optional(),
  contactEmail: z.string().email('正しいメールアドレスを入力してください').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  faxNumber: z.string().optional(),
  preferredContactMethod: z.enum(['email', 'fax', 'phone']),
  notes: z.string().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: '',
  furigana: '',
  contactEmail: '',
  contactPhone: '',
  faxNumber: '',
  preferredContactMethod: 'email',
  notes: ''
})

const tags = ref<string[]>([])
const newTag = ref('')
const categories = ref<string[]>([])
const newCategory = ref('')

function addTag() {
  const t = newTag.value.trim()
  if (t && !tags.value.includes(t)) tags.value.push(t)
  newTag.value = ''
}

function addCategory() {
  const c = newCategory.value.trim()
  if (c && !categories.value.includes(c)) categories.value.push(c)
  newCategory.value = ''
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await mfrStore.createManufacturer({
      name: event.data.name,
      code: `M${Date.now().toString().slice(-4)}`,
      furigana: event.data.furigana,
      tags: tags.value,
      contactEmail: event.data.contactEmail || undefined,
      contactPhone: event.data.contactPhone || undefined,
      faxNumber: event.data.faxNumber || undefined,
      preferredContactMethod: event.data.preferredContactMethod,
      productCategories: categories.value,
      notes: event.data.notes
    })
    toast.add({ title: 'メーカーを追加しました', color: 'success' })
    emit('saved')
  } catch {
    toast.add({ title: 'メーカーの追加に失敗しました', color: 'error' })
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="メーカー名" name="name" required>
      <UInput v-model="state.name" placeholder="株式会社〇〇" class="w-full" />
    </UFormField>

    <UFormField label="ふりがな" name="furigana">
      <UInput v-model="state.furigana" placeholder="かぶしきがいしゃ〇〇" class="w-full" />
    </UFormField>

    <div class="grid grid-cols-2 gap-3">
      <UFormField label="メールアドレス" name="contactEmail">
        <UInput v-model="state.contactEmail" placeholder="info@example.jp" class="w-full" />
      </UFormField>
      <UFormField label="電話番号" name="contactPhone">
        <UInput v-model="state.contactPhone" placeholder="03-XXXX-XXXX" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <UFormField label="FAX番号" name="faxNumber">
        <UInput v-model="state.faxNumber" placeholder="03-XXXX-XXXX" class="w-full" />
      </UFormField>
      <UFormField label="優先連絡方法" name="preferredContactMethod">
        <USelect v-model="state.preferredContactMethod" :items="contactMethods" class="w-full" />
      </UFormField>
    </div>

    <!-- タグ -->
    <div class="space-y-2">
      <label class="text-sm font-medium">タグ</label>
      <div class="flex gap-2">
        <UInput v-model="newTag" placeholder="タグを入力..." class="flex-1" @keyup.enter="addTag" />
        <UButton icon="i-lucide-plus" label="追加" variant="outline" size="sm" @click="addTag" />
      </div>
      <div v-if="tags.length" class="flex flex-wrap gap-1">
        <UBadge v-for="tag in tags" :key="tag" variant="soft" class="cursor-pointer" @click="tags = tags.filter(t => t !== tag)">
          {{ tag }} <UIcon name="i-lucide-x" class="ml-1 w-3 h-3" />
        </UBadge>
      </div>
    </div>

    <!-- 商品カテゴリ -->
    <div class="space-y-2">
      <label class="text-sm font-medium">商品カテゴリ</label>
      <div class="flex gap-2">
        <UInput v-model="newCategory" placeholder="カテゴリを入力..." class="flex-1" @keyup.enter="addCategory" />
        <UButton icon="i-lucide-plus" label="追加" variant="outline" size="sm" @click="addCategory" />
      </div>
      <div v-if="categories.length" class="flex flex-wrap gap-1">
        <UBadge v-for="cat in categories" :key="cat" variant="soft" color="success" class="cursor-pointer" @click="categories = categories.filter(c => c !== cat)">
          {{ cat }} <UIcon name="i-lucide-x" class="ml-1 w-3 h-3" />
        </UBadge>
      </div>
    </div>

    <UFormField label="備考" name="notes">
      <UTextarea v-model="state.notes" :rows="2" class="w-full" />
    </UFormField>

    <div class="flex justify-end gap-2 pt-2">
      <UButton label="登録" color="primary" type="submit" :loading="mfrStore.loading" />
    </div>
  </UForm>
</template>
