<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false, middleware: [] })

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function login() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(form.value.email, form.value.password)
    toast.add({ title: 'ログインしました', color: 'success' })
    router.push('/')
  } catch (e: any) {
    error.value = e.data?.message || authStore.error || 'ログインに失敗しました'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">IDEAM</h1>
        <p class="mt-2 text-sm text-muted-foreground">提案管理システム</p>
      </div>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">ログイン</h2>
        </template>

        <form class="space-y-4" @submit.prevent="login">
          <UFormField label="メールアドレス" required>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="example@ideam.co.jp"
              icon="i-lucide-mail"
              autocomplete="email"
              class="w-full"
            />
          </UFormField>

          <UFormField label="パスワード" required>
            <UInput
              v-model="form.password"
              type="password"
              placeholder="パスワードを入力..."
              icon="i-lucide-lock"
              autocomplete="current-password"
              class="w-full"
            />
          </UFormField>

          <UAlert
            v-if="error"
            color="error"
            variant="subtle"
            :title="error"
            icon="i-lucide-alert-circle"
          />

          <UButton
            type="submit"
            label="ログイン"
            block
            :loading="loading"
            icon="i-lucide-log-in"
          />
        </form>

        <template #footer>
          <p class="text-xs text-center text-muted-foreground">
            デモ用アカウント: kato@ideam.co.jp / password
          </p>
        </template>
      </UCard>
    </div>
  </div>
</template>
