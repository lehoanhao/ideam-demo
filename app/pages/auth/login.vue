<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth',
  middleware: []
})

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const loading = ref(false)

const fields = [
  {
    name: 'email',
    type: 'text' as const,
    label: 'メールアドレス',
    placeholder: 'example@ideam.co.jp',
    icon: 'i-lucide-mail',
    autocomplete: 'email',
    required: true
  },
  {
    name: 'password',
    label: 'パスワード',
    type: 'password' as const,
    placeholder: 'パスワードを入力...',
    icon: 'i-lucide-lock',
    autocomplete: 'current-password',
    required: true
  }
]

const schema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください')
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await authStore.login(event.data.email, event.data.password)
    toast.add({ title: 'ログインしました', color: 'success' })
    router.push('/')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    toast.add({
      title: err.data?.message || authStore.error || 'ログインに失敗しました',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :loading="loading"
    title="ログイン"
    description="IDEAM 提案管理システム"
    icon="i-lucide-lock"
    :submit="{ label: 'ログイン', icon: 'i-lucide-log-in' }"
    @submit="onSubmit"
  >
    <template #password-hint>
      <ULink
        to="/auth/forgot-password"
        class="text-primary font-medium"
        tabindex="-1"
      >
        パスワードをお忘れですか？
      </ULink>
    </template>

    <template #footer>
      <p class="text-xs text-center text-muted">
        デモ用アカウント: kato@ideam.co.jp / password
      </p>
    </template>
  </UAuthForm>
</template>
