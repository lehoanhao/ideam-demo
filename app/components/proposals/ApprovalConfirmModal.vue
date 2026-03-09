<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  approved: []
}>()

const slideKey = ref(0)

watch(open, (val) => {
  if (val) slideKey.value++
})
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{ content: 'sm:max-w-md' }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-material-symbols-order-approve"
          class="size-5 text-success"
        />
        <h3 class="text-base font-semibold">
          承認の確認
        </h3>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <p class="text-sm text-muted">
          この提案を承認します。スライドして確認してください。
        </p>

        <ProposalsSlideToConfirm
          :key="slideKey"
          label="スライドして承認"
          confirmed-label="承認しました"
          icon="i-lucide-chevrons-right"
          confirmed-icon="i-lucide-check"
          color="success"
          @confirmed="emit('approved')"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end w-full">
        <UButton
          label="キャンセル"
          color="neutral"
          variant="outline"
          @click="open = false"
        />
      </div>
    </template>
  </UModal>
</template>
