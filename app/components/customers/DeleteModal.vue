<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
}>(), {
  count: 0
})

const open = ref(false)

async function onSubmit() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`${count}件の顧客を削除`"
    description="この操作は取り消せません。本当に削除しますか？"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="キャンセル"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="削除する"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>

