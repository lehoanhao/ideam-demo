<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const items = ref([
  { label: 'A01: 総代会', value: 'A01' },
  { label: 'A02: 理事会', value: 'A02' },
  { label: 'A03: 周年記念', value: 'A03' },
  { label: 'B01: 展示会', value: 'B01' },
  { label: 'B02: キャンペーン', value: 'B02' },
  { label: 'B03: 販促イベント', value: 'B03' },
  { label: 'C01: 新商品発表', value: 'C01' },
  { label: 'C02: セミナー', value: 'C02' }
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
      content: 'min-w-48'
    }"
  />
</template>
