<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const items = ref([
  { label: 'A: 総務', value: 'A' },
  { label: 'B: 営業', value: 'B' },
  { label: 'C: 企画', value: 'C' },
  { label: 'D: 経理', value: 'D' },
  { label: 'E: 人事', value: 'E' },
  { label: 'F: 生産', value: 'F' },
  { label: 'G: 物流', value: 'G' },
  { label: 'H: 品質管理', value: 'H' }
] satisfies SelectMenuItem[])

const value = ref(items.value[0])
</script>

<template>
  <USelectMenu
    v-model="value"
    :items="items"
    class="w-full"
    :ui="{
      content: 'min-w-48'
    }"
  />
</template>
