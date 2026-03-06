<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const items = ref([
  { label: '0: 未依頼', value: '0' },
  { label: '1: 見積依頼中', value: '1' },
  { label: '2: 見積回答済', value: '2' },
  { label: '3: 再見積依頼', value: '3' },
  { label: '4: 見積辞退', value: '4' },
  { label: '9: 対象外', value: '9' }
] satisfies SelectMenuItem[])

const value = ref(items.value[0])

defineProps<{
  variant?: string
}>()
</script>

<template>
  <USelectMenu
    v-model="value"
    :items="items"
    :variant="(variant as any)"
    class="w-full"
    :ui="{
      content: 'min-w-44'
    }"
  />
</template>
