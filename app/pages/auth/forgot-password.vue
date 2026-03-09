<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
  middleware: []
})

const toast = useToast()
const loading = ref(false)
const submitted = ref(false)

const fields = [
  {
    name: 'email',
    type: 'text' as const,
    label: 'メールアドレス',
    placeholder: 'example@ideam.co.jp',
    icon: 'i-lucide-mail',
    autocomplete: 'email',
    required: true
  }
]

const schema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください')
})

type Schema = z.output<typeof schema>

async function onSubmit(_event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    // TODO: API call to send reset email
    await new Promise(resolve => setTimeout(resolve, 1000))
    submitted.value = true
    toast.add({ title: 'リセットメールを送信しました', color: 'success' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UAuthForm
    v-if="!submitted"
    :fields="fields"
    :schema="schema"
    :loading="loading"
    title="ユーザID・パスワード忘れ"
    description="登録済みのメールアドレスをご入力ください"
    icon="i-lucide-key-round"
    :submit="{ label: 'リセットメールを送信', icon: 'i-lucide-send' }"
    @submit="onSubmit"
  >
    <template #footer>
      <div class="text-center">
        <ULink
          to="/auth/login"
          class="text-sm text-primary font-medium"
        >
          ← ログインページに戻る
        </ULink>
      </div>
    </template>
  </UAuthForm>

  <div v-else class="space-y-6">
    <div class="text-center space-y-1">
      <div class="flex justify-center mb-4">
        <div class="flex items-center justify-center size-10 rounded-lg bg-primary-100 border border-primary">
          <UIcon name="i-lucide-key-round" size="md" class="text-primary" />
        </div>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        ユーザID・パスワード忘れ
      </h1>
    </div>

    <UAlert
      color="success"
      variant="subtle"
      title="メールを送信しました"
      description="パスワードリセットの手順をメールで送信しました。メールをご確認ください。"
      icon="i-lucide-check-circle"
    />

    <div class="text-center">
      <ULink
        to="/auth/login"
        class="text-sm text-primary font-medium"
      >
        ← ログインページに戻る
      </ULink>
    </div>
  </div>
</template>
