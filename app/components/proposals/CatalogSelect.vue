<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const items = ref([
  { label: 'SP-2026春夏', value: 'CAT001', icon: 'i-heroicons-book-open' },
  { label: 'SP-2025秋冬', value: 'CAT002', icon: 'i-heroicons-book-open' },
  { label: 'ギフトカタログ Vol.12', value: 'CAT003', icon: 'i-heroicons-gift' },
  { label: '記念品セレクション 2026', value: 'CAT004', icon: 'i-heroicons-star' },
  { label: '総合カタログ 2026', value: 'CAT005', icon: 'i-heroicons-rectangle-stack' },
  { label: 'オフィス用品カタログ', value: 'CAT006', icon: 'i-heroicons-briefcase' },
  { label: '食品ギフト Vol.8', value: 'CAT007', icon: 'i-heroicons-cake' },
  { label: '販促グッズ 2026', value: 'CAT008', icon: 'i-heroicons-megaphone' },
  { label: 'エコカタログ Vol.3', value: 'CAT009', icon: 'i-heroicons-globe-alt' },
  { label: 'プレミアムセレクション', value: 'CAT010', icon: 'i-heroicons-sparkles' }
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
    :icon="value?.icon"
    :variant="(variant as any)"
    class="w-full"
    :ui="{
      content: 'min-w-48'
    }"
  />
</template>
