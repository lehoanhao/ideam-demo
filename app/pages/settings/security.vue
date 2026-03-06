<script setup lang="ts">
import * as z from 'zod'
import type { FormError } from '@nuxt/ui'

const passwordSchema = z.object({
  current: z.string().min(8, '8文字以上入力してください'),
  new: z.string().min(8, '8文字以上入力してください')
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
  current: '',
  new: ''
})

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: 'new', message: '新しいパスワードは現在のパスワードと別のものを入力してください' })
  }
  return errors
}
</script>

<template>
  <UPageCard
    title="パスワード変更"
    description="新しいパスワードを設定する前に現在のパスワードを入力してください。"
    variant="subtle"
  >
    <UForm
      :schema="passwordSchema"
      :state="password"
      :validate="validate"
      class="flex flex-col gap-4 max-w-xs"
    >
      <UFormField name="current">
        <UInput
          v-model="password.current"
          type="password"
          placeholder="現在のパスワード"
          class="w-full"
        />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="password.new"
          type="password"
          placeholder="新しいパスワード"
          class="w-full"
        />
      </UFormField>

      <UButton label="更新する" class="w-fit" type="submit" />
    </UForm>
  </UPageCard>

  <UPageCard
    title="アカウント"
    description="サービスを停止する場合はここからアカウントを削除できます。この操作は元に戻せません。すべてのデータが永久に削除されます。"
    class="bg-gradient-to-tl from-error/10 from-5% to-default"
  >
    <template #footer>
      <UButton label="アカウントを削除" color="error" />
    </template>
  </UPageCard>
</template>
