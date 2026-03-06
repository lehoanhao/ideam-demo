<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const items = ref([
  { label: '01: 伊藤忠食品', value: '01' },
  { label: '02: 三菱食品', value: '02' },
  { label: '03: 加藤産業', value: '03' },
  { label: '04: 日本アクセス', value: '04' },
  { label: '05: 国分グループ', value: '05' },
  { label: '06: トーカン', value: '06' },
  { label: '07: ヤマエ久野', value: '07' },
  { label: '08: 丸紅食料', value: '08' },
  { label: '09: 大木ヘルスケア', value: '09' },
  { label: '10: あらた', value: '10' },
  { label: '99: その他', value: '99' }
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
